"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/guard";

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

// Lưu điểm nhập tay (Chuyên cần + Phù hợp chuyên ngành, thang 0–100) cho 1 SV
export async function saveScores(formData: FormData) {
  const student_id = String(formData.get("student_id") || "");
  if (!student_id) return;
  const clamp = (v: FormDataEntryValue | null): number | null => {
    const s = String(v ?? "").trim();
    if (s === "") return null;
    const n = Number(s);
    if (!Number.isFinite(n)) return null;
    return Math.max(0, Math.min(100, n));
  };
  const diligence = clamp(formData.get("diligence"));
  const major_fit = clamp(formData.get("major_fit"));
  const supabase = await requireStaff();
  await supabase
    .from("grades")
    .upsert({ student_id, diligence, major_fit, updated_at: new Date().toISOString() }, { onConflict: "student_id" });
  revalidatePath("/app/attendance");
}

// Điểm danh có mặt cả lớp cho 1 buổi
export async function markAllPresent(formData: FormData) {
  const session_id = String(formData.get("session_id") || "");
  if (!session_id) return;
  const supabase = await requireStaff();
  // CHỈ điểm danh cho SV đang học (loại người đã nghỉ / không thuộc lớp)
  const { data: enr } = await supabase
    .from("enrollments")
    .select("students(id)")
    .neq("status", "withdrawn");
  const ids = (enr || [])
    .map((e) => (e as unknown as { students: { id: string } | null }).students?.id)
    .filter(Boolean) as string[];
  if (ids.length) {
    await supabase.from("attendance").upsert(
      ids.map((id) => ({ student_id: id, session_id, status: "present" })),
      { onConflict: "student_id,session_id" },
    );
  }
  revalidatePath("/app/attendance");
}
