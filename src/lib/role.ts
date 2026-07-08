import { createClient } from "@/lib/supabase/server";

// Lấy vai trò của người đang đăng nhập: instructor | assistant | monitor | null
export async function getMyRole(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return data?.role ?? null;
}

// Các trang mà tài khoản GIÁM SÁT (monitor) được phép vào
export const MONITOR_ALLOWED = ["/app/students", "/app/attendance", "/app/doi-mat-khau"];
export function isMonitorAllowed(path: string) {
  return MONITOR_ALLOWED.some((a) => path === a || path.startsWith(a + "/"));
}
