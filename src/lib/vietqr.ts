// Sinh mã QR VietQR (ảnh động qua img.vietqr.io) + tiện ích định dạng.
// Cấu hình qua env: VIETQR_BANK (mã/BIN ngân hàng), VIETQR_ACCOUNT (số TK), VIETQR_NAME (tên TK).

export const BANK = process.env.VIETQR_BANK || "";
export const ACCOUNT = process.env.VIETQR_ACCOUNT || "";
export const ACCOUNT_NAME = process.env.VIETQR_NAME || "";
export const COURSE_FEE_VND = Number(process.env.COURSE_FEE_VND || 3000000);

export const vietqrConfigured = Boolean(BANK && ACCOUNT);

export function formatVND(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

// URL ảnh QR (chuẩn EMVCo VietQR). template compact2 hiển thị số tiền + nội dung.
export function vietqrImageUrl(amount: number, addInfo: string) {
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo,
    accountName: ACCOUNT_NAME,
  });
  return `https://img.vietqr.io/image/${encodeURIComponent(BANK)}-${encodeURIComponent(
    ACCOUNT,
  )}-compact2.png?${params.toString()}`;
}
