import SiteNav from "../_components/SiteNav";
import SiteFooter from "../_components/SiteFooter";
import StudentLookup from "./StudentLookup";

const DISPLAY = "var(--font-display)";

export const metadata = {
  title: "Cổng sinh viên · Food Culture & Aesthetic",
  description: "Tra cứu điểm và điểm danh của bạn — học phần Food Culture & Aesthetic.",
};

export default function StudentPortalPage() {
  return (
    <div style={{ background: "#102B2A", color: "#FBF8F4", fontFamily: "var(--font-body)", minHeight: "100vh" }}>
      <SiteNav />

      <header style={{ position: "relative", background: "#042726", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 75% 20%, rgba(168,136,78,0.18), transparent 55%)" }} />
        <div data-m="pad" style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "72px 32px 48px", textAlign: "center" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.3em", color: "#C9A24A", textTransform: "uppercase", marginBottom: 18 }}>Cổng sinh viên · Student portal</p>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(34px,4.6vw,56px)", lineHeight: 1.1, margin: "0 0 12px" }}>Kết quả học tập của bạn</h1>
          <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 19, color: "#C9A24A" }}>Xem điểm và điểm danh của chính mình.</div>
        </div>
      </header>

      <main data-m="pad" style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 32px 90px" }}>
        <StudentLookup />
      </main>

      <SiteFooter />
    </div>
  );
}
