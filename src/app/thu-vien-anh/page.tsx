import SiteNav from "../_components/SiteNav";
import SiteFooter from "../_components/SiteFooter";
import Gallery from "./Gallery";

const DISPLAY = "var(--font-display)";

export const metadata = {
  title: "Thư viện ảnh · Gallery · F&B-FCA",
  description:
    "Thư viện ảnh học phần F&B-FCA — hình ảnh các lớp học, studio trình bày, phục vụ fine-dining và trình diễn tốt nghiệp. Photo gallery by class.",
};

export default function GalleryPage() {
  return (
    <div style={{ background: "#102B2A", color: "#FBF8F4", fontFamily: "var(--font-body)", minHeight: "100vh" }}>
      <SiteNav />

      <header style={{ position: "relative", background: "#042726", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 75% 20%, rgba(168,136,78,0.18), transparent 55%)" }} />
        <div data-m="pad" style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "80px 32px 60px" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.3em", color: "#C9A24A", textTransform: "uppercase", marginBottom: 20 }}>Gallery · Thư viện ảnh</p>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(38px,5vw,64px)", lineHeight: 1.08, margin: "0 0 14px", maxWidth: 760 }}>
            Moments from the studio.
          </h1>
          <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 20, color: "#C9A24A" }}>
            Khoảnh khắc từ studio — chọn một lớp để xem thêm ảnh.
          </div>
        </div>
      </header>

      <main data-m="pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 90px" }}>
        <Gallery />
      </main>

      <SiteFooter />
    </div>
  );
}
