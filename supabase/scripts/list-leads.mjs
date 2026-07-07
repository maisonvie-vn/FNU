// Liệt kê đơn ghi danh gần đây. Chạy: node --env-file=.env.local supabase/scripts/list-leads.mjs
import { createClient } from "@supabase/supabase-js";
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
const { data, error } = await admin
  .from("leads")
  .select("full_name, email, phone, status, created_at")
  .order("created_at", { ascending: false })
  .limit(10);
if (error) { console.log("LỖI:", error.message); process.exit(1); }
console.log(`Tổng số đơn gần nhất: ${data.length}`);
for (const l of data) console.log(` - ${l.full_name} | ${l.email || l.phone} | ${l.status} | ${l.created_at}`);
