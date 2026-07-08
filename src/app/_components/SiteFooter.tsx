import Link from "next/link";

const DISPLAY = "var(--font-display)";

const NAV = [
  { href: "/ve-chung-toi", en: "About us", vi: "Về chúng tôi" },
  { href: "/thu-vien-anh", en: "Gallery", vi: "Thư viện ảnh" },
  { href: "/blog", en: "Blog", vi: "Tin tức" },
  { href: "/cong-sinh-vien", en: "Student portal", vi: "Cổng sinh viên" },
  { href: "/#curriculum", en: "Curriculum", vi: "Chương trình" },
  { href: "/#faq", en: "FAQ", vi: "Hỏi đáp" },
  { href: "/#enroll", en: "Enroll", vi: "Ghi danh" },
  { href: "/login", en: "Instructor sign in", vi: "GV đăng nhập" },
];

// Chân trang dùng chung — cũng là menu trên mobile (nav trên bị ẩn ở màn nhỏ)
export default function SiteFooter() {
  return (
    <footer style={{ background: "#042726", borderTop: "1px solid rgba(168,136,78,0.4)" }}>
      <div data-m="pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 32px 40px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40 }}>
        <div>
          <div style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 600, color: "#C9A24A" }}>
            Food Culture <span style={{ fontStyle: "italic", fontWeight: 400 }}>&amp;</span> Aesthetic
          </div>
          <p style={{ marginTop: 12, maxWidth: 420, fontSize: 14, lineHeight: 1.7, color: "#96A8A1" }}>
            Đọc văn hóa qua ẩm thực — thiết kế trải nghiệm bàn ăn.
            <br />
            <span style={{ color: "#8f9d96" }}>Read culture through food, design the dining experience.</span>
          </p>
        </div>
        <nav style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", alignContent: "start" }}>
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="l-ul" style={{ color: "#D5DFDA", fontSize: 13.5 }}>
              {l.en} <span style={{ color: "#96A8A1", fontSize: 11 }}>· {l.vi}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div style={{ borderTop: "1px solid rgba(168,136,78,0.25)" }}>
        <div data-m="pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 32px", fontSize: 12, color: "#8f9d96" }}>
          © 2026 Food Culture &amp; Aesthetic · FCA-2026
        </div>
      </div>
    </footer>
  );
}
