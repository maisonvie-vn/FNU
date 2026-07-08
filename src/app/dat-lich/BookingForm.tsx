"use client";

import { useActionState, useState } from "react";
import { bookSlot, type BookResult } from "./actions";

export type PublicSlot = { id: string; starts_at: string; ends_at: string; location: string | null };

const TZ = "Asia/Ho_Chi_Minh";
function dayLabel(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", timeZone: TZ }).format(new Date(iso));
}
function timeLabel(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(new Date(iso));
}

export default function BookingForm({ slots }: { slots: PublicSlot[] }) {
  const [state, formAction, pending] = useActionState<BookResult, FormData>(bookSlot, {});
  const [selected, setSelected] = useState<string>("");

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-success/40 bg-ink-deep/50 p-6 text-center sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/20 text-3xl text-success">✓</div>
        <h2 className="font-display text-2xl text-cream">Đặt lịch thành công!</h2>
        <p className="mt-1 text-sm text-sage">Your appointment is confirmed.</p>
        <p className="mt-4 text-mist">{state.when}</p>
        {state.gcalUrl && (
          <a href={state.gcalUrl} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold-soft">
            + Thêm vào Google Calendar
          </a>
        )}
        <p className="mt-6 text-xs text-sage">Chúng tôi đã gửi email xác nhận (nếu bạn cung cấp email).<br />A confirmation email has been sent.</p>
      </div>
    );
  }

  // Nhóm khung giờ theo ngày
  const byDay = new Map<string, PublicSlot[]>();
  for (const s of slots) {
    const k = dayLabel(s.starts_at);
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k)!.push(s);
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <h2 className="mb-1 font-display text-2xl text-cream">1 · Chọn khung giờ</h2>
        <p className="mb-4 text-sm text-sage">Pick an available time slot.</p>
        {slots.length === 0 ? (
          <p className="rounded-xl border border-gold/15 px-4 py-10 text-center text-sage">Hiện chưa có khung giờ trống. Vui lòng quay lại sau. · No open slots right now.</p>
        ) : (
          <div className="space-y-5">
            {[...byDay.entries()].map(([day, list]) => (
              <div key={day}>
                <div className="mb-2 text-sm font-medium capitalize text-gold">{day}</div>
                <div className="flex flex-wrap gap-2">
                  {list.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setSelected(s.id)}
                      className={`rounded-lg border px-4 py-2 text-sm transition ${
                        selected === s.id ? "border-gold bg-gold font-semibold text-ink" : "border-gold/25 text-mist hover:border-gold"
                      }`}
                    >
                      {timeLabel(s.starts_at)}–{timeLabel(s.ends_at)}
                      {s.location && <span className="ml-1 block text-[11px] opacity-70">{s.location}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <input type="hidden" name="slot_id" value={selected} />
      </div>

      <div>
        <h2 className="mb-1 font-display text-2xl text-cream">2 · Thông tin của bạn</h2>
        <p className="mb-4 text-sm text-sage">Your contact details.</p>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-sage">Họ tên · Full name *</label>
            <input name="name" required className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-sage">Email</label>
              <input name="email" type="email" className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-sage">Điện thoại · Phone</label>
              <input name="phone" className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-sage">Nội dung cần trao đổi · Topic</label>
            <textarea name="topic" rows={2} className="w-full rounded-lg border border-gold/25 bg-ink px-3 py-2 text-cream" />
          </div>
        </div>
      </div>

      {state.error && <p className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">{state.error}</p>}

      <button
        disabled={pending || !selected || slots.length === 0}
        className="h-12 w-full rounded-lg bg-gold text-base font-semibold text-ink transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "Đang đặt lịch…" : "Xác nhận đặt lịch · Confirm booking"}
      </button>
    </form>
  );
}
