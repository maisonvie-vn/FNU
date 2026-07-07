import Link from "next/link";

const DISPLAY = "var(--font-display)";

const LINKS = [
  { href: "/ve-chung-toi", en: "About", vi: "Về chúng tôi" },
  { href: "/#curriculum", en: "Curriculum", vi: "Chương trình" },
  { href: "/thu-vien-anh", en: "Gallery", vi: "Thư viện ảnh" },
  { href: "/blog", en: "Blog", vi: "Tin tức" },
  { href: "/#faq", en: "FAQ", vi: "Hỏi đáp" },
  { href: "/login", en: "Sign in", vi: "GV đăng nhập" },
];

// Thanh điều hướng dùng chung cho toàn bộ trang công khai
export default function SiteNav() {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(4,39,38,0.94)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(168,136,78,0.45)" }}>
      <div data-m="pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <Link href="/" style={{ display: "flex", alignItems: "baseline", gap: 12, textDecoration: "none" }}>
          <span style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, letterSpacing: "0.02em", color: "#C9A24A", whiteSpace: "nowrap" }}>
            Food Culture <span style={{ fontStyle: "italic", fontWeight: 400 }}>&amp;</span> Aesthetic
          </span>
          <span style={{ fontSize: 11, letterSpacing: "0.22em", color: "#96A8A1" }}>FCA-2026</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} data-m="navlink" className="fd-nav">
              <span className="en">{l.en}</span>
              <span className="vi">{l.vi}</span>
            </Link>
          ))}
          <Link href="/#enroll" className="l-cta" style={{ border: "1px solid #A8884E", color: "#C9A24A", padding: "12px 26px", borderRadius: 8, letterSpacing: "0.16em", fontSize: 12, textTransform: "uppercase", fontWeight: 600, whiteSpace: "nowrap" }}>
            Enroll · Ghi danh
          </Link>
        </div>
      </div>
    </div>
  );
}
