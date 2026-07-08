import type { SupabaseClient } from "@supabase/supabase-js";

export type MatrixSession = { id: string; no: number; date: string | null };
export type MatrixRow = {
  id: string;
  student_code: string | null;
  full_name: string;
  cells: (string | null)[]; // theo thứ tự sessions: 'present'|'excused'|'late'|'absent'|null
  present: number;
  late: number;
  excused: number;
  absent: number;
  attendance100: number; // Attendance tự tính /100
  diligence: number | null; // Chuyên cần /100 (nhập tay)
  major_fit: number | null; // Phù hợp chuyên ngành /100 (nhập tay)
  quiz100: number | null; // Điểm bài kiểm tra TB (điểm cao nhất mỗi đề) /100
  tb: number; // trung bình các cột đã có /100
};

export const STATUS_META: Record<string, { label: string; short: string; color: string; textDark?: boolean }> = {
  present: { label: "Có mặt", short: "C", color: "#7FB595", textDark: true },
  excused: { label: "Xin phép", short: "P", color: "#6FA3C0", textDark: true },
  late: { label: "Trễ", short: "T", color: "#C9A24A", textDark: true },
  absent: { label: "Vắng", short: "V", color: "#D98A7E", textDark: true },
};

const r0 = (n: number) => Math.round(n);

export async function loadMatrix(
  supabase: SupabaseClient,
): Promise<{ sessions: MatrixSession[]; rows: MatrixRow[] } | { error: string }> {
  const [sessRes, enrRes, attRes, grRes, qaRes] = await Promise.all([
    supabase.from("sessions").select("id, no, date").order("no"),
    supabase.from("enrollments").select("students(id, student_code, full_name)").neq("status", "withdrawn"),
    supabase.from("attendance").select("student_id, session_id, status"),
    supabase.from("grades").select("student_id, diligence, major_fit"),
    supabase.from("quiz_attempts").select("student_id, quiz_id, score"),
  ]);
  if (sessRes.error) return { error: sessRes.error.message };

  const sessions = (sessRes.data || []) as MatrixSession[];

  type SL = { id: string; student_code: string | null; full_name: string };
  const students = ((enrRes.data || []).map((e) => e.students).filter(Boolean) as unknown as SL[]).sort(
    (a, b) => (a.student_code || "").localeCompare(b.student_code || ""),
  );

  // map[student_id][session_id] = status; đồng thời ghi nhận buổi ĐÃ điểm danh
  const attMap = new Map<string, Map<string, string>>();
  const heldSet = new Set<string>();
  for (const a of (attRes.data || []) as { student_id: string; session_id: string; status: string }[]) {
    if (!attMap.has(a.student_id)) attMap.set(a.student_id, new Map());
    attMap.get(a.student_id)!.set(a.session_id, a.status);
    heldSet.add(a.session_id);
  }
  const heldSessions = heldSet.size; // số buổi đã có điểm danh (đã diễn ra)
  const grMap = new Map(
    ((grRes.data || []) as { student_id: string; diligence: number | null; major_fit: number | null }[]).map((g) => [
      g.student_id,
      g,
    ]),
  );
  // Điểm quiz: điểm CAO NHẤT mỗi đề của mỗi SV → trung bình các đề (score /10 → /100)
  const bestQuiz = new Map<string, Map<string, number>>();
  for (const a of (qaRes.data || []) as { student_id: string; quiz_id: string; score: number | null }[]) {
    if (a.score == null) continue;
    if (!bestQuiz.has(a.student_id)) bestQuiz.set(a.student_id, new Map());
    const m = bestQuiz.get(a.student_id)!;
    m.set(a.quiz_id, Math.max(m.get(a.quiz_id) ?? 0, Number(a.score)));
  }

  const rows: MatrixRow[] = students.map((s) => {
    const sm = attMap.get(s.id) || new Map<string, string>();
    let present = 0, late = 0, excused = 0, absent = 0;
    const cells = sessions.map((sess) => {
      const st = sm.get(sess.id) || null;
      if (st === "present") present++;
      else if (st === "late") late++;
      else if (st === "excused") excused++;
      else if (st === "absent") absent++;
      return st;
    });
    // Mẫu số = số buổi ĐÃ điểm danh (trừ buổi xin phép), không phải tổng 15 buổi
    const denom = Math.max(1, heldSessions - excused);
    const attendance100 = heldSessions === 0 ? 0 : Math.min(100, r0(((present + late * 0.5) / denom) * 100));
    const g = grMap.get(s.id);
    const diligence = g?.diligence != null ? Number(g.diligence) : null;
    const major_fit = g?.major_fit != null ? Number(g.major_fit) : null;
    const qm = bestQuiz.get(s.id);
    const quiz100 = qm && qm.size > 0 ? r0(([...qm.values()].reduce((a, b) => a + b, 0) / qm.size) * 10) : null;
    const comps = [attendance100, ...(diligence != null ? [diligence] : []), ...(major_fit != null ? [major_fit] : []), ...(quiz100 != null ? [quiz100] : [])];
    const tb = r0(comps.reduce((a, b) => a + b, 0) / comps.length);
    return { id: s.id, student_code: s.student_code, full_name: s.full_name, cells, present, late, excused, absent, attendance100, diligence, major_fit, quiz100, tb };
  });

  return { sessions, rows };
}
