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

function parseScore(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (s === "") return null;
  const n = Number(s.replace(",", "."));
  if (Number.isNaN(n)) return null;
  return Math.min(10, Math.max(0, n));
}

// Lưu điểm quá trình & cuối kỳ cho 1 sinh viên
export async function upsertGrade(formData: FormData) {
  const student_id = String(formData.get("student_id") || "");
  if (!student_id) return;
  const coursework = parseScore(formData.get("coursework"));
  const final = parseScore(formData.get("final"));

  const supabase = await requireStaff();
  await supabase
    .from("grades")
    .upsert(
      { student_id, coursework, final, updated_at: new Date().toISOString() },
      { onConflict: "student_id" },
    );
  revalidatePath("/app/gradebook");
}
