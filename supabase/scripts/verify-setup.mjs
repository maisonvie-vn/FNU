// Kiểm tra kết nối Supabase + trạng thái bảng dữ liệu.
// Chạy: node --env-file=.env.local supabase/scripts/verify-setup.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !service) {
  console.error("THIEU_ENV");
  process.exit(2);
}

const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Thử đọc bảng profiles → biết migration đã chạy chưa
const { error } = await admin.from("profiles").select("id").limit(1);

if (!error) {
  console.log("TABLES_OK");
} else if (
  /relation .* does not exist/i.test(error.message) ||
  error.code === "PGRST205" ||
  /schema cache/i.test(error.message)
) {
  console.log("TABLES_MISSING");
} else {
  console.log("ERROR: " + error.message);
}
