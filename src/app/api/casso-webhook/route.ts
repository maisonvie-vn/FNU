import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPaymentConfirmed } from "@/lib/email";

// Webhook nhận thông báo giao dịch ngân hàng từ Casso (https://casso.vn).
// Khi có tiền vào tài khoản, Casso POST tới đây; ta khớp nội dung CK với payments
// đang chờ, đánh dấu ĐÃ THU và gửi email biên nhận cho học viên — hoàn toàn tự động.
//
// Cấu hình: đặt env CASSO_WEBHOOK_TOKEN = một chuỗi bí mật, rồi trong Casso dashboard
// đặt đúng chuỗi đó làm "Secure Token" cho webhook trỏ tới:
//   https://fnu-vatel.vercel.app/api/casso-webhook

type CassoTxn = {
  id?: number | string;
  description?: string;
  amount?: number;
  when?: string;
  tid?: string;
};

const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");

export async function POST(req: NextRequest) {
  const expected = process.env.CASSO_WEBHOOK_TOKEN;
  if (!expected) {
    return NextResponse.json({ error: 1, message: "CASSO_WEBHOOK_TOKEN chưa cấu hình" }, { status: 500 });
  }

  // Xác thực: Casso gửi header "secure-token" phải khớp với token đã cấu hình
  const token = req.headers.get("secure-token") || req.headers.get("Secure-Token");
  if (token !== expected) {
    return NextResponse.json({ error: 1, message: "Sai secure-token" }, { status: 401 });
  }

  let body: { data?: CassoTxn[] } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 1, message: "Body không hợp lệ" }, { status: 400 });
  }

  const txns = body.data || [];
  if (txns.length === 0) return NextResponse.json({ error: 0, matched: 0 });

  const admin = createAdminClient();

  // Lấy các khoản đang chờ thu để đối chiếu (bỏ khoản thiếu mã CK để không lỗi cả lô)
  const { data: pendingRaw } = await admin
    .from("payments")
    .select("id, amount, transfer_code, enrollment_id, status")
    .eq("status", "pending");
  const pending = (pendingRaw || []).filter((x) => x.transfer_code);

  let matched = 0;
  const usedPaymentIds = new Set<string>();
  for (const txn of txns) {
    const desc = norm(String(txn.description || ""));
    const amount = Number(txn.amount || 0);
    if (amount <= 0) continue;

    // Chỉ khớp giao dịch TIỀN VÀO, mỗi khoản chờ chỉ khớp 1 lần (chống thu/gửi email trùng)
    const p = pending.find(
      (x) => !usedPaymentIds.has(x.id) && desc.includes(norm(x.transfer_code)) && amount >= x.amount,
    );
    if (!p) continue;
    usedPaymentIds.add(p.id);

    // Chỉ đánh dấu nếu còn đang chờ (nguyên tử) — tránh double nếu chạy song song
    const { data: upd } = await admin
      .from("payments")
      .update({ status: "paid", paid_at: new Date().toISOString(), raw_txn: txn as object })
      .eq("id", p.id)
      .eq("status", "pending")
      .select("id");
    if (!upd || upd.length === 0) continue;
    matched++;

    // Gửi email biên nhận cho học viên (không chặn nếu lỗi)
    if (p.enrollment_id) {
      const { data: enr } = await admin
        .from("enrollments")
        .select("students(full_name, email)")
        .eq("id", p.enrollment_id)
        .single();
      const student = (enr as unknown as { students: { full_name: string; email: string | null } | null })?.students;
      if (student) {
        await sendPaymentConfirmed({
          full_name: student.full_name,
          email: student.email,
          amount: p.amount,
          transferCode: p.transfer_code,
        });
      }
    }
  }

  return NextResponse.json({ error: 0, matched });
}

// Casso đôi khi gọi GET để kiểm tra endpoint sống — trả 200 cho tiện
export async function GET() {
  return NextResponse.json({ ok: true, service: "casso-webhook" });
}
