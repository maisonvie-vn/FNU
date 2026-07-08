"use server";

import { revalidatePath } from "next/cache";
import { requireManager } from "@/lib/guard";
import { sendPaymentConfirmed } from "@/lib/email";

// Xác nhận đã nhận tiền (đối soát thủ công) + gửi email biên nhận cho học viên
export async function markPaid(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await requireManager();

  const { data: payment } = await supabase
    .from("payments")
    .select("amount, transfer_code, enrollment_id, status")
    .eq("id", id)
    .single();

  // Đã thu rồi thì bỏ qua (tránh gửi biên nhận trùng)
  if (!payment || payment.status === "paid") return;

  await supabase
    .from("payments")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending");

  if (payment?.enrollment_id) {
    const { data: enr } = await supabase
      .from("enrollments")
      .select("students(full_name, email)")
      .eq("id", payment.enrollment_id)
      .single();
    const student = (enr as unknown as { students: { full_name: string; email: string | null } | null })?.students;
    if (student) {
      await sendPaymentConfirmed({
        full_name: student.full_name,
        email: student.email,
        amount: payment.amount,
        transferCode: payment.transfer_code,
      });
    }
  }

  revalidatePath("/app/payments");
}
