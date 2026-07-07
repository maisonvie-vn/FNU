import SiteNav from "../_components/SiteNav";
import SiteFooter from "../_components/SiteFooter";

const DISPLAY = "var(--font-display)";

export const metadata = {
  title: "Về chúng tôi · About · Food Culture & Aesthetic",
  description:
    "Food Culture & Aesthetic (FCA-2026) — học phần đọc văn hóa qua ẩm thực và thiết kế trải nghiệm bàn ăn. About the programme, our approach and values.",
};

const VALUES = [
  { en: "Culture first", vi: "Văn hóa làm gốc", body: "Every dish is a cultural text — we teach students to read identity, history and place on the plate. · Mỗi món ăn là một văn bản văn hóa: đọc bản sắc, lịch sử và vùng đất trên đĩa." },
  { en: "Craft & aesthetics", vi: "Tay nghề & thẩm mỹ", body: "Composition, sensory sequencing and menus that tell a coherent story. · Bố cục, trình tự cảm giác và thực đơn kể một câu chuyện mạch lạc." },
  { en: "Ready for 2026", vi: "Sẵn sàng cho 2026", body: "AI in service design, Gen Z dining behaviour and sustainability as craft. · AI trong thiết kế dịch vụ, hành vi Gen Z và tính bền vững như một tay nghề." },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#102B2A", color: "#FBF8F4", fontFamily: "var(--font-body)" }}>
      <SiteNav />

      {/* Hero */}
      <header style={{ position: "relative", background: "#042726", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 75% 20%, rgba(168,136,78,0.18), transparent 55%)" }} />
        <div data-m="pad" style={{ position: "relative", maxWidth: 1000, margin: "0 auto", padding: "96px 32px 80px" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.3em", color: "#C9A24A", textTransform: "uppercase", marginBottom: 22 }}>About us · Về chúng tôi</p>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(40px,5.5vw,68px)", lineHeight: 1.08, margin: "0 0 18px", maxWidth: 760 }}>
            A course about the meaning of the meal.
          </h1>
          <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 22, color: "#C9A24A" }}>
            Một học phần về ý nghĩa của bữa ăn.
          </div>
        </div>
      </header>

      {/* Mission */}
      <section data-m="pad" style={{ maxWidth: 820, margin: "0 auto", padding: "80px 32px 40px" }}>
        <h2 style={{ fontFamily: DISPLAY, fontSize: 34, fontWeight: 500, margin: "0 0 6px" }}>Our mission</h2>
        <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 18, color: "#C9A24A", marginBottom: 22 }}>Sứ mệnh của chúng tôi</div>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: "#D5DFDA", margin: "0 0 18px" }}>
          Food Culture &amp; Aesthetic is a university course that treats gastronomy as a language. Across fourteen lessons and three modules, students learn to read the culture behind a cuisine and to design dining experiences with intention — from the plate to the room.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "#96A8A1", margin: 0 }}>
          Food Culture &amp; Aesthetic là học phần đại học xem ẩm thực như một ngôn ngữ. Qua 14 bài học và 3 học phần, sinh viên học cách đọc văn hóa phía sau một nền ẩm thực và thiết kế trải nghiệm bàn ăn có chủ đích — từ chiếc đĩa đến không gian.
        </p>
      </section>

      {/* Values */}
      <section data-m="pad" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 90px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 40 }}>
          {VALUES.map((v, i) => (
            <div key={i} style={{ borderTop: "1px solid #A8884E", paddingTop: 24 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 15, fontStyle: "italic", color: "#C9A24A", marginBottom: 10 }}>0{i + 1}</div>
              <h3 style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 600, margin: "0 0 2px" }}>{v.en}</h3>
              <div style={{ fontSize: 13, color: "#C9A24A", marginBottom: 12 }}>{v.vi}</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#D5DFDA", margin: 0 }}>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#042726", borderTop: "1px solid rgba(168,136,78,0.4)" }}>
        <div data-m="pad" style={{ maxWidth: 900, margin: "0 auto", padding: "70px 32px", textAlign: "center" }}>
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(30px,4vw,44px)", fontWeight: 500, margin: "0 0 8px" }}>Take your seat at the table.</h2>
          <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 20, color: "#C9A24A", marginBottom: 26 }}>Giữ chỗ của bạn tại bàn ăn.</div>
          <a href="/#enroll" className="l-gold" style={{ display: "inline-block", background: "#A8884E", color: "#042726", padding: "15px 34px", borderRadius: 8, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>
            Enroll · Ghi danh
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
