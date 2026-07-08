"use server";

import { createAdminClient } from "@/lib/supabase/admin";

const round1 = (n: number) => Math.round(n * 10) / 10;

export type PortalResult = {
  ok?: boolean;
  error?: string;
  data?: {
    fullName: string;
    studentCode: string;
    cohort: string | null;
    totalSessions: number;
    present: number;
    late: number;
    absent: number;
    attendanceScore: number;
    coursework: number | null;
    final: number | null;
    total: number | null;
    status: string;
    barred: boolean;
    sessions: { no: number; status: string | null }[];
  };
};

// Tra cứu kết quả học tập của chính sinh viên (không cần đăng nhập).
// Xác thực bằng MSSV + Họ tên (phải khớp) để tránh xem nhầm của người khác.
export async function lookupStudent(
  _prev: PortalResult,
  formData: FormData,
): Promise<PortalResult> {
  const code = String(formData.get("student_code") || "").trim();
  const name = String(formData.get("full_name") || "").trim();
  if (!code || !name)
    return { error: "Vui lòng nhập cả Mã sinh viên và Họ tên." };

  const admin = createAdminClient();

  const { data: student } = await admin
    .from("students")
    .select("id, student_code, full_name")
    .eq("student_code", code)
    .single();

  // So khớp tên không phân biệt hoa thường / khoảng trắng thừa
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  if (!student || norm(student.full_name) !== norm(name)) {
    return { error: "Không tìm thấy. Kiểm tra lại Mã sinh viên và Họ tên." };
  }

  const { data: enr } = await admin
    .from("enrollments")
    .select("cohort, status")
    .eq("student_id", student.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!enr || enr.status === "withdrawn") {
    return { error: "Hồ sơ của bạn hiện không còn hoạt động. Vui lòng liên hệ giảng viên." };
  }

  const [sessionsRes, attRes, gradeRes] = await Promise.all([
    admin.from("sessions").select("id, no").order("no"),
    admin.from("attendance").select("session_id, status").eq("student_id", student.id),
    admin.from("grades").select("coursework, final").eq("student_id", student.id).maybeSingle(),
  ]);

  const sessions = sessionsRes.data || [];
  const totalSessions = sessions.length || 15;
  const attMap = new Map((attRes.data || []).map((a) => [a.session_id, a.status]));

  let present = 0, late = 0, absent = 0;
  for (const a of attRes.data || []) {
    if (a.status === "present") present++;
    else if (a.status === "late") late++;
    else absent++;
  }
  const attendanceScore = round1(((present + late * 0.5) / totalSessions) * 10);

  const g = gradeRes.data;
  const coursework = g?.coursework != null ? Number(g.coursework) : null;
  const final = g?.final != null ? Number(g.final) : null;
  const total =
    coursework != null || final != null
      ? round1(attendanceScore * 0.1 + (coursework || 0) * 0.3 + (final || 0) * 0.6)
      : null;
  const barred = absent > totalSessions * 0.2;
  const status = barred ? "CẤM THI" : total == null ? "Đang cập nhật" : total >= 4 ? "ĐẠT" : "CHƯA ĐẠT";

  return {
    ok: true,
    data: {
      fullName: student.full_name,
      studentCode: student.student_code || code,
      cohort: enr.cohort,
      totalSessions,
      present,
      late,
      absent,
      attendanceScore,
      coursework,
      final,
      total,
      status,
      barred,
      sessions: sessions.map((s) => ({ no: s.no, status: attMap.get(s.id) || null })),
    },
  };
}
