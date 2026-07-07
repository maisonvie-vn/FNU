// Tạo danh sách lớp F-NU-10 (nếu bảng students đang trống) + enrollment.
// Chạy: node --env-file=.env.local supabase/scripts/seed-roster.mjs
import { createClient } from "@supabase/supabase-js";

const a = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const ROSTER = [
  ["2505013001", "Nguyễn Đăng Khoa"],
  ["2505013002", "Đặng Quỳnh Anh"],
  ["2505013006", "Trần Phạm Anh Duy"],
  ["2505013008", "Trần Ngân Giang"],
  ["2505013010", "Nguyễn Thu Hương"],
  ["2505013012", "Nguyễn Tuấn Kiệt"],
  ["2505013013", "Nguyễn Tùng Lâm"],
  ["2505013014", "Nguyễn Hương Linh"],
  ["2505013015", "Nguyễn Lê Ngọc Linh"],
  ["2505013016", "Trịnh Mai Chi"],
  ["2505013018", "Nguyễn Bảo Ngân"],
  ["2505013020", "Lê Hải Long"],
  ["2505013021", "Hồ Hoàng Nhật Long"],
  ["2505013022", "Nguyễn Hoàng Minh"],
  ["2505013024", "Phạm Trần Hải Sơn"],
  ["2505013026", "Trương Quang Thành"],
  ["2505013028", "Nguyễn Việt Anh"],
  ["2505013030", "Bùi Đức Mạnh"],
];

const { count } = await a.from("students").select("*", { count: "exact", head: true });
if (count && count > 0) {
  console.log(`Bảng students đã có ${count} bản ghi — bỏ qua seed.`);
  process.exit(0);
}

for (const [code, name] of ROSTER) {
  const { data: s, error } = await a
    .from("students")
    .insert({ student_code: code, full_name: name })
    .select("id")
    .single();
  if (error) {
    console.error("Lỗi", name, error.message);
    continue;
  }
  await a.from("enrollments").insert({ student_id: s.id, cohort: "F-NU-10" });
}
console.log(`✅ Đã tạo ${ROSTER.length} sinh viên lớp F-NU-10.`);
