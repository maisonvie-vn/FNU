import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { approveLead, rejectLead } from "./actions";

export const metadata = { title: "Ghi danh · Course CRM" };
export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  cohort: string | null;
  status: string;
  note: string | null;
  created_at: string;
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "CHỜ DUYỆT", cls: "border-gold/40 text-gold" },
    approved: { label: "ĐÃ DUYỆT", cls: "border-success/50 text-success" },
    rejected: { label: "TỪ CHỐI", cls: "border-danger/50 text-danger" },
  };
  const s = map[status] || map.pending;
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs tracking-wider ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

export default async function LeadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (leads || []) as Lead[];
  const pending = list.filter((l) => l.status === "pending").length;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-gold/20 pb-6">
        <div>
          <p className="eyebrow">Food Culture &amp; Aesthetic</p>
          <h1 className="mt-1 font-display text-4xl text-cream">
            Ghi danh <span className="text-sage">(Hồ sơ đăng ký)</span>
          </h1>
          <p className="mt-1 text-sm text-sage">
            Đơn từ trang đăng ký công khai · {pending} đơn chờ duyệt
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="h-10 rounded-lg border border-gold/30 px-4 text-sm leading-10 text-mist transition hover:border-gold hover:text-gold"
          >
            ← Về giao diện chính
          </Link>
          <a
            href="/dang-ky"
            target="_blank"
            rel="noreferrer"
            className="h-10 rounded-lg bg-gold px-4 text-sm font-semibold leading-10 text-ink transition hover:bg-gold-soft"
          >
            Xem trang đăng ký ↗
          </a>
        </div>
      </header>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-gold/20 bg-ink-deep/40 p-10 text-center">
          <p className="font-display text-2xl text-cream">Chưa có đơn nào</p>
          <p className="mt-2 text-sage">
            Đơn đăng ký từ{" "}
            <a href="/dang-ky" target="_blank" rel="noreferrer" className="text-gold hover:underline">
              trang đăng ký công khai
            </a>{" "}
            sẽ tự động xuất hiện tại đây.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((lead) => (
            <li
              key={lead.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gold/20 bg-ink-deep/40 p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg text-cream">
                    {lead.full_name}
                  </span>
                  <StatusBadge status={lead.status} />
                </div>
                <p className="mt-0.5 text-sm text-sage">
                  {[lead.email, lead.phone].filter(Boolean).join(" · ") || "—"}
                </p>
                {lead.note && (
                  <p className="mt-1 text-sm text-mist/80">“{lead.note}”</p>
                )}
              </div>

              {lead.status === "pending" && (
                <div className="flex items-center gap-2">
                  <form action={approveLead}>
                    <input type="hidden" name="id" value={lead.id} />
                    <button className="h-10 rounded-lg bg-gold px-4 text-sm font-semibold text-ink transition hover:bg-gold-soft">
                      Duyệt
                    </button>
                  </form>
                  <form action={rejectLead}>
                    <input type="hidden" name="id" value={lead.id} />
                    <button className="h-10 rounded-lg border border-danger/50 px-4 text-sm text-danger transition hover:bg-danger/10">
                      Từ chối
                    </button>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
