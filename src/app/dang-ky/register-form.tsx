"use client";

import { useActionState } from "react";
import { submitLead, type RegisterState } from "./actions";

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    submitLead,
    {},
  );

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-success/40 bg-ink-deep/60 p-8 text-center">
        <p className="font-display text-2xl text-success">Đã nhận đăng ký!</p>
        <p className="mt-2 text-mist">
          Cảm ơn bạn. Bộ phận tuyển sinh sẽ liên hệ và xét duyệt hồ sơ trong thời
          gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-gold/25 bg-ink-deep/60 p-6"
    >
      <input type="hidden" name="cohort" value="F-NU-10" />

      <div>
        <label htmlFor="full_name" className="mb-1.5 block text-sm text-mist">
          Họ và tên <span className="text-danger">*</span>
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          autoComplete="name"
          className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream outline-none placeholder:text-sage/60 focus:border-gold focus:ring-2 focus:ring-gold/40"
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-mist">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream outline-none placeholder:text-sage/60 focus:border-gold focus:ring-2 focus:ring-gold/40"
            placeholder="ban@email.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm text-mist">
            Số điện thoại
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream outline-none placeholder:text-sage/60 focus:border-gold focus:ring-2 focus:ring-gold/40"
            placeholder="09xx xxx xxx"
          />
        </div>
      </div>

      <div>
        <label htmlFor="note" className="mb-1.5 block text-sm text-mist">
          Lời nhắn (tuỳ chọn)
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          className="w-full rounded-lg border border-gold/25 bg-ink px-3 py-2 text-cream outline-none placeholder:text-sage/60 focus:border-gold focus:ring-2 focus:ring-gold/40"
          placeholder="Nền tảng, mong muốn khi tham gia khóa học…"
        />
      </div>

      <p className="text-xs text-sage">
        <span className="text-danger">*</span> Bắt buộc. Cần ít nhất email hoặc số
        điện thoại để chúng tôi liên hệ.
      </p>

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
        {pending ? "Đang gửi…" : "Gửi đăng ký"}
      </button>
    </form>
  );
}
