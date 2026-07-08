"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { gcalEventUrl } from "@/lib/gcal";
import { sendAppointmentBooked, sendAdminNewAppointment } from "@/lib/email";

export type BookResult = {
  ok?: boolean;
  error?: string;
  gcalUrl?: string;
  when?: string;
};

export async function bookSlot(_prev: BookResult, formData: FormData): Promise<BookResult> {
  const slotId = String(formData.get("slot_id") || "");
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const topic = String(formData.get("topic") || "").trim();

  if (!slotId) return { error: "Vui lòng chọn một khung giờ. · Please pick a time slot." };
  if (!name) return { error: "Vui lòng nhập họ tên. · Please enter your name." };
  if (!email && !phone) return { error: "Cần email hoặc số điện thoại để liên hệ. · Email or phone required." };

  const admin = createAdminClient();

  // Khóa lạc quan: chỉ đặt được nếu khung giờ vẫn còn trống
  const { data: slot } = await admin
    .from("availability_slots")
    .select("id, staff_id, starts_at, ends_at, location, is_booked")
    .eq("id", slotId)
    .single();

  if (!slot || slot.is_booked) {
    return { error: "Rất tiếc, khung giờ này vừa có người đặt. Vui lòng chọn giờ khác. · This slot was just taken." };
  }

  const { error: updErr } = await admin
    .from("availability_slots")
    .update({ is_booked: true })
    .eq("id", slotId)
    .eq("is_booked", false);
  if (updErr) return { error: "Không đặt được, vui lòng thử lại. · Booking failed, please retry." };

  await admin.from("appointments").insert({
    slot_id: slot.id,
    staff_id: slot.staff_id,
    kind: "office_hours",
    starts_at: slot.starts_at,
    ends_at: slot.ends_at,
    location: slot.location,
    status: "booked",
    guest_name: name,
    guest_email: email || null,
    guest_phone: phone || null,
    topic: topic || null,
  });

  const gcalUrl = gcalEventUrl({
    title: `F&B-FCA · ${topic || "Lịch hẹn"}`,
    start: slot.starts_at,
    end: slot.ends_at,
    details: "Lịch hẹn với F&B-FCA. Appointment with F&B-FCA.",
    location: slot.location || undefined,
  });

  // Gửi email xác nhận (không chặn nếu lỗi)
  await Promise.all([
    sendAppointmentBooked({
      guest_name: name, guest_email: email || null,
      starts_at: slot.starts_at, ends_at: slot.ends_at,
      location: slot.location, topic: topic || null, gcalUrl,
    }),
    sendAdminNewAppointment({
      guest_name: name, guest_email: email || null, guest_phone: phone || null,
      starts_at: slot.starts_at, location: slot.location, topic: topic || null,
    }),
  ]);

  const when = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long", day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(slot.starts_at));

  return { ok: true, gcalUrl, when };
}
