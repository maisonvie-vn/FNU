// Test đăng nhập đầu-cuối bằng anon key (mô phỏng trình duyệt).
// Chạy: node --env-file=.env.local supabase/scripts/test-login.mjs <username> <password>
import { createClient } from "@supabase/supabase-js";

const [username, password] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const domain = process.env.LOGIN_EMAIL_DOMAIN || "fnhu.local";
const email = `${username.toLowerCase()}@${domain}`;

const supabase = createClient(url, anon);

const { data, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) {
  console.log("❌ ĐĂNG NHẬP THẤT BẠI:", error.message);
  process.exit(1);
}
console.log("✅ ĐĂNG NHẬP THÀNH CÔNG");
console.log("   user id:", data.user.id);

// Đọc hồ sơ như dashboard sẽ làm (kiểm tra RLS cho chính mình)
const { data: profile, error: pErr } = await supabase
  .from("profiles")
  .select("username, full_name, role")
  .eq("id", data.user.id)
  .single();

if (pErr) console.log("⚠️  Đọc profile lỗi:", pErr.message);
else console.log("   profile:", JSON.stringify(profile));
