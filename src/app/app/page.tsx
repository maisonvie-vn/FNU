import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";

export const metadata = { title: "F&B-FCA — CRM" };

// Hiển thị toàn bộ giao diện thiết kế (bản prototype) sau khi đăng nhập.
// Giai đoạn sau sẽ thay dần từng màn hình bằng dữ liệu Supabase thật.
export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen flex-col bg-ink">
      {/* Thanh trên cùng: danh tính + đăng xuất */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/20 bg-ink-deep px-3 py-2 sm:px-4">
        <span className="eyebrow">F&amp;B-FCA · CRM</span>
        <div className="flex flex-wrap items-center gap-1.5 text-sm sm:gap-2">
          <Link href="/app/leads" className="h-8 rounded-md bg-gold px-3 font-semibold leading-8 text-ink transition hover:bg-gold-soft">Ghi danh</Link>
          <Link href="/app/students" className="h-8 rounded-md border border-gold/40 px-3 leading-8 text-gold transition hover:bg-gold hover:text-ink">Học viên</Link>
          <Link href="/app/gradebook" className="h-8 rounded-md border border-gold/40 px-3 leading-8 text-gold transition hover:bg-gold hover:text-ink">Bảng điểm</Link>
          <Link href="/app/attendance" className="h-8 rounded-md border border-gold/40 px-3 leading-8 text-gold transition hover:bg-gold hover:text-ink">Điểm danh</Link>
          <Link href="/app/quizzes" className="h-8 rounded-md border border-gold/40 px-3 leading-8 text-gold transition hover:bg-gold hover:text-ink">Đề thi</Link>
          <Link href="/app/appointments" className="h-8 rounded-md border border-gold/40 px-3 leading-8 text-gold transition hover:bg-gold hover:text-ink">Lịch hẹn</Link>
          <Link href="/app/payments" className="h-8 rounded-md border border-gold/40 px-3 leading-8 text-gold transition hover:bg-gold hover:text-ink">Thanh toán</Link>
          <Link href="/app/doi-mat-khau" className="h-8 rounded-md px-3 leading-8 text-sage transition hover:text-gold">Đổi mật khẩu</Link>
          <form action={logout}>
            <button className="h-8 rounded-md border border-gold/30 px-3 text-mist transition hover:border-gold hover:text-gold">
              Đăng xuất
            </button>
          </form>
        </div>
      </div>

      {/* Giao diện thiết kế của bạn */}
      <iframe
        src="/preview/index.html"
        title="F&B-FCA"
        className="w-full flex-1 border-0"
      />
    </div>
  );
}
