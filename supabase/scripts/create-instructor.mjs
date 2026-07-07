// Tạo tài khoản đăng nhập cho giảng viên / hướng dẫn viên.
//
// Cách chạy (từ thư mục dự án, sau khi đã điền .env.local):
//   node --env-file=.env.local supabase/scripts/create-instructor.mjs <username> <password> "<Họ tên>" [role]
//
// Ví dụ:
//   node --env-file=.env.local supabase/scripts/create-instructor.mjs gv.thanh "MatKhau@123" "Nguyễn Văn Thanh" instructor
//
// role: instructor (mặc định) | assistant

import { createClient } from "@supabase/supabase-js";

const [username, password, fullName, role = "instructor"] = process.argv.slice(2);

if (!username || !password || !fullName) {
  console.error(
    'Thiếu tham số. Dùng: node --env-file=.env.local supabase/scripts/create-instructor.mjs <username> <password> "<Họ tên>" [role]',
  );
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const domain = process.env.LOGIN_EMAIL_DOMAIN || "fnhu.local";

if (!url || !serviceKey) {
  console.error("Chưa cấu hình NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY trong .env.local");
  process.exit(1);
}

const email = `${username.trim().toLowerCase()}@${domain}`;
const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// 1) Tạo user trong Supabase Auth (email nội bộ, xác nhận sẵn)
const { data: created, error: createErr } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { username, full_name: fullName },
});

if (createErr) {
  console.error("❌ Không tạo được user:", createErr.message);
  process.exit(1);
}

// 2) Ghi hồ sơ vào bảng profiles
const { error: profileErr } = await admin.from("profiles").upsert({
  id: created.user.id,
  username: username.trim().toLowerCase(),
  full_name: fullName,
  role,
});

if (profileErr) {
  console.error("❌ Tạo user xong nhưng lỗi khi ghi profiles:", profileErr.message);
  process.exit(1);
}

console.log(`✅ Đã tạo tài khoản: ${username}  (vai trò: ${role})`);
console.log(`   Đăng nhập tại /login bằng username "${username}" và mật khẩu đã đặt.`);
