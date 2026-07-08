"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const DOMAIN = process.env.LOGIN_EMAIL_DOMAIN || "fnhu.local";

// Username → email nội bộ (đăng nhập bằng username, không phải email thật)
function usernameToEmail(username: string) {
  return `${username.trim().toLowerCase()}@${DOMAIN}`;
}

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/app");

  if (!username || !password) {
    return { error: "Vui lòng nhập tên đăng nhập và mật khẩu." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });

  if (error) {
    return { error: "Tên đăng nhập hoặc mật khẩu không đúng." };
  }

  // Chỉ cho phép đường dẫn nội bộ; chặn "//evil.com" và "/\evil.com" (open redirect)
  const safeNext = /^\/(?![/\\])/.test(next) ? next : "/app";
  redirect(safeNext);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
