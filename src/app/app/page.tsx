import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "F&B-FCA — CRM" };
export const dynamic = "force-dynamic";

async function safeCount(p: PromiseLike<{ count: number | null }>) {
  try { const { count } = await p; return count || 0; } catch { return 0; }
}

export default async function AppPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const nowISO = new Date().toISOString();
  const [students, leadsPending, payPending, payPaid, quizPublished, apptUpcoming] = await Promise.all([
    // học viên đang học = enrollment chưa withdrawn
    safeCount(supabase.from("enrollments").select("*", { count: "exact", head: true }).neq("status", "withdrawn")),
    safeCount(supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "pending")),
    safeCount(supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "pending")),
    safeCount(supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "paid")),
    safeCount(supabase.from("quizzes").select("*", { count: "exact", head: true }).eq("is_published", true)),
    safeCount(supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "booked").gte("starts_at", nowISO)),
  ]);

  const cards = [
    { href: "/app/students", label: "Học viên đang học", en: "Active students", value: students, accent: "#C9A24A" },
    { href: "/app/leads", label: "Đơn chờ duyệt", en: "Pending applications", value: leadsPending, accent: "#7FB595" },
    { href: "/app/payments", label: "Thanh toán chờ thu", en: "Pending payments", value: payPending, accent: "#D98A7E" },
    { href: "/app/payments", label: "Đã thu học phí", en: "Payments received", value: payPaid, accent: "#7FB595" },
    { href: "/app/quizzes", label: "Đề thi đang phát hành", en: "Published quizzes", value: quizPublished, accent: "#C9A24A" },
    { href: "/app/appointments", label: "Lịch hẹn sắp tới", en: "Upcoming appointments", value: apptUpcoming, accent: "#C9A24A" },
  ];

  const quick = [
    { href: "/app/leads", vi: "Duyệt ghi danh", en: "Review enrollment" },
    { href: "/app/attendance", vi: "Điểm danh", en: "Take attendance" },
    { href: "/app/gradebook", vi: "Nhập điểm", en: "Enter grades" },
    { href: "/app/quizzes", vi: "Soạn đề thi", en: "Build a quiz" },
    { href: "/app/appointments", vi: "Mở khung giờ", en: "Open time slots" },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 border-b border-gold/20 pb-6">
        <p className="eyebrow">F&amp;B-FCA · CRM</p>
        <h1 className="mt-1 font-display text-3xl text-cream sm:text-4xl">Bảng điều khiển</h1>
        <p className="mt-1 text-sm text-sage">Tổng quan dữ liệu thật từ hệ thống · Live overview</p>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {cards.map((c, i) => (
          <Link key={i} href={c.href} className="rounded-2xl border border-gold/20 bg-ink-deep/40 p-4 transition hover:border-gold sm:p-5">
            <div className="font-display text-4xl" style={{ color: c.accent }}>{c.value}</div>
            <div className="mt-2 text-sm font-medium text-cream">{c.label}</div>
            <div className="text-xs text-sage">{c.en}</div>
          </Link>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-2xl text-cream">Thao tác nhanh</h2>
        <div className="flex flex-wrap gap-2.5">
          {quick.map((q) => (
            <Link key={q.href + q.vi} href={q.href} className="rounded-lg border border-gold/30 px-4 py-2.5 text-sm text-gold transition hover:bg-gold hover:text-ink">
              {q.vi} <span className="text-xs opacity-70">· {q.en}</span>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-10 text-xs text-sage">
        Mọi số liệu trên lấy trực tiếp từ Supabase (dữ liệu thật). Dùng menu bên trái để mở từng mục.
        <br />All figures are live from the database. Use the left menu to open each section.
      </p>
    </main>
  );
}
