import { createAdminClient } from "@/lib/supabase/admin";
import {
  vietqrConfigured,
  vietqrImageUrl,
  formatVND,
  BANK,
  ACCOUNT,
  ACCOUNT_NAME,
} from "@/lib/vietqr";

export const metadata = { title: "Thanh toán học phí · Food Culture & Aesthetic" };
export const dynamic = "force-dynamic";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const admin = createAdminClient();

  const { data: payment } = await admin
    .from("payments")
    .select("id, amount, transfer_code, status, enrollment_id")
    .eq("transfer_code", code)
    .single();

  let studentName = "";
  if (payment?.enrollment_id) {
    const { data: enr } = await admin
      .from("enrollments")
      .select("students(full_name)")
      .eq("id", payment.enrollment_id)
      .single();
    // @ts-expect-error nested relation
    studentName = enr?.students?.full_name || "";
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl text-gold">Food Culture <span className="italic">&amp; Aesthetic</span></h1>
        <p className="eyebrow mt-2">Thanh toán học phí · Tuition</p>
      </div>

      {!payment ? (
        <div className="rounded-2xl border border-danger/40 bg-ink-deep/60 p-8 text-center">
          <p className="font-display text-2xl text-danger">Không tìm thấy khoản thanh toán</p>
          <p className="mt-2 text-sm text-sage">Mã <span className="font-mono">{code}</span> không hợp lệ hoặc đã bị huỷ.</p>
        </div>
      ) : payment.status === "paid" ? (
        <div className="rounded-2xl border border-success/40 bg-ink-deep/60 p-8 text-center">
          <p className="font-display text-2xl text-success">Đã thanh toán ✓</p>
          <p className="mt-2 text-sm text-mist">Cảm ơn bạn. Học phí đã được ghi nhận.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gold/25 bg-ink-deep/60 p-6">
          {studentName && <p className="mb-1 text-center text-sm text-sage">Sinh viên: <span className="text-cream">{studentName}</span></p>}
          <div className="mb-4 text-center">
            <div className="font-display text-4xl text-cream">{formatVND(payment.amount)}</div>
          </div>

          {vietqrConfigured ? (
            <div className="rounded-xl bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={vietqrImageUrl(payment.amount, payment.transfer_code)} alt="VietQR" className="mx-auto w-full max-w-[280px]" />
            </div>
          ) : (
            <div className="rounded-xl border border-gold/30 p-4 text-center text-sm text-sage">
              Chưa cấu hình tài khoản nhận tiền (VIETQR_BANK / VIETQR_ACCOUNT).
            </div>
          )}

          <div className="mt-5 space-y-2 text-sm">
            <Row label="Ngân hàng" value={BANK || "—"} />
            <Row label="Số tài khoản" value={ACCOUNT || "—"} />
            <Row label="Chủ tài khoản" value={ACCOUNT_NAME || "—"} />
            <Row label="Nội dung CK" value={payment.transfer_code} highlight />
          </div>
          <p className="mt-5 text-center text-xs text-sage">
            Quét mã bằng app ngân hàng, hoặc chuyển khoản thủ công với <b className="text-gold">đúng nội dung</b> ở trên để được đối soát tự động.
          </p>
        </div>
      )}
    </main>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-gold/10 py-1.5">
      <span className="text-sage">{label}</span>
      <span className={`font-mono ${highlight ? "text-gold" : "text-mist"}`}>{value}</span>
    </div>
  );
}
