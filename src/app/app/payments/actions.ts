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

// Xác nhận đã nhận tiền (đối soát thủ công)
export async function markPaid(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await requireStaff();
  await supabase
    .from("payments")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/app/payments");
}
