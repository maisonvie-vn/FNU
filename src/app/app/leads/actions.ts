"use server";

import { revalidatePath } from "next/cache";
import { requireManager } from "@/lib/guard";
import { sendApplicationApproved } from "@/lib/email";
import { COURSE_FEE_VND } from "@/lib/vietqr";

// Duyệt đơn: chuyển lead thành sinh viên chính thức + tạo bản ghi ghi danh
export async function approveLead(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await requireManager();

  // Khóa chống duyệt trùng: chỉ tiếp tục nếu lật được pending -> approved (nguyên tử)
  const { data: claimed } = await supabase
    .from("leads")
    .update({ status: "approved" })
    .eq("id", id)
    .neq("status", "approved")
    .select("*")
    .maybeSingle();
  if (!claimed) return; // đã được duyệt trước đó / không tồn tại
  const lead = claimed;

  // Tạo mã sinh viên đơn giản, duy nhất theo thời gian
  const code = "SV" + Date.now().toString().slice(-8);

  const { data: student, error: sErr } = await supabase
    .from("students")
    .insert({ student_code: code, full_name: lead.full_name, email: lead.email, phone: lead.phone })
    .select("id")
    .single();
  if (sErr || !student) {
    // Không tạo được SV → trả đơn về pending để duyệt lại
    await supabase.from("leads").update({ status: "pending" }).eq("id", id);
    revalidatePath("/app/leads");
    return;
  }

  const transferCode = "FNU10" + Date.now().toString(36).slice(-6).toUpperCase();
  const { data: enr } = await supabase
    .from("enrollments")
    .insert({ student_id: student.id, lead_id: id, cohort: lead.cohort || "F-NU-10" })
    .select("id")
    .single();
  if (enr) {
    await supabase.from("payments").insert({
      enrollment_id: enr.id,
      amount: COURSE_FEE_VND,
      transfer_code: transferCode,
      status: "pending",
    });
  }

  // Gửi email báo duyệt kèm link thanh toán (không chặn nếu lỗi)
  await sendApplicationApproved({
    full_name: lead.full_name,
    email: lead.email,
    cohort: lead.cohort,
    paymentCode: transferCode,
    amount: COURSE_FEE_VND,
  });

  revalidatePath("/app/leads");
}

// Từ chối đơn
export async function rejectLead(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await requireManager();
  await supabase.from("leads").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/app/leads");
}
