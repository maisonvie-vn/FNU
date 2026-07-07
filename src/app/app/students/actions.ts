"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Chưa đăng nhập");
  return supabase;
}

// "Xóa" khỏi danh sách — đánh dấu đã nghỉ/bảo lưu, KHÔNG xóa dữ liệu thật
// (giữ nguyên lịch sử điểm/điểm danh/thanh toán để đối chiếu, có thể khôi phục)
export async function withdrawStudent(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await requireStaff();
  await supabase.from("enrollments").update({ status: "withdrawn" }).eq("id", id);
  revalidatePath("/app/students");
}

// Khôi phục SV đã đánh dấu nghỉ trở lại danh sách hoạt động
export async function reactivateStudent(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await requireStaff();
  await supabase.from("enrollments").update({ status: "active" }).eq("id", id);
  revalidatePath("/app/students");
}

// Chuyển sinh viên sang khóa/lớp khác (bảo lưu)
export async function moveCohort(formData: FormData) {
  const id = String(formData.get("id") || "");
  const cohort = String(formData.get("cohort") || "").trim();
  if (!id || !cohort) return;
  const supabase = await requireStaff();
  await supabase.from("enrollments").update({ cohort }).eq("id", id);
  revalidatePath("/app/students");
}
