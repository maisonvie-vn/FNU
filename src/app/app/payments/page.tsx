import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatVND } from "@/lib/vietqr";
import { markPaid } from "./actions";

export const metadata = { title: "Thanh toán · Course CRM" };
export const dynamic = "force-dynamic";

type Payment = {
  id: string;
  amount: number;
  transfer_code: string;
  status: string;
  created_at: string;
  enrollments: { students: { full_name: string } | null } | null;
};

export default async function PaymentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("payments")
    .select("id, amount, transfer_code, status, created_at, enrollments(students(full_name))")
    .order("created_at", { ascending: false });

  const list = (data || []) as unknown as Payment[];
  const pending = list.filter((p) => p.status === "pending").length;
  const collected = list.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-gold/20 pb-6">
        <div>
          <p className="eyebrow">Food Culture &amp; Aesthetic</p>
          <h1 className="mt-1 font-display text-4xl text-cream">Thanh toán học phí</h1>
          <p className="mt-1 text-sm text-sage">{pending} chờ thu · đã thu {formatVND(collected)}</p>
        </div>
        <Link href="/app" className="h-10 rounded-lg border border-gold/30 px-4 text-sm leading-10 text-mist transition hover:border-gold hover:text-gold">← Giao diện chính</Link>
      </header>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-gold/20 bg-ink-deep/40 p-10 text-center text-sage">
          Chưa có khoản thanh toán nào. Khoản thu được tạo tự động khi duyệt đơn ở màn <Link href="/app/leads" className="text-gold hover:underline">Ghi danh</Link>.
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gold/20 bg-ink-deep/40 p-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg text-cream">{p.enrollments?.students?.full_name || "—"}</span>
                  {p.status === "paid" ? (
                    <span className="rounded-full border border-success/50 px-2.5 py-0.5 text-xs tracking-wider text-success">ĐÃ THU</span>
                  ) : (
                    <span className="rounded-full border border-gold/40 px-2.5 py-0.5 text-xs tracking-wider text-gold">CHỜ THU</span>
                  )}
                </div>
                <div className="mt-0.5 text-sm text-sage">
                  {formatVND(p.amount)} · nội dung <span className="font-mono text-mist">{p.transfer_code}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={`/thanh-toan/${p.transfer_code}`} target="_blank" rel="noreferrer" className="h-9 rounded-lg border border-gold/30 px-3 text-sm leading-9 text-mist transition hover:border-gold hover:text-gold">Xem QR ↗</a>
                {p.status !== "paid" && (
                  <form action={markPaid}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="h-9 rounded-lg bg-gold px-4 text-sm font-semibold text-ink transition hover:bg-gold-soft">Xác nhận đã nhận</button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
