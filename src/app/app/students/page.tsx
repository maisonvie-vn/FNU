import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatVND } from "@/lib/vietqr";
import { MoveCohortForm, WithdrawButton, ReactivateButton } from "./RowActions";

export const metadata = { title: "Danh sách học viên · Food Culture & Aesthetic" };
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  cohort: string | null;
  status: string;
  created_at: string;
  students: { student_code: string | null; full_name: string; email: string | null; phone: string | null } | null;
  payments: { amount: number; status: string; transfer_code: string }[] | null;
};

function PayBadge({ payments }: { payments: Row["payments"] }) {
  const p = payments?.[0];
  if (!p) return <span className="text-sage">—</span>;
  if (p.status === "paid")
    return <span className="rounded-full border border-success/50 px-2.5 py-0.5 text-xs text-success">ĐÃ THU</span>;
  return <span className="rounded-full border border-gold/40 px-2.5 py-0.5 text-xs text-gold">CHỜ THU</span>;
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ cohort?: string; show?: string }>;
}) {
  const { cohort: cohortFilter, show } = await searchParams;
  const showWithdrawn = show === "withdrawn";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let query = supabase
    .from("enrollments")
    .select("id, cohort, status, created_at, students(student_code, full_name, email, phone), payments(amount, status, transfer_code)")
    .order("created_at", { ascending: false });
  if (cohortFilter) query = query.eq("cohort", cohortFilter);

  const { data, error } = await query;
  const allRows = ((data || []) as unknown as Row[]).filter((r) => r.students);
  const withdrawnCount = allRows.filter((r) => r.status === "withdrawn").length;
  const rows = showWithdrawn ? allRows : allRows.filter((r) => r.status !== "withdrawn");

  const cohorts = [...new Set(allRows.map((r) => r.cohort).filter(Boolean))] as string[];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-gold/20 pb-6">
        <div>
          <p className="eyebrow">Food Culture &amp; Aesthetic</p>
          <h1 className="mt-1 font-display text-4xl text-cream">
            Danh sách học viên <span className="text-sage">({rows.length})</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`/app/students/export${cohortFilter ? `?cohort=${encodeURIComponent(cohortFilter)}` : ""}`}
            className="h-10 rounded-lg bg-gold px-4 text-sm font-semibold leading-10 text-ink transition hover:bg-gold-soft"
          >
            Xuất CSV ↓
          </a>
          <Link href="/app" className="h-10 rounded-lg border border-gold/30 px-4 text-sm leading-10 text-mist transition hover:border-gold hover:text-gold">
            ← Giao diện chính
          </Link>
        </div>
      </header>

      {cohorts.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/app/students"
            className={`h-9 rounded-lg px-3 text-sm leading-9 transition ${!cohortFilter ? "bg-gold font-semibold text-ink" : "border border-gold/25 text-mist hover:border-gold"}`}
          >
            Tất cả
          </Link>
          {cohorts.map((c) => (
            <Link
              key={c}
              href={`/app/students?cohort=${encodeURIComponent(c)}`}
              className={`h-9 rounded-lg px-3 text-sm leading-9 transition ${cohortFilter === c ? "bg-gold font-semibold text-ink" : "border border-gold/25 text-mist hover:border-gold"}`}
            >
              {c}
            </Link>
          ))}
        </div>
      )}

      {error ? (
        <div className="rounded-2xl border border-danger/40 bg-ink-deep/50 p-8 text-center text-danger">
          Lỗi tải dữ liệu: {error.message}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-gold/20 bg-ink-deep/40 p-10 text-center text-sage">
          Chưa có học viên nào. Duyệt đơn ở màn{" "}
          <Link href="/app/leads" className="text-gold hover:underline">Ghi danh</Link> để thêm.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gold/20">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-gold/25 text-left text-xs uppercase tracking-wider text-gold">
                <th className="px-4 py-3 font-medium">Họ tên</th>
                <th className="px-3 py-3 font-medium">MSSV</th>
                <th className="px-3 py-3 font-medium">Email</th>
                <th className="px-3 py-3 font-medium">SĐT</th>
                <th className="px-3 py-3 font-medium">Lớp / Khóa</th>
                <th className="px-3 py-3 font-medium">Học phí</th>
                <th className="px-3 py-3 font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const withdrawn = r.status === "withdrawn";
                return (
                  <tr key={r.id} className={`border-b border-gold/10 ${withdrawn ? "opacity-60" : ""}`}>
                    <td className="px-4 py-2.5 font-medium text-cream">
                      {r.students?.full_name}
                      {withdrawn && (
                        <span className="ml-2 rounded-full border border-danger/40 px-2 py-0.5 text-[10px] tracking-wide text-danger">ĐÃ NGHỈ</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs text-sage">{r.students?.student_code || "—"}</td>
                    <td className="px-3 py-2.5 text-mist">{r.students?.email || "—"}</td>
                    <td className="px-3 py-2.5 text-mist">{r.students?.phone || "—"}</td>
                    <td className="px-3 py-2.5 text-mist">{r.cohort || "—"}</td>
                    <td className="px-3 py-2.5">
                      <PayBadge payments={r.payments} />
                      {r.payments?.[0] && (
                        <span className="ml-2 text-xs text-sage">{formatVND(r.payments[0].amount)}</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {!withdrawn && (
                          <MoveCohortForm enrollmentId={r.id} currentCohort={r.cohort} knownCohorts={cohorts} />
                        )}
                        {withdrawn ? (
                          <ReactivateButton enrollmentId={r.id} />
                        ) : (
                          <WithdrawButton enrollmentId={r.id} studentName={r.students?.full_name || ""} />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-sage">
        {showWithdrawn ? (
          <Link href={cohortFilter ? `/app/students?cohort=${encodeURIComponent(cohortFilter)}` : "/app/students"} className="text-gold hover:underline">
            ← Ẩn học viên đã nghỉ
          </Link>
        ) : withdrawnCount > 0 ? (
          <Link
            href={`/app/students?show=withdrawn${cohortFilter ? `&cohort=${encodeURIComponent(cohortFilter)}` : ""}`}
            className="text-gold hover:underline"
          >
            Xem {withdrawnCount} học viên đã nghỉ / bảo lưu →
          </Link>
        ) : null}
      </p>
    </main>
  );
}
