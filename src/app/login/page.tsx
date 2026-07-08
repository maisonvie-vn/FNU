import { Suspense } from "react";
import LoginForm from "./login-form";

export const metadata = { title: "Đăng nhập · F&B-FCA" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Thương hiệu */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold leading-tight text-gold">
            F<span className="italic">&amp;</span>B-FCA
          </h1>
        </div>

        <div className="rounded-2xl border border-gold/25 bg-ink-deep/60 p-6 shadow-xl">
          <h2 className="mb-1 font-display text-2xl text-cream">Đăng nhập</h2>
          <p className="mb-6 text-sm text-sage">
            Dành cho giảng viên &amp; hướng dẫn viên
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

      </div>
    </main>
  );
}
