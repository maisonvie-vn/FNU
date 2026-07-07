"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendPaymentConfirmed } from "@/lib/email";

async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Chưa đăng nhập");
  return supabase;
}

// Xác nhận đã nhận tiền (đối soát thủ công) + gửi email biên nhận cho học viên
export async function markPaid(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await requireStaff();

  const { data: payment } = await supabase
    .from("payments")
    .select("amount, transfer_code, enrollment_id")
    .eq("id", id)
    .single();

  await supabase
    .from("payments")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", id);

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
