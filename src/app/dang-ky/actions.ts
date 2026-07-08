"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendApplicationReceived, sendAdminNewLead } from "@/lib/email";

export type RegisterState = { ok?: boolean; error?: string };

// Nhận đơn đăng ký từ trang công khai (không đăng nhập).
// Dùng service role ở SERVER để ghi vào bảng leads — RLS vẫn khóa,
// khách chỉ có thể gửi qua action đã kiểm soát này, không đọc/sửa được gì.
export async function submitLead(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const full_name = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const student_code = String(formData.get("student_code") || "").trim();
  const extra = String(formData.get("note") || "").trim();
  const cohort = String(formData.get("cohort") || "F-NU-11").trim();

  if (!full_name) return { error: "Vui lòng nhập họ và tên." };
  if (!email && !phone)
    return { error: "Vui lòng nhập ít nhất email hoặc số điện thoại." };
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { error: "Email không hợp lệ." };

  // MSSV chưa có cột riêng trong bảng leads → gộp vào note
  const note = [student_code ? `MSSV: ${student_code}` : "", extra]
    .filter(Boolean)
    .join(" · ");

  const admin = createAdminClient();
  const { error } = await admin.from("leads").insert({
    full_name,
    email: email || null,
    phone: phone || null,
    note: note || null,
    cohort,
    status: "pending",
  });

  if (error) {
    return { error: "Có lỗi khi gửi đăng ký, vui lòng thử lại sau." };
  }

  // Gửi email xác nhận cho học viên + báo cho admin (không chặn luồng nếu email lỗi)
  await Promise.all([
    sendApplicationReceived({ full_name, email: email || null, cohort }),
    sendAdminNewLead({ full_name, email: email || null, phone: phone || null, cohort, note: note || null }),
  ]);

  return { ok: true };
}
