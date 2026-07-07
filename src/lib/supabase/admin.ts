import { createClient } from "@supabase/supabase-js";

// Client quyền cao (service role) — CHỈ dùng ở server, cho thao tác quản trị
// như tạo tài khoản giảng viên. Không bao giờ import vào Client Component.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
