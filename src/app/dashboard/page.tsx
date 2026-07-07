import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";

export const metadata = { title: "Tổng quan · Course CRM" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware đã chặn, đây là lớp bảo vệ thứ hai
  if (!user) redirect("/login");

  // Lấy hồ sơ giảng viên (username, họ tên, vai trò)
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="mb-10 flex items-start justify-between border-b border-gold/20 pb-6">
        <div>
          <p className="eyebrow">Course CRM · F-NU-10</p>
          <h1 className="mt-1 font-display text-4xl text-cream">
            Dashboard <span className="text-sage">(Tổng quan)</span>
          </h1>
        </div>
        <form action={logout}>
          <button className="h-10 rounded-lg border border-gold/30 px-4 text-sm text-mist transition hover:border-gold hover:text-gold">
            Đăng xuất
          </button>
        </form>
      </header>

      <section className="rounded-2xl border border-gold/20 bg-ink-deep/50 p-6">
        <p className="eyebrow mb-3">Đã đăng nhập · Signed in</p>
        <div className="space-y-1 font-display text-2xl text-cream">
          <p>{profile?.full_name || "Giảng viên"}</p>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-sage">Tên đăng nhập</dt>
            <dd className="text-mist">{profile?.username || "—"}</dd>
          </div>
          <div>
            <dt className="text-sage">Vai trò</dt>
            <dd className="text-mist">{profile?.role || "instructor"}</dd>
          </div>
        </dl>
      </section>

      <p className="mt-8 text-sm text-sage">
        ✅ Backend &amp; cổng đăng nhập đã hoạt động. Các module (Điểm danh, Bảng điểm,
        Ghi danh, Thanh toán, Lịch hẹn) sẽ được thêm ở các bước tiếp theo.
      </p>
    </main>
  );
}
