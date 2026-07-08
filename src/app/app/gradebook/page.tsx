import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { upsertGrade } from "./actions";

export const metadata = { title: "Bảng điểm · F&B-FCA" };
export const dynamic = "force-dynamic";

const round1 = (n: number) => Math.round(n * 10) / 10;

export default async function GradebookPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [enrollRes, gradesRes, sessionsRes, attRes] = await Promise.all([
    // Chỉ lấy học viên còn đang học (loại trừ người đã bị đánh dấu nghỉ/bảo lưu)
    supabase
      .from("enrollments")
      .select("students(id, student_code, full_name)")
      .neq("status", "withdrawn"),
    supabase.from("grades").select("student_id, coursework, final"),
    supabase.from("sessions").select("id"),
    supabase.from("attendance").select("student_id, status"),
  ]);

  // Bảng chưa tạo → nhắc chạy migration
  if (enrollRes.error || gradesRes.error || sessionsRes.error || attRes.error) {
    return (
      <MigrationNotice
        error={enrollRes.error?.message || gradesRes.error?.message || sessionsRes.error?.message || attRes.error?.message}
      />
    );
  }

  type StudentLite = { id: string; student_code: string | null; full_name: string };
  const students = ((enrollRes.data || [])
    .map((e) => e.students)
    .filter(Boolean) as unknown as StudentLite[])
    .sort((a, b) => (a.student_code || "").localeCompare(b.student_code || ""));
  const grades = new Map((gradesRes.data || []).map((g) => [g.student_id, g]));
  const totalSessions = (sessionsRes.data || []).length || 15;

  // Gom điểm danh theo sinh viên
  const att = new Map<string, { present: number; late: number; absent: number; excused: number }>();
  for (const a of attRes.data || []) {
    const cur = att.get(a.student_id) || { present: 0, late: 0, absent: 0, excused: 0 };
    if (a.status === "present") cur.present++;
    else if (a.status === "late") cur.late++;
    else if (a.status === "excused") cur.excused++; // xin phép: không tính là vắng
    else cur.absent++;
    att.set(a.student_id, cur);
  }

  const rows = students.map((s) => {
    const a = att.get(s.id) || { present: 0, late: 0, absent: 0, excused: 0 };
    // Nghỉ có phép được loại khỏi mẫu số (không bị trừ điểm chuyên cần)
    const denom = Math.max(1, totalSessions - a.excused);
    const attendance = Math.min(10, round1(((a.present + a.late * 0.5) / denom) * 10));
    const g = grades.get(s.id);
    const coursework = g?.coursework != null ? Number(g.coursework) : null;
    const final = g?.final != null ? Number(g.final) : null;
    const total =
      coursework != null || final != null
        ? round1(attendance * 0.1 + (coursework || 0) * 0.3 + (final || 0) * 0.6)
        : null;
    const barred = a.absent > totalSessions * 0.2;
    let status: { label: string; cls: string };
    if (barred) status = { label: "CẤM THI", cls: "text-danger" };
    else if (total == null) status = { label: "—", cls: "text-sage" };
    else if (total >= 4) status = { label: "ĐẠT", cls: "text-success" };
    else status = { label: "KHÔNG ĐẠT", cls: "text-danger" };
    return { s, attendance, coursework, final, total, status };
  });

  // ----- Tổng quan điểm lớp -----
  const graded = rows.filter((r) => r.total != null);
  const avg = (arr: number[]) => (arr.length ? round1(arr.reduce((a, b) => a + b, 0) / arr.length) : null);
  const avgTotal = avg(graded.map((r) => r.total as number));
  const avgAtt = avg(rows.map((r) => r.attendance));
  const avgCw = avg(rows.filter((r) => r.coursework != null).map((r) => r.coursework as number));
  const avgFn = avg(rows.filter((r) => r.final != null).map((r) => r.final as number));
  const cPass = rows.filter((r) => r.status.label === "ĐẠT").length;
  const cFail = rows.filter((r) => r.status.label === "KHÔNG ĐẠT").length;
  const cBar = rows.filter((r) => r.status.label === "CẤM THI").length;
  const cNone = rows.filter((r) => r.status.label === "—").length;

  const buckets = [
    { label: "Giỏi", sub: "8.0–10", color: "#7FB595", n: graded.filter((r) => (r.total as number) >= 8).length },
    { label: "Khá", sub: "6.5–7.9", color: "#C9A24A", n: graded.filter((r) => (r.total as number) >= 6.5 && (r.total as number) < 8).length },
    { label: "Trung bình", sub: "5.0–6.4", color: "#A8884E", n: graded.filter((r) => (r.total as number) >= 5 && (r.total as number) < 6.5).length },
    { label: "Yếu", sub: "4.0–4.9", color: "#c98a4e", n: graded.filter((r) => (r.total as number) >= 4 && (r.total as number) < 5).length },
    { label: "Kém", sub: "< 4.0", color: "#D98A7E", n: graded.filter((r) => (r.total as number) < 4).length },
  ];
  const maxB = Math.max(1, ...buckets.map((b) => b.n));

  const stats = [
    { label: "Sĩ số lớp", en: "Class size", value: students.length, color: "#C9A24A" },
    { label: "Điểm TB lớp", en: "Class average", value: avgTotal ?? "—", color: "#E2CD96" },
    { label: "Đạt", en: "Passed", value: cPass, color: "#7FB595" },
    { label: "Chưa đạt / Cấm thi", en: "Failed / barred", value: cFail + cBar, color: "#D98A7E" },
  ];
  const comps = [
    { label: "Chuyên cần", en: "Attendance", w: "10%", v: avgAtt, color: "#7FB595" },
    { label: "Quá trình", en: "Coursework", w: "30%", v: avgCw, color: "#C9A24A" },
    { label: "Cuối kỳ", en: "Final", w: "60%", v: avgFn, color: "#E2CD96" },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Header count={students.length} />

      {/* Tổng quan điểm lớp */}
      <section className="mb-8">
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-gold/20 bg-ink-deep/40 p-4">
              <div className="font-display text-3xl sm:text-4xl" style={{ color: s.color }}>{s.value}</div>
              <div className="mt-1 text-sm font-medium text-cream">{s.label}</div>
              <div className="text-xs text-sage">{s.en}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Phân bố xếp loại */}
          <div className="rounded-2xl border border-gold/20 bg-ink-deep/40 p-5">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-xl text-cream">Phân bố xếp loại</h2>
              <span className="text-xs text-sage">{graded.length}/{students.length} đã có điểm{cNone ? ` · ${cNone} chưa chấm` : ""}</span>
            </div>
            <div className="space-y-2.5">
              {buckets.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <div className="w-24 shrink-0 text-right">
                    <div className="text-sm text-cream">{b.label}</div>
                    <div className="text-[10px] text-sage">{b.sub}</div>
                  </div>
                  <div className="h-6 flex-1 overflow-hidden rounded-md bg-ink/60">
                    <div className="flex h-full items-center rounded-md pl-2 text-xs font-semibold text-ink transition-all" style={{ width: `${Math.max(b.n ? 12 : 0, (b.n / maxB) * 100)}%`, background: b.color }}>
                      {b.n > 0 ? b.n : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trung bình theo cấu phần điểm */}
          <div className="rounded-2xl border border-gold/20 bg-ink-deep/40 p-5">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-xl text-cream">Điểm trung bình theo cấu phần</h2>
              <span className="text-xs text-sage">thang 10</span>
            </div>
            <div className="space-y-4">
              {comps.map((c) => (
                <div key={c.label}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span className="text-cream">{c.label} <span className="text-xs text-sage">· {c.en} · {c.w}</span></span>
                    <span className="font-display text-lg" style={{ color: c.color }}>{c.v ?? "—"}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-ink/60">
                    <div className="h-full rounded-full" style={{ width: `${((c.v ?? 0) / 10) * 100}%`, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-sage">
              Tổng kết = Chuyên cần×10% + Quá trình×30% + Cuối kỳ×60%. Đạt khi ≥ 4.0; vắng quá 20% → cấm thi.
            </p>
          </div>
        </div>
      </section>

      <div className="overflow-x-auto rounded-xl border border-gold/20">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-gold/25 text-left text-xs uppercase tracking-wider text-gold">
              <th className="px-4 py-3 font-medium">Sinh viên</th>
              <th className="px-3 py-3 font-medium">MSSV</th>
              <th className="px-3 py-3 font-medium">Chuyên cần<br /><span className="text-sage normal-case">tự động ·10%</span></th>
              <th className="px-3 py-3 font-medium">Quá trình<br /><span className="text-sage normal-case">·30%</span></th>
              <th className="px-3 py-3 font-medium">Cuối kỳ<br /><span className="text-sage normal-case">·60%</span></th>
              <th className="px-3 py-3 font-medium">Tổng kết</th>
              <th className="px-3 py-3 font-medium">Trạng thái</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ s, attendance, coursework, final, total, status }) => (
              <tr key={s.id} className="border-b border-gold/10">
                <td className="px-4 py-2.5 font-medium text-cream">{s.full_name}</td>
                <td className="px-3 py-2.5 font-mono text-xs text-sage">{s.student_code}</td>
                <td className="px-3 py-2.5 font-display text-lg text-mist">{attendance.toFixed(1)}</td>
                <td className="px-3 py-2.5" colSpan={2}>
                  <form action={upsertGrade} className="flex items-center gap-2">
                    <input type="hidden" name="student_id" value={s.id} />
                    <input name="coursework" defaultValue={coursework ?? ""} inputMode="decimal" placeholder="—"
                      className="h-8 w-16 rounded border border-gold/25 bg-ink px-2 text-center text-cream outline-none focus:border-gold" />
                    <input name="final" defaultValue={final ?? ""} inputMode="decimal" placeholder="—"
                      className="h-8 w-16 rounded border border-gold/25 bg-ink px-2 text-center text-cream outline-none focus:border-gold" />
                    <button className="h-8 rounded bg-gold/90 px-3 text-xs font-semibold text-ink transition hover:bg-gold">Lưu</button>
                  </form>
                </td>
                <td className="px-3 py-2.5 font-display text-xl text-gold">{total != null ? total.toFixed(1) : "—"}</td>
                <td className={`px-3 py-2.5 text-xs font-semibold tracking-wide ${status.cls}`}>{status.label}</td>
                <td />
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-sage">Chưa có sinh viên. Chạy seed hoặc duyệt đơn ở màn Ghi danh.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-sage">Điểm chuyên cần tính tự động từ điểm danh (có mặt =1, trễ =0.5). <span className="text-[#6FA3C0]">Xin phép</span> = nghỉ có phép, KHÔNG bị trừ điểm (loại khỏi mẫu số) và không tính vào tỷ lệ vắng. Chỉ <span className="text-danger">vắng không phép</span> quá 20% → cấm thi. Đạt: tổng kết ≥ 4.0.</p>
    </main>
  );
}

function Header({ count }: { count: number }) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-gold/20 pb-6">
      <div>
        <p className="eyebrow">F&amp;B-FCA</p>
        <h1 className="mt-1 font-display text-4xl text-cream">Bảng điểm <span className="text-sage">({count} sinh viên)</span></h1>
      </div>
      <div className="flex gap-3">
        <Link href="/app/attendance" className="h-10 rounded-lg border border-gold/30 px-4 text-sm leading-10 text-mist transition hover:border-gold hover:text-gold">Điểm danh →</Link>
        <Link href="/app" className="h-10 rounded-lg border border-gold/30 px-4 text-sm leading-10 text-mist transition hover:border-gold hover:text-gold">← Giao diện chính</Link>
      </div>
    </header>
  );
}

function MigrationNotice({ error }: { error?: string }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16 text-center">
      <h1 className="font-display text-3xl text-cream">Cần chạy migration 0002</h1>
      <p className="mt-3 text-sage">Bảng dữ liệu điểm/điểm danh chưa được tạo. Mở Supabase → SQL Editor, dán nội dung file <code className="text-gold">supabase/migrations/0002_gradebook_attendance.sql</code> rồi Run.</p>
      {error && <p className="mt-4 text-xs text-danger/80">Chi tiết: {error}</p>}
    </main>
  );
}
