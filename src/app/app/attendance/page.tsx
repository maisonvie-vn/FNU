import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { markAttendance, markAllPresent } from "./actions";

export const metadata = { title: "Điểm danh · Food Culture & Aesthetic" };
export const dynamic = "force-dynamic";

const STATUSES: { key: string; label: string; on: string }[] = [
  { key: "present", label: "Có mặt", on: "bg-success text-ink border-success" },
  { key: "late", label: "Trễ", on: "bg-gold text-ink border-gold" },
  { key: "absent", label: "Vắng", on: "bg-danger text-ink border-danger" },
];

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session: sessionParam } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const sessionsRes = await supabase.from("sessions").select("id, no, title").order("no");
  if (sessionsRes.error) {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-16 text-center">
        <h1 className="font-display text-3xl text-cream">Cần chạy migration 0002</h1>
        <p className="mt-3 text-sage">Mở Supabase → SQL Editor, dán <code className="text-gold">supabase/migrations/0002_gradebook_attendance.sql</code> rồi Run.</p>
      </main>
    );
  }

  const sessions = sessionsRes.data || [];
  const active = sessions.find((s) => s.id === sessionParam) || sessions[0];

  const [studentsRes, attRes] = await Promise.all([
    supabase.from("students").select("id, student_code, full_name").order("student_code"),
    active
      ? supabase.from("attendance").select("student_id, status").eq("session_id", active.id)
      : Promise.resolve({ data: [] as { student_id: string; status: string }[] }),
  ]);

  const students = studentsRes.data || [];
  const statusOf = new Map((attRes.data || []).map((a) => [a.student_id, a.status]));

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-gold/20 pb-6">
        <div>
          <p className="eyebrow">Food Culture &amp; Aesthetic</p>
          <h1 className="mt-1 font-display text-4xl text-cream">Điểm danh</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/app/gradebook" className="h-10 rounded-lg border border-gold/30 px-4 text-sm leading-10 text-mist transition hover:border-gold hover:text-gold">Bảng điểm →</Link>
          <Link href="/app" className="h-10 rounded-lg border border-gold/30 px-4 text-sm leading-10 text-mist transition hover:border-gold hover:text-gold">← Giao diện chính</Link>
        </div>
      </header>

      {/* Chọn buổi */}
      <div className="mb-6 flex flex-wrap gap-2">
        {sessions.map((s) => (
          <Link
            key={s.id}
            href={`/app/attendance?session=${s.id}`}
            className={`h-9 w-9 rounded-lg text-center text-sm leading-9 transition ${
              active?.id === s.id ? "bg-gold font-semibold text-ink" : "border border-gold/25 text-mist hover:border-gold"
            }`}
          >
            {s.no}
          </Link>
        ))}
      </div>

      {active && (
        <div className="mb-4 flex items-center justify-between">
          <span className="font-display text-2xl text-cream">Buổi {active.no}</span>
          <form action={markAllPresent}>
            <input type="hidden" name="session_id" value={active.id} />
            <button className="h-9 rounded-lg border border-success/50 px-4 text-sm text-success transition hover:bg-success/10">Cả lớp có mặt</button>
          </form>
        </div>
      )}

      <ul className="space-y-2">
        {students.map((s) => {
          const cur = statusOf.get(s.id);
          return (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/15 bg-ink-deep/30 px-4 py-3">
              <div>
                <span className="font-medium text-cream">{s.full_name}</span>
                <span className="ml-2 font-mono text-xs text-sage">{s.student_code}</span>
              </div>
              <div className="flex gap-2">
                {STATUSES.map((st) => (
                  <form action={markAttendance} key={st.key}>
                    <input type="hidden" name="student_id" value={s.id} />
                    <input type="hidden" name="session_id" value={active?.id} />
                    <input type="hidden" name="status" value={st.key} />
                    <button
                      className={`h-8 rounded-lg border px-3 text-xs transition ${
                        cur === st.key ? st.on : "border-gold/25 text-mist hover:border-gold"
                      }`}
                    >
                      {st.label}
                    </button>
                  </form>
                ))}
              </div>
            </li>
          );
        })}
        {students.length === 0 && (
          <li className="rounded-xl border border-gold/15 px-4 py-10 text-center text-sage">Chưa có sinh viên.</li>
        )}
      </ul>
    </main>
  );
}
