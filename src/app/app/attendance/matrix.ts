import type { SupabaseClient } from "@supabase/supabase-js";

export type MatrixSession = { id: string; no: number };
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
  const [sessRes, enrRes, attRes, grRes] = await Promise.all([
    supabase.from("sessions").select("id, no").order("no"),
    supabase.from("enrollments").select("students(id, student_code, full_name)").neq("status", "withdrawn"),
    supabase.from("attendance").select("student_id, session_id, status"),
    supabase.from("grades").select("student_id, diligence, major_fit"),
  ]);
  if (sessRes.error) return { error: sessRes.error.message };

  const sessions = (sessRes.data || []) as MatrixSession[];
  const totalSessions = sessions.length || 15;

  type SL = { id: string; student_code: string | null; full_name: string };
  const students = ((enrRes.data || []).map((e) => e.students).filter(Boolean) as unknown as SL[]).sort(
    (a, b) => (a.student_code || "").localeCompare(b.student_code || ""),
  );

  // map[student_id][session_id] = status
  const attMap = new Map<string, Map<string, string>>();
  for (const a of (attRes.data || []) as { student_id: string; session_id: string; status: string }[]) {
    if (!attMap.has(a.student_id)) attMap.set(a.student_id, new Map());
    attMap.get(a.student_id)!.set(a.session_id, a.status);
  }
  const grMap = new Map(
    ((grRes.data || []) as { student_id: string; diligence: number | null; major_fit: number | null }[]).map((g) => [
      g.student_id,
      g,
    ]),
  );

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
    const denom = Math.max(1, totalSessions - excused);
    const attendance100 = Math.min(100, r0(((present + late * 0.5) / denom) * 100));
    const g = grMap.get(s.id);
    const diligence = g?.diligence != null ? Number(g.diligence) : null;
    const major_fit = g?.major_fit != null ? Number(g.major_fit) : null;
    const comps = [attendance100, ...(diligence != null ? [diligence] : []), ...(major_fit != null ? [major_fit] : [])];
    const tb = r0(comps.reduce((a, b) => a + b, 0) / comps.length);
    return { id: s.id, student_code: s.student_code, full_name: s.full_name, cells, present, late, excused, absent, attendance100, diligence, major_fit, tb };
  });

  return { sessions, rows };
}
