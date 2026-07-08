import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { markAttendance, markAllPresent, saveScores, setSessionDate } from "./actions";
import { loadMatrix, STATUS_META } from "./matrix";

export const metadata = { title: "Điểm danh · F&B-FCA" };
export const dynamic = "force-dynamic";

function fmtDate(d: string | null) {
  if (!d) return null;
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(d + "T00:00:00+07:00"));
}

const STATUSES: { key: string; label: string; on: string }[] = [
  { key: "present", label: "Có mặt", on: "bg-success text-ink border-success" },
  { key: "excused", label: "Xin phép", on: "bg-[#6FA3C0] text-ink border-[#6FA3C0]" },
  { key: "late", label: "Trễ", on: "bg-gold text-ink border-gold" },
  { key: "absent", label: "Vắng", on: "bg-danger text-ink border-danger" },
];

function scoreColor(v: number) {
  if (v >= 80) return "#7FB595";
  if (v >= 50) return "#C9A24A";
  return "#D98A7E";
}

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

  const sessionsRes = await supabase.from("sessions").select("id, no, title, date").order("no");
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

  const [matrix, attRes] = await Promise.all([
    loadMatrix(supabase),
    active
      ? supabase.from("attendance").select("student_id, status").eq("session_id", active.id)
      : Promise.resolve({ data: [] as { student_id: string; status: string }[] }),
  ]);
  const statusOf = new Map((attRes.data || []).map((a) => [a.student_id, a.status]));

  const mrows = "error" in matrix ? [] : matrix.rows;
  const msessions = "error" in matrix ? [] : matrix.sessions;
  const students = mrows.map((r) => ({ id: r.id, student_code: r.student_code, full_name: r.full_name }));

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-gold/20 pb-6">
        <div>
          <p className="eyebrow">F&amp;B-FCA</p>
          <h1 className="mt-1 font-display text-3xl text-cream sm:text-4xl">Điểm danh &amp; Bảng điểm</h1>
          <p className="mt-1 text-sm text-sage">Báo cáo tổng thể lớp · {mrows.length} sinh viên · {msessions.length} buổi</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <a href="/app/attendance/export?format=xlsx" className="h-10 rounded-lg bg-gold px-4 text-sm font-semibold leading-10 text-ink transition hover:bg-gold-soft">Xuất Excel ↓</a>
          <a href="/app/attendance/print" target="_blank" className="h-10 rounded-lg border border-gold/40 px-4 text-sm leading-10 text-gold transition hover:bg-gold hover:text-ink">Xuất PDF ↧</a>
        </div>
      </header>

      {/* ===== BÁO CÁO TỔNG THỂ (ma trận) ===== */}
      <section className="mb-4">
        {/* Chú thích màu */}
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sage">
          {Object.entries(STATUS_META).map(([k, m]) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ background: m.color }} />
              {m.label} ({m.short})
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm border border-gold/30" /> Chưa điểm danh</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gold/20">
          <table className="min-w-max text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-ink-deep px-3 py-2 text-left text-xs font-medium text-ink" style={{ background: "#C9A24A", minWidth: 190 }}>Sinh viên</th>
                {msessions.map((s) => (
                  <th key={s.id} title={fmtDate(s.date) ? `Buổi ${s.no} · ${fmtDate(s.date)}` : `Buổi ${s.no}`} className="w-8 px-0 py-2 text-center text-[11px] font-semibold text-ink" style={{ background: "#C9A24A", borderLeft: "1px solid rgba(4,39,38,0.15)" }}>{s.no}</th>
                ))}
                <th className="px-2 py-2 text-center text-[11px] font-semibold text-ink" style={{ background: "#B8923F", minWidth: 64 }}>Attendance<br /><span className="font-normal">/100 (auto)</span></th>
                <th className="px-2 py-2 text-center text-[11px] font-semibold text-ink" style={{ background: "#B8923F", minWidth: 72 }}>Chuyên cần<br /><span className="font-normal">/100</span></th>
                <th className="px-2 py-2 text-center text-[11px] font-semibold text-ink" style={{ background: "#B8923F", minWidth: 80 }}>Phù hợp<br />chuyên ngành</th>
                <th className="px-2 py-2 text-center text-[11px] font-semibold text-ink" style={{ background: "#B8923F", minWidth: 58 }}>Quiz<br /><span className="font-normal">/100 (auto)</span></th>
                <th className="px-2 py-2 text-center text-[11px] font-semibold text-ink" style={{ background: "#A8884E", minWidth: 56 }}>Tổng kết<br /><span className="font-normal">/100</span></th>
                <th className="px-2 py-2 text-center text-[11px] font-semibold text-ink" style={{ background: "#A8884E" }}>Lưu</th>
              </tr>
            </thead>
            <tbody>
              {mrows.map((r) => (
                <tr key={r.id} className="border-t border-gold/10">
                  <td className="sticky left-0 z-10 bg-ink-deep px-3 py-1.5">
                    <div className="text-cream">{r.full_name}</div>
                    <div className="font-mono text-[10px] text-sage">{r.student_code}</div>
                  </td>
                  {r.cells.map((c, i) => {
                    const m = c ? STATUS_META[c] : null;
                    return (
                      <td key={i} className="h-9 w-8 border-l border-ink/40 text-center text-[11px] font-bold" style={m ? { background: m.color, color: "#042726" } : { color: "#5f6f68" }}>
                        {m ? m.short : "·"}
                      </td>
                    );
                  })}
                  <td className="px-2 py-1.5 text-center font-display text-base" style={{ color: scoreColor(r.attendance100) }}>{r.attendance100}</td>
                  <td className="px-1 py-1.5">
                    <input form={`sc-${r.id}`} name="diligence" defaultValue={r.diligence ?? ""} inputMode="numeric" placeholder="—" aria-label={`Chuyên cần /100 — ${r.full_name}`}
                      className="h-8 w-16 rounded border border-gold/25 bg-ink px-2 text-center text-cream outline-none focus:border-gold" />
                  </td>
                  <td className="px-1 py-1.5">
                    <input form={`sc-${r.id}`} name="major_fit" defaultValue={r.major_fit ?? ""} inputMode="numeric" placeholder="—" aria-label={`Phù hợp chuyên ngành /100 — ${r.full_name}`}
                      className="h-8 w-16 rounded border border-gold/25 bg-ink px-2 text-center text-cream outline-none focus:border-gold" />
                  </td>
                  <td className="px-2 py-1.5 text-center font-display text-base" style={{ color: r.quiz100 == null ? "#5f6f68" : scoreColor(r.quiz100) }}>{r.quiz100 ?? "—"}</td>
                  <td className="px-2 py-1.5 text-center font-display text-lg" style={{ color: scoreColor(r.tb) }}>{r.tb}</td>
                  <td className="px-2 py-1.5 text-center">
                    <form id={`sc-${r.id}`} action={saveScores}>
                      <input type="hidden" name="student_id" value={r.id} />
                      <button className="h-8 rounded bg-gold/90 px-3 text-xs font-semibold text-ink transition hover:bg-gold">Lưu</button>
                    </form>
                  </td>
                </tr>
              ))}
              {mrows.length === 0 && (
                <tr><td colSpan={msessions.length + 6} className="px-4 py-10 text-center text-sage">Chưa có sinh viên.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-sage">
          15 ô mỗi dòng = trạng thái điểm danh từng buổi (sửa ở phần &quot;Điểm danh theo buổi&quot; bên dưới). <b className="text-mist">Attendance</b> tự tính từ điểm danh
          (có mặt =100, trễ =50, xin phép: loại khỏi mẫu số). <b className="text-mist">Chuyên cần</b> &amp; <b className="text-mist">Phù hợp chuyên ngành</b> nhập tay 0–100.
<b className="text-mist">Quiz</b> tự tính từ điểm bài kiểm tra (điểm cao nhất mỗi đề). Tổng kết = trung bình các cột đã có. Nhập điểm rồi bấm <b className="text-mist">Lưu</b>.
        </p>
      </section>

      {/* ===== ĐIỂM DANH THEO BUỔI ===== */}
      <section className="mt-10 border-t border-gold/20 pt-8">
        <h2 className="mb-4 font-display text-2xl text-cream">Điểm danh theo buổi</h2>
        <div className="mb-6 flex flex-wrap gap-2">
          {sessions.map((s) => (
            <Link
              key={s.id}
              href={`/app/attendance?session=${s.id}`}
              title={fmtDate(s.date) ? `Buổi ${s.no} · ${fmtDate(s.date)}` : `Buổi ${s.no} (chưa đặt ngày)`}
              className={`flex h-11 w-9 flex-col items-center justify-center rounded-lg text-center text-sm leading-none transition ${
                active?.id === s.id ? "bg-gold font-semibold text-ink" : "border border-gold/25 text-mist hover:border-gold"
              }`}
            >
              <span>{s.no}</span>
              {fmtDate(s.date) && <span className="mt-0.5 text-[8px] opacity-70">{fmtDate(s.date)}</span>}
            </Link>
          ))}
        </div>

        {active && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-2xl text-cream">Buổi {active.no}</span>
              <form action={setSessionDate} className="flex items-center gap-1.5">
                <input type="hidden" name="session_id" value={active.id} />
                <label htmlFor="sess-date" className="text-xs text-sage">Ngày:</label>
                <input id="sess-date" type="date" name="date" defaultValue={active.date || ""} className="h-8 rounded-md border border-gold/25 bg-ink px-2 text-sm text-cream" />
                <button className="h-8 rounded-md border border-gold/30 px-2.5 text-xs text-gold transition hover:bg-gold hover:text-ink">Lưu ngày</button>
              </form>
            </div>
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
                <div className="flex flex-wrap gap-2">
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
      </section>
    </main>
  );
}
