"use client";

import { useActionState } from "react";
import { changePassword, type ChangePwState } from "./actions";

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<ChangePwState, FormData>(
    changePassword,
    {},
  );

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-success/40 bg-ink-deep/60 p-8 text-center">
        <p className="font-display text-2xl text-success">Đã đổi mật khẩu ✓</p>
        <p className="mt-2 text-sm text-mist">
          Lần đăng nhập tới hãy dùng mật khẩu mới.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-gold/25 bg-ink-deep/60 p-6"
    >
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm text-mist">
          Mật khẩu mới
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream outline-none placeholder:text-sage/60 focus:border-gold focus:ring-2 focus:ring-gold/40"
          placeholder="Tối thiểu 6 ký tự"
        />
      </div>
      <div>
        <label htmlFor="confirm" className="mb-1.5 block text-sm text-mist">
          Nhập lại mật khẩu mới
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
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
        {pending ? "Đang lưu…" : "Đổi mật khẩu"}
      </button>
    </form>
  );
}
