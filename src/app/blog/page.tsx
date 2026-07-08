import Link from "next/link";
import SiteNav from "../_components/SiteNav";
import SiteFooter from "../_components/SiteFooter";
import { POSTS } from "../_data/blog";

const DISPLAY = "var(--font-display)";

export const metadata = {
  title: "Blog · Tin tức · F&B-FCA",
  description:
    "Blog F&B-FCA — bài viết về văn hóa ẩm thực, fine dining và xu hướng F&B 2026. Articles on food culture, fine dining and F&B trends.",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function BlogIndex() {
  const posts = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <div style={{ background: "#102B2A", color: "#FBF8F4", fontFamily: "var(--font-body)", minHeight: "100vh" }}>
      <SiteNav />

      <header style={{ position: "relative", background: "#042726", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 75% 20%, rgba(168,136,78,0.18), transparent 55%)" }} />
        <div data-m="pad" style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "80px 32px 56px" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.3em", color: "#C9A24A", textTransform: "uppercase", marginBottom: 20 }}>Blog · Tin tức</p>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(38px,5vw,64px)", lineHeight: 1.08, margin: "0 0 14px", maxWidth: 760 }}>
            Stories from the table.
          </h1>
          <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 20, color: "#C9A24A" }}>Câu chuyện từ bàn ăn — văn hóa, thẩm mỹ và xu hướng F&B.</div>
        </div>
      </header>

      <main data-m="pad" style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px 90px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 28 }}>
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="gal-tile" style={{ display: "block", border: "1px solid rgba(168,136,78,0.3)", borderRadius: 14, overflow: "hidden", background: "#042726", textDecoration: "none" }}>
              <div style={{ overflow: "hidden", aspectRatio: "16 / 9" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt={p.coverAlt} className="gal-cover" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
              </div>
              <div style={{ padding: "20px 22px 24px" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#96A8A1", marginBottom: 10 }}>{fmtDate(p.date)} · {p.readMins} phút đọc</div>
                <h2 style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, lineHeight: 1.25, margin: "0 0 4px", color: "#FBF8F4" }}>{p.titleVi}</h2>
                <div style={{ fontSize: 13, color: "#C9A24A", marginBottom: 12 }}>{p.titleEn}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#D5DFDA", margin: 0 }}>{p.excerptVi}</p>
                <span style={{ display: "inline-block", marginTop: 14, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9A24A" }}>Đọc tiếp · Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
