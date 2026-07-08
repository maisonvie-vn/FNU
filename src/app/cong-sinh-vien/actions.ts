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
    excused: number;
    attendance100: number;
    diligence: number | null;
    major_fit: number | null;
    quiz100: number | null;
    tb: number | null;
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

  const [sessionsRes, attRes, gradeRes, qaRes] = await Promise.all([
    admin.from("sessions").select("id, no").order("no"),
    admin.from("attendance").select("session_id, status").eq("student_id", student.id),
    admin.from("grades").select("diligence, major_fit").eq("student_id", student.id).maybeSingle(),
    admin.from("quiz_attempts").select("quiz_id, score").eq("student_id", student.id),
  ]);

  const sessions = sessionsRes.data || [];
  const totalSessions = sessions.length || 15;
  const attMap = new Map((attRes.data || []).map((a) => [a.session_id, a.status]));

  let present = 0, late = 0, absent = 0, excused = 0;
  for (const a of attRes.data || []) {
    if (a.status === "present") present++;
    else if (a.status === "late") late++;
    else if (a.status === "excused") excused++; // xin phép: không tính là vắng
    else absent++;
  }
  const r0 = (n: number) => Math.round(n);
  // Điểm chuyên cần (Attendance) /100 — mẫu số = số buổi ĐÃ điểm danh của SV
  const attDenom = Math.max(1, present + late + absent);
  const attendance100 = (present + late + absent) === 0 ? 0 : Math.min(100, r0(((present + late * 0.5) / attDenom) * 100));

  const g = gradeRes.data;
  const diligence = g?.diligence != null ? Number(g.diligence) : null;
  const major_fit = g?.major_fit != null ? Number(g.major_fit) : null;

  // Điểm quiz /100 = TB điểm cao nhất mỗi đề (score /10 → /100)
  const bestByQuiz = new Map<string, number>();
  for (const a of (qaRes.data || []) as { quiz_id: string; score: number | null }[]) {
    if (a.score == null) continue;
    bestByQuiz.set(a.quiz_id, Math.max(bestByQuiz.get(a.quiz_id) ?? 0, Number(a.score)));
  }
  const quiz100 = bestByQuiz.size > 0 ? r0(([...bestByQuiz.values()].reduce((x, y) => x + y, 0) / bestByQuiz.size) * 10) : null;

  const comps = [attendance100, ...(diligence != null ? [diligence] : []), ...(major_fit != null ? [major_fit] : []), ...(quiz100 != null ? [quiz100] : [])];
  const hasAny = diligence != null || major_fit != null || quiz100 != null || (present + late + absent) > 0;
  const tb = hasAny ? r0(comps.reduce((x, y) => x + y, 0) / comps.length) : null;
  const barred = absent > totalSessions * 0.2; // vắng KHÔNG phép quá 20% số buổi
  const status = barred ? "CẤM THI" : tb == null ? "Đang cập nhật" : tb >= 50 ? "ĐẠT" : "CHƯA ĐẠT";

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
      excused,
      attendance100,
      diligence,
      major_fit,
      quiz100,
      tb,
      status,
      barred,
      sessions: sessions.map((s) => ({ no: s.no, status: attMap.get(s.id) || null })),
    },
  };
}
