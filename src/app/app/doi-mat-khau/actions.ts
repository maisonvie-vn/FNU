"use server";

import { createClient } from "@/lib/supabase/server";

export type ChangePwState = { ok?: boolean; error?: string };

// Đổi mật khẩu của chính giảng viên đang đăng nhập
export async function changePassword(
  _prev: ChangePwState,
  formData: FormData,
): Promise<ChangePwState> {
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (password.length < 6)
    return { error: "Mật khẩu mới phải có ít nhất 6 ký tự." };
  if (password !== confirm)
    return { error: "Mật khẩu nhập lại không khớp." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "Không đổi được mật khẩu: " + error.message };

  return { ok: true };
}
