"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../../login/actions";

const NAV = [
  { href: "/app", en: "Overview", vi: "Tổng quan", icon: "◆", exact: true },
  { href: "/app/leads", en: "Enrollment", vi: "Ghi danh", icon: "✦" },
  { href: "/app/students", en: "Students", vi: "Học viên", icon: "☰" },
  { href: "/app/gradebook", en: "Gradebook", vi: "Bảng điểm", icon: "▤" },
  { href: "/app/attendance", en: "Attendance", vi: "Điểm danh", icon: "✓" },
  { href: "/app/quizzes", en: "Quizzes", vi: "Đề thi", icon: "❓" },
  { href: "/app/appointments", en: "Appointments", vi: "Lịch hẹn", icon: "◷" },
  { href: "/app/payments", en: "Payments", vi: "Thanh toán", icon: "₫" },
  { href: "/app/doi-mat-khau", en: "Password", vi: "Đổi mật khẩu", icon: "⚿" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="shrink-0 border-b border-gold/20 bg-ink-deep md:min-h-screen md:w-56 md:border-b-0 md:border-r">
      <div className="hidden px-5 pt-5 md:block">
        <Link href="/app" className="font-display text-xl font-semibold text-gold">
          F<span className="italic font-normal">&amp;</span>B-FCA
        </Link>
        <div className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-sage">CRM · Quản trị</div>
      </div>
      <nav className="flex gap-1 overflow-x-auto p-2 md:flex-col md:gap-0.5 md:overflow-visible md:p-3">
        {NAV.map((l) => {
          const active = isActive(l.href, l.exact);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
                active ? "bg-gold font-semibold text-ink" : "text-mist hover:bg-gold/10 hover:text-gold"
              }`}
            >
              <span className={`text-xs ${active ? "text-ink" : "text-gold"}`}>{l.icon}</span>
              <span>{l.vi}</span>
            </Link>
          );
        })}
        <form action={logout} className="shrink-0 md:mt-2 md:border-t md:border-gold/15 md:pt-2">
          <button className="flex w-full items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-sage transition hover:bg-danger/10 hover:text-danger">
            <span className="text-xs">⏻</span>
            <span>Đăng xuất</span>
          </button>
        </form>
      </nav>
    </aside>
  );
}
