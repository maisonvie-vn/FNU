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

// Điểm danh 1 sinh viên cho 1 buổi
export async function markAttendance(formData: FormData) {
  const student_id = String(formData.get("student_id") || "");
  const session_id = String(formData.get("session_id") || "");
  const status = String(formData.get("status") || "present");
  if (!student_id || !session_id) return;

  const supabase = await requireStaff();
  await supabase
    .from("attendance")
    .upsert({ student_id, session_id, status }, { onConflict: "student_id,session_id" });
  revalidatePath("/app/attendance");
}

// Điểm danh có mặt cả lớp cho 1 buổi
export async function markAllPresent(formData: FormData) {
  const session_id = String(formData.get("session_id") || "");
  if (!session_id) return;
  const supabase = await requireStaff();
  const { data: students } = await supabase.from("students").select("id");
  if (students?.length) {
    await supabase.from("attendance").upsert(
      students.map((s) => ({ student_id: s.id, session_id, status: "present" })),
      { onConflict: "student_id,session_id" },
    );
  }
  revalidatePath("/app/attendance");
}
