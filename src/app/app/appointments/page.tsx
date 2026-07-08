import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { gcalEventUrl } from "@/lib/gcal";
import { createSlot, deleteSlot, setAppointmentStatus } from "./actions";

export const metadata = { title: "Lịch hẹn · F&B-FCA" };
export const dynamic = "force-dynamic";

function fmt(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short", day: "2-digit", month: "2-digit",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(iso));
}
function fmtTime(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(iso));
}

type Slot = { id: string; starts_at: string; ends_at: string; location: string | null; is_booked: boolean };
type Appt = {
  id: string; slot_id: string | null; starts_at: string; ends_at: string; status: string;
  guest_name: string | null; guest_email: string | null; guest_phone: string | null;
  topic: string | null; location: string | null;
};

export default async function AppointmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const nowISO = new Date().toISOString();
  const [slotsRes, apptsRes] = await Promise.all([
    supabase.from("availability_slots").select("id, starts_at, ends_at, location, is_booked").gte("ends_at", nowISO).order("starts_at"),
    supabase.from("appointments").select("id, slot_id, starts_at, ends_at, status, guest_name, guest_email, guest_phone, topic, location").order("starts_at", { ascending: false }),
  ]);

  const slots = (slotsRes.data || []) as Slot[];
  const appts = (apptsRes.data || []) as Appt[];
  const STATUS_LABEL: Record<string, string> = { booked: "Đã đặt · Booked", done: "Hoàn tất · Done", canceled: "Đã hủy · Canceled" };
  const STATUS_CLS: Record<string, string> = {
    booked: "bg-gold/15 text-gold border-gold/40",
    done: "bg-success/15 text-success border-success/40",
    canceled: "bg-danger/15 text-danger border-danger/40",
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-gold/20 pb-6">
        <div>
          <p className="eyebrow">F&amp;B-FCA</p>
          <h1 className="mt-1 font-display text-3xl text-cream sm:text-4xl">Lịch hẹn</h1>
          <p className="mt-1 text-sm text-sage">Appointments &amp; office hours</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dat-lich" target="_blank" className="h-10 rounded-lg border border-gold/30 px-4 text-sm leading-10 text-mist transition hover:border-gold hover:text-gold">Trang đặt lịch ↗</Link>
          <Link href="/app" className="h-10 rounded-lg border border-gold/30 px-4 text-sm leading-10 text-mist transition hover:border-gold hover:text-gold">← Giao diện chính</Link>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Cột trái: tạo & quản lý khung giờ trống */}
        <section>
          <h2 className="mb-3 font-display text-2xl text-cream">Khung giờ trống</h2>
          <p className="mb-4 text-sm text-sage">Open time slots — sinh viên sẽ chọn để đặt lịch.</p>

          <form action={createSlot} className="mb-6 space-y-3 rounded-xl border border-gold/20 bg-ink-deep/40 p-4">
            <div>
              <label className="mb-1 block text-xs text-sage">Ngày · Date</label>
              <input type="date" name="date" required className="h-10 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-sage">Bắt đầu · From</label>
                <input type="time" name="start" required className="h-10 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-sage">Kết thúc · To</label>
                <input type="time" name="end" required className="h-10 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-sage">Địa điểm · Location</label>
              <input name="location" placeholder="Online (Google Meet) / Phòng A305" className="h-10 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream placeholder:text-sage/50" />
            </div>
            <button className="h-10 w-full rounded-lg bg-gold font-semibold text-ink transition hover:bg-gold-soft">+ Thêm khung giờ · Add slot</button>
          </form>

          <ul className="space-y-2">
            {slots.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-gold/15 bg-ink-deep/30 px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-cream">{fmt(s.starts_at)} – {fmtTime(s.ends_at)}</div>
                  {s.location && <div className="text-xs text-sage">{s.location}</div>}
                </div>
                {s.is_booked ? (
                  <span className="rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs text-gold">Đã đặt</span>
                ) : (
                  <form action={deleteSlot}>
                    <input type="hidden" name="id" value={s.id} />
                    <button className="rounded-lg border border-danger/40 px-3 py-1 text-xs text-danger transition hover:bg-danger/10">Xóa</button>
                  </form>
                )}
              </li>
            ))}
            {slots.length === 0 && <li className="rounded-xl border border-gold/15 px-4 py-10 text-center text-sage">Chưa có khung giờ nào.</li>}
          </ul>
        </section>

        {/* Cột phải: các lịch hẹn */}
        <section>
          <h2 className="mb-3 font-display text-2xl text-cream">Lịch đã đặt</h2>
          <p className="mb-4 text-sm text-sage">Booked appointments.</p>
          <ul className="space-y-3">
            {appts.map((a) => {
              const gcal = gcalEventUrl({
                title: `F&B-FCA · ${a.topic || "Lịch hẹn"} — ${a.guest_name || ""}`.trim(),
                start: a.starts_at, end: a.ends_at,
                details: [a.topic ? `Nội dung: ${a.topic}` : "", a.guest_email ? `Email: ${a.guest_email}` : "", a.guest_phone ? `SĐT: ${a.guest_phone}` : ""].filter(Boolean).join("\n"),
                location: a.location || undefined,
              });
              return (
                <li key={a.id} className="rounded-xl border border-gold/15 bg-ink-deep/30 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="font-medium text-cream">{a.guest_name || "—"}</div>
                      <div className="text-xs text-sage">{a.guest_email || ""}{a.guest_phone ? ` · ${a.guest_phone}` : ""}</div>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs ${STATUS_CLS[a.status] || ""}`}>{STATUS_LABEL[a.status] || a.status}</span>
                  </div>
                  <div className="mt-2 text-sm text-mist">{fmt(a.starts_at)} – {fmtTime(a.ends_at)}{a.location ? ` · ${a.location}` : ""}</div>
                  {a.topic && <div className="mt-1 text-sm text-sage">“{a.topic}”</div>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href={gcal} target="_blank" rel="noreferrer" className="rounded-lg border border-gold/30 px-3 py-1 text-xs text-gold transition hover:bg-gold hover:text-ink">+ Google Calendar</a>
                    {a.status !== "done" && (
                      <form action={setAppointmentStatus}>
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="slot_id" value={a.slot_id || ""} />
                        <input type="hidden" name="status" value="done" />
                        <button className="rounded-lg border border-success/40 px-3 py-1 text-xs text-success transition hover:bg-success/10">Hoàn tất</button>
                      </form>
                    )}
                    {a.status !== "canceled" && (
                      <form action={setAppointmentStatus}>
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="slot_id" value={a.slot_id || ""} />
                        <input type="hidden" name="status" value="canceled" />
                        <button className="rounded-lg border border-danger/40 px-3 py-1 text-xs text-danger transition hover:bg-danger/10">Hủy</button>
                      </form>
                    )}
                  </div>
                </li>
              );
            })}
            {appts.length === 0 && <li className="rounded-xl border border-gold/15 px-4 py-10 text-center text-sage">Chưa có lịch hẹn nào.</li>}
          </ul>
        </section>
      </div>
    </main>
  );
}
