import { createClient } from "@/lib/supabase/server";

const STAFF = ["instructor", "assistant", "monitor"];
const MANAGER = ["instructor", "assistant"]; // KHÔNG gồm monitor (giám sát)

async function ctx() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Chưa đăng nhập");
  const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return { supabase, user, role: (prof?.role as string) ?? null };
}

// Yêu cầu là nhân sự (GV/trợ giảng/giám sát). Đồng thời xác thực vai trò, không chỉ đăng nhập.
export async function requireStaff() {
  const c = await ctx();
  if (!STAFF.includes(c.role ?? "")) throw new Error("Không có quyền truy cập.");
  return c.supabase;
}

// Yêu cầu quyền quản lý (GV/trợ giảng). Chặn tài khoản giám sát khỏi xóa/duyệt/thu tiền/...
export async function requireManager() {
  const c = await ctx();
  if (!MANAGER.includes(c.role ?? "")) throw new Error("Tài khoản giám sát không có quyền thực hiện thao tác này.");
  return c.supabase;
}
