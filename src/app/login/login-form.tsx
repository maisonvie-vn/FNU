"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login, type LoginState } from "./actions";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/app";
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm text-mist">
          Tên đăng nhập
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream outline-none placeholder:text-sage/60 focus:border-gold focus:ring-2 focus:ring-gold/40"
          placeholder="vd: gv.thanh"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm text-mist">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream outline-none placeholder:text-sage/60 focus:border-gold focus:ring-2 focus:ring-gold/40"
          placeholder="••••••••"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-lg bg-gold font-semibold text-ink transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </button>
    </form>
  );
}
