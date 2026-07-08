import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChangePasswordForm from "./change-password-form";

export const metadata = { title: "Đổi mật khẩu · F&B-FCA" };
export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto w-full max-w-md px-6 py-10">
      <header className="mb-8 flex items-start justify-between gap-4 border-b border-gold/20 pb-6">
        <div>
          <p className="eyebrow">F&amp;B-FCA</p>
          <h1 className="mt-1 font-display text-4xl text-cream">Đổi mật khẩu</h1>
        </div>
        <Link
          href="/app"
          className="h-10 rounded-lg border border-gold/30 px-4 text-sm leading-10 text-mist transition hover:border-gold hover:text-gold"
        >
          ← Về
        </Link>
      </header>

      <p className="mb-5 text-sm text-sage">
        Tài khoản{" "}
        <span className="text-mist">{profile?.full_name || "giảng viên"}</span> ·
        tên đăng nhập <span className="font-mono text-gold">{profile?.username}</span>
      </p>

      <ChangePasswordForm />
    </main>
  );
}
