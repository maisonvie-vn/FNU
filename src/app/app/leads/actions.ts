"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendApplicationApproved } from "@/lib/email";

async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Chưa đăng nhập");
  return supabase;
}

// Duyệt đơn: chuyển lead thành sinh viên chính thức + tạo bản ghi ghi danh
export async function approveLead(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await requireStaff();

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();
  if (!lead || lead.status === "approved") return;

  // Tạo mã sinh viên đơn giản, duy nhất theo thời gian
  const code = "SV" + Date.now().toString().slice(-8);

  const { data: student } = await supabase
    .from("students")
    .insert({
      student_code: code,
      full_name: lead.full_name,
      email: lead.email,
      phone: lead.phone,
    })
    .select("id")
    .single();

  if (student) {
    await supabase.from("enrollments").insert({
      student_id: student.id,
      lead_id: id,
      cohort: lead.cohort || "F-NU-10",
    });
  }

  await supabase.from("leads").update({ status: "approved" }).eq("id", id);

  // Gửi email báo duyệt (không chặn nếu lỗi)
  await sendApplicationApproved({
    full_name: lead.full_name,
    email: lead.email,
    cohort: lead.cohort,
  });

  revalidatePath("/app/leads");
}

// Từ chối đơn
export async function rejectLead(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await requireStaff();
  await supabase.from("leads").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/app/leads");
}
