import { Resend } from "resend";

const KEY = process.env.RESEND_API_KEY;
const FROM =
  process.env.RESEND_FROM || "Food Culture & Aesthetic <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fnu-vatel.vercel.app";

function formatVND(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

// Bọc khung email theo nhận diện thương hiệu (xanh rêu + gold)
function wrap(title: string, bodyHtml: string) {
  return `<div style="background:#102B2A;padding:32px 0;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:520px;margin:0 auto;background:#042726;border:1px solid rgba(168,136,78,0.45);border-radius:14px;overflow:hidden">
      <div style="padding:28px 32px;border-bottom:1px solid rgba(168,136,78,0.4)">
        <div style="font-family:Georgia,serif;font-size:22px;font-weight:600;color:#C9A24A">Food Culture &amp; Aesthetic</div>
        <div style="font-size:11px;letter-spacing:0.2em;color:#96A8A1;margin-top:4px">FCA-2026 · ĐẠI HỌC NGOẠI THƯƠNG</div>
      </div>
      <div style="padding:32px">
        <h1 style="font-family:Georgia,serif;font-size:24px;color:#FBF8F4;margin:0 0 16px">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:20px 32px;border-top:1px solid rgba(168,136,78,0.35);font-size:12px;color:#96A8A1">
        Food Culture &amp; Aesthetic · Chương trình Đào tạo Quốc tế
      </div>
    </div>
  </div>`;
}

type LeadLike = {
  full_name: string;
  email?: string | null;
  cohort?: string | null;
};

async function send(to: string, subject: string, html: string) {
  if (!KEY) {
    // Chưa cấu hình Resend → bỏ qua, không làm hỏng luồng chính
    console.warn("[email] RESEND_API_KEY chưa cấu hình — bỏ qua gửi:", subject);
    return;
  }
  try {
    const resend = new Resend(KEY);
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (e) {
    console.error("[email] Gửi thất bại:", (e as Error).message);
  }
}

// Gửi khi nhận được đơn đăng ký
export async function sendApplicationReceived(lead: LeadLike) {
  if (!lead.email) return;
  const html = wrap(
    "Đã nhận hồ sơ đăng ký",
    `<p style="color:#D5DFDA;font-size:15px;line-height:1.7">
       Chào <b style="color:#FBF8F4">${lead.full_name}</b>,<br><br>
       Cảm ơn bạn đã đăng ký học phần <b style="color:#C9A24A">Food Culture &amp; Aesthetic</b>.
       Hồ sơ của bạn đang <b>chờ xét duyệt</b>. Đội ngũ giảng viên sẽ liên hệ với bạn sớm.
     </p>
     <p style="color:#96A8A1;font-size:13px;line-height:1.6;margin-top:18px">
       Your application has been received and is pending review. We will contact you soon.
     </p>`,
  );
  await send(lead.email, "Đã nhận hồ sơ · Food Culture & Aesthetic", html);
}

// Gửi khi đơn được duyệt (kèm link thanh toán học phí nếu có)
export async function sendApplicationApproved(
  lead: LeadLike & { paymentCode?: string; amount?: number },
) {
  if (!lead.email) return;
  const payBlock =
    lead.paymentCode && lead.amount
      ? `<div style="margin-top:24px;padding:20px;border:1px solid rgba(168,136,78,0.5);border-radius:10px;background:#102B2A">
           <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#C9A24A;margin-bottom:8px">Học phí · Tuition</div>
           <div style="font-family:Georgia,serif;font-size:26px;color:#FBF8F4">${formatVND(lead.amount)}</div>
           <a href="${SITE_URL}/thanh-toan/${lead.paymentCode}" style="display:inline-block;margin-top:14px;background:#A8884E;color:#042726;padding:12px 24px;border-radius:8px;font-size:13px;font-weight:bold;text-decoration:none;letter-spacing:0.08em">Thanh toán học phí · Pay tuition →</a>
         </div>`
      : "";
  const html = wrap(
    "Chúc mừng — hồ sơ đã được duyệt!",
    `<p style="color:#D5DFDA;font-size:15px;line-height:1.7">
       Chào <b style="color:#FBF8F4">${lead.full_name}</b>,<br><br>
       Hồ sơ của bạn đã được <b style="color:#7FB595">DUYỆT</b>. Bạn đã chính thức trở thành
       sinh viên của học phần <b style="color:#C9A24A">Food Culture &amp; Aesthetic</b>${lead.cohort ? ` — khóa <b>${lead.cohort}</b>` : ""}.
     </p>
     ${payBlock}
     <p style="color:#96A8A1;font-size:13px;line-height:1.6;margin-top:18px">
       Congratulations! Your application has been approved. Please complete the tuition payment to confirm your seat.
     </p>`,
  );
  await send(lead.email, "Hồ sơ đã được duyệt · Food Culture & Aesthetic", html);
}
