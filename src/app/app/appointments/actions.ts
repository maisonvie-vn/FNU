"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Quản lý lịch hẹn: chỉ GV/trợ giảng (chặn giám sát)
async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Chưa đăng nhập");
  const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!["instructor", "assistant"].includes((prof?.role as string) ?? "")) throw new Error("Không có quyền.");
  return { supabase, user };
}

// datetime-local ("YYYY-MM-DDTHH:mm") là giờ Việt Nam → gắn offset +07:00 để lưu chuẩn timestamptz
function vnToISO(local: string) {
  if (!local) return null;
  const s = local.length === 16 ? `${local}:00` : local;
  return new Date(`${s}+07:00`).toISOString();
}

// GV tạo khung giờ trống
export async function createSlot(formData: FormData) {
  const { supabase, user } = await requireStaff();
  const date = String(formData.get("date") || "");
  const start = String(formData.get("start") || "");
  const end = String(formData.get("end") || "");
  const location = String(formData.get("location") || "").trim() || null;
  if (!date || !start || !end) return;
  const starts_at = vnToISO(`${date}T${start}`);
  const ends_at = vnToISO(`${date}T${end}`);
  if (!starts_at || !ends_at || ends_at <= starts_at) return;
  await supabase.from("availability_slots").insert({
    staff_id: user.id,
    starts_at,
    ends_at,
    location,
    is_booked: false,
  });
  revalidatePath("/app/appointments");
}

// Xóa khung giờ (chỉ khi chưa ai đặt)
export async function deleteSlot(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("availability_slots").delete().eq("id", id).eq("is_booked", false);
  revalidatePath("/app/appointments");
}

// Cập nhật trạng thái lịch hẹn (done | canceled). Nếu hủy thì mở lại khung giờ.
export async function setAppointmentStatus(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const slotId = String(formData.get("slot_id") || "");
  if (!id || !["done", "canceled", "booked"].includes(status)) return;
  await supabase.from("appointments").update({ status }).eq("id", id);
  if (slotId) {
    await supabase
      .from("availability_slots")
      .update({ is_booked: status !== "canceled" })
      .eq("id", slotId);
  }
  revalidatePath("/app/appointments");
}
