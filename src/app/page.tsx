import Curriculum from "./_landing/Curriculum";
import Faq from "./_landing/Faq";
import EnrollForm from "./_landing/EnrollForm";
import SiteNav from "./_components/SiteNav";
import SiteFooter from "./_components/SiteFooter";

export const metadata = {
  title: "Food Culture & Aesthetic — FCA-2026",
  description:
    "Học phần Food Culture & Aesthetic. Read culture through food, design the dining experience.",
};

const DISPLAY = "var(--font-display)";
const BODY = "var(--font-body)";

const benefits = [
  { no: "Outcome 01", title: "Cultural literacy", titleVi: "Hiểu biết văn hóa", body: "Read any dish, menu, or dining ritual as a cultural text — and explain what it says about identity, class, faith, and place. · Đọc mọi món ăn, thực đơn hay nghi thức bàn ăn như một văn bản văn hóa." },
  { no: "Outcome 02", title: "Aesthetic craft", titleVi: "Tay nghề thẩm mỹ", body: "Compose plates, tables, and rooms deliberately: visual balance, sensory sequencing, and menus that tell a coherent story. · Bố cục đĩa, bàn và không gian một cách chủ đích." },
  { no: "Outcome 03", title: "2026-ready F&B thinking", titleVi: "Tư duy F&B 2026", body: "A working grasp of AI in service design, Gen Z dining behavior, and sustainability as a business constraint. · Nắm vững AI trong thiết kế dịch vụ, hành vi Gen Z và tính bền vững." },
];

const stats = [
  { value: "14", label: "Lessons", labelVi: "Bài học" },
  { value: "3", label: "Modules", labelVi: "Học phần" },
  { value: "1", label: "Capstone project", labelVi: "Đồ án tốt nghiệp" },
  { value: "30", label: "Cohort seats", labelVi: "Chỗ mỗi khóa" },
  { value: "70%", label: "Practical case studies", labelVi: "Tình huống thực hành" },
];

const experiences = [
  { tag: "Cuisine case study · Nghiên cứu ẩm thực", title: "French haute cuisine", img: "photo: classical French plating, silver service", body: "How luxury was codified — from Escoffier's brigade to the modern tasting menu. · Cách sự xa xỉ được chuẩn hóa trong ẩm thực Pháp." },
  { tag: "Cuisine case study · Nghiên cứu ẩm thực", title: "Japanese washoku", img: "photo: kaiseki course, ceramics, seasonal garnish", body: "Restraint, seasonality, and negative space as a complete aesthetic system. · Tiết chế, mùa vụ và khoảng trống như một hệ thẩm mỹ." },
  { tag: "Cuisine case study · Nghiên cứu ẩm thực", title: "Phở deconstructed", img: "photo: phở bò, herbs, street-side steam", body: "One bowl, a century of history: phở as migration, memory, and national identity. · Một bát phở, một thế kỷ lịch sử." },
  { tag: "Studio lab · Thực hành studio", title: "Plating labs", img: "photo: students plating in studio kitchen", body: "Hands-on composition studios: color, height, negative space, and sauce work. · Thực hành bố cục đĩa: màu, khối, khoảng trống, sốt." },
  { tag: "2026 seminar · Chuyên đề 2026", title: "AI in F&B", img: "photo: tablet menu, service robot detail", body: "Where AI genuinely changes hospitality — forecasting, personalization, service choreography. · AI thực sự thay đổi ngành ở đâu." },
  { tag: "2026 seminar · Chuyên đề 2026", title: "Zero-waste kitchens", img: "photo: fermentation jars, root-to-leaf prep", body: "Sustainability as craft: fermentation, whole-ingredient cooking, honest sourcing. · Bền vững như một tay nghề." },
];

const gradeBars = [
  { label: "Attendance", vi: "Điểm chuyên cần", pct: "10%", width: "10%", fill: "#96A8A1" },
  { label: "Coursework", vi: "Điểm quá trình — quizzes, assignments, presentation, participation", pct: "30%", width: "30%", fill: "#A8884E" },
  { label: "Final assessment", vi: "Điểm cuối kỳ — capstone 50% + thi viết 50%", pct: "60%", width: "60%", fill: "#C9A24A" },
];

const instructors = [
  { name: "Expert Trương Quang Thành", role: "Instructor · Giảng viên", bio: "Leads the course — lectures, case studies and final assessment. · Phụ trách học phần: bài giảng, tình huống nghiên cứu và đánh giá cuối kỳ." },
  { name: "FOH Mentors", role: "Front of House · Hướng dẫn FOH", bio: "Nguyễn Thị Phương · Phạm Thị Hồng Liên · Nguyễn Thị Thu Hà — dining-room craft, service choreography and guest experience. · Nghiệp vụ nhà hàng, phục vụ và trải nghiệm khách." },
  { name: "BOH Mentors", role: "Back of House · Hướng dẫn BOH", bio: "Mr Joel · Mr Vũ Văn Ái · Mr Phạm Văn Đoàn · Mrs Đặng Thị Thanh — kitchen practice, plating labs and studio work. · Thực hành bếp, lab trình bày và studio." },
];

const quotes = [
  { text: "I stopped seeing plates and started seeing arguments — every dish makes a claim about who we are.", textVi: "“Tôi không còn nhìn thấy những chiếc đĩa — tôi thấy những luận điểm về việc chúng ta là ai.”", who: "Student, Cohort 2025 · Sinh viên khóa 2025" },
  { text: "The capstone changed how I design service. I present dining concepts, not menus.", textVi: "“Đồ án tốt nghiệp thay đổi cách tôi thiết kế dịch vụ: tôi trình bày ý niệm bữa ăn, không chỉ thực đơn.”", who: "Student, Cohort 2025 · Sinh viên khóa 2025" },
];

export default function HomePage() {
  return (
    <div style={{ background: "#102B2A", color: "#FBF8F4", fontFamily: BODY }}>
      <SiteNav />

      {/* ===== HERO ===== */}
      <div style={{ position: "relative", background: "#042726", color: "#FBF8F4", overflow: "hidden" }}>
        {/* Ảnh nền food */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: 'url("/hero.webp")', backgroundSize: "cover", backgroundPosition: "center" }} />
        {/* Lớp phủ tối để chữ đọc rõ (đậm bên trái, nhạt dần sang phải) */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, #042726 0%, rgba(4,39,38,0.92) 40%, rgba(4,39,38,0.6) 72%, rgba(4,39,38,0.3) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(4,39,38,0.5) 0%, transparent 30%, transparent 70%, rgba(4,39,38,0.55) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 30%, rgba(168,136,78,0.16), transparent 55%)" }} />
        <div data-m="pad" style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "120px 32px 110px", animation: "fadeUp 0.9s ease both" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.32em", color: "#C9A24A", textTransform: "uppercase", marginBottom: 26 }}>University Course · Hospitality &amp; F&amp;B — Học phần đại học</div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(44px,6.5vw,84px)", lineHeight: 1.05, margin: "0 0 18px", maxWidth: 820, color: "#FBF8F4" }}>Read culture through food.<br /><span style={{ fontStyle: "italic", color: "#C9A24A" }}>Design</span> the dining experience.</h1>
          <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 22, color: "#C9A24A", marginBottom: 26 }}>Đọc văn hóa qua ẩm thực — thiết kế trải nghiệm bàn ăn.</div>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: "#D5DFDA", maxWidth: 640, margin: "0 0 40px" }}>Four movements — foundations of food culture, the aesthetics of dining, iconic cuisines as cultural case studies, and the 2026 F&amp;B landscape of AI, Gen Z and sustainability.<br /><span style={{ fontSize: 14.5, color: "#96A8A1" }}>Bốn học phần: nền tảng văn hóa ẩm thực, thẩm mỹ trải nghiệm bàn ăn, các nền ẩm thực biểu tượng, và F&amp;B hiện đại 2026.</span></p>
          <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
            <a href="#enroll" className="l-gold" style={{ background: "#A8884E", color: "#042726", padding: "16px 36px", borderRadius: 8, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>Enroll in the Next Cohort · Ghi danh khóa tới</a>
            <a href="#curriculum" className="l-ul" style={{ color: "#FBF8F4", borderBottom: "1px solid #A8884E", paddingBottom: 3, fontSize: 14, letterSpacing: "0.06em" }}>View curriculum · Xem chương trình →</a>
          </div>
        </div>
      </div>

      {/* ===== WHY THIS COURSE ===== */}
      <div data-m="pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 32px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 56 }}>
          {benefits.map((b) => (
            <div key={b.no} style={{ borderTop: "1px solid #A8884E", paddingTop: 28 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 15, fontStyle: "italic", color: "#C9A24A", marginBottom: 14 }}>{b.no}</div>
              <h3 style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 600, margin: "0 0 4px", lineHeight: 1.2, color: "#FBF8F4" }}>{b.title}</h3>
              <div style={{ fontSize: 13, color: "#C9A24A", marginBottom: 14 }}>{b.titleVi}</div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#D5DFDA", margin: 0 }}>{b.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== CURRICULUM ===== */}
      <div id="curriculum" data-m="pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 100px" }}>
        <div data-m="grid2" style={{ display: "grid", gridTemplateColumns: "minmax(220px,320px) 1fr", gap: 64 }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.3em", color: "#C9A24A", textTransform: "uppercase", marginBottom: 18 }}>Curriculum · Chương trình học</div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 44, fontWeight: 500, lineHeight: 1.12, margin: "0 0 8px", color: "#FBF8F4" }}>Fourteen lessons, three modules.</h2>
            <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 19, color: "#C9A24A", marginBottom: 20 }}>Mười bốn bài học, ba học phần.</div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#D5DFDA" }}>A vertical journey from cultural theory to the studio table. Fifteen sessions in total — one orientation, fourteen lectures and labs.<br /><span style={{ fontSize: 13, color: "#96A8A1" }}>Tổng cộng 15 buổi: 1 buổi định hướng, 14 buổi giảng và thực hành.</span></p>
          </div>
          <Curriculum />
        </div>
      </div>

      {/* ===== BY THE NUMBERS ===== */}
      <div style={{ background: "#042726", borderTop: "1px solid rgba(168,136,78,0.4)", borderBottom: "1px solid rgba(168,136,78,0.4)" }}>
        <div data-m="pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 40, textAlign: "center" }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: DISPLAY, fontSize: 58, fontWeight: 500, color: "#C9A24A", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#FBF8F4", marginTop: 12 }}>{s.label}</div>
              <div style={{ fontSize: 11.5, color: "#96A8A1", marginTop: 4 }}>{s.labelVi}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SIGNATURE EXPERIENCES ===== */}
      <div data-m="pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 32px" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.3em", color: "#C9A24A", textTransform: "uppercase", marginBottom: 18 }}>Signature Experiences · Trải nghiệm đặc trưng</div>
        <h2 style={{ fontFamily: DISPLAY, fontSize: 44, fontWeight: 500, margin: "0 0 10px", maxWidth: 600, lineHeight: 1.12, color: "#FBF8F4" }}>Cuisines as case studies, the studio as a stage.</h2>
        <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 19, color: "#C9A24A", marginBottom: 48 }}>Ẩm thực là tình huống nghiên cứu, studio là sân khấu.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
          {experiences.map((e) => (
            <div key={e.title} style={{ background: "#042726", border: "1px solid rgba(168,136,78,0.45)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ height: 180, background: "repeating-linear-gradient(45deg, #0A302E 0px, #0A302E 14px, #0D3533 14px, #0D3533 28px)", display: "flex", alignItems: "flex-end", padding: 14 }}>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: "#96A8A1" }}>[ {e.img} ]</span>
              </div>
              <div style={{ padding: "24px 24px 30px" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "#C9A24A", marginBottom: 10 }}>{e.tag}</div>
                <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 600, margin: "0 0 10px", color: "#FBF8F4" }}>{e.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "#D5DFDA", margin: 0 }}>{e.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== ASSESSMENT ===== */}
      <div id="assessment" style={{ background: "#042726", borderTop: "1px solid rgba(168,136,78,0.4)" }}>
        <div data-m="grid2" style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 32px", display: "grid", gridTemplateColumns: "minmax(260px,380px) 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.3em", color: "#C9A24A", textTransform: "uppercase", marginBottom: 18 }}>Assessment · Đánh giá</div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 42, fontWeight: 500, lineHeight: 1.14, margin: "0 0 8px", color: "#FBF8F4" }}>Transparent from day one.</h2>
            <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 19, color: "#C9A24A", marginBottom: 20 }}>Minh bạch từ buổi đầu tiên.</div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#D5DFDA", margin: "0 0 14px" }}>Vietnamese 10-point scale. Your grade is composed of three parts — attendance, coursework, and the final assessment — computed live in the course portal.<br /><span style={{ fontSize: 13, color: "#96A8A1" }}>Thang điểm 10, gồm ba thành phần: chuyên cần, quá trình và cuối kỳ — tính tự động trong cổng học tập.</span></p>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "#96A8A1", margin: 0 }}>Missing more than 20% of sessions bars you from the final exam (cấm thi). Pass threshold: 4.0. — Vắng quá 20% số buổi sẽ bị cấm thi. Điểm đạt: 4.0.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {gradeBars.map((g) => (
              <div key={g.label}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, color: "#FBF8F4" }}>{g.label}</span>
                  <span style={{ fontFamily: DISPLAY, fontSize: 28, color: "#C9A24A" }}>{g.pct}</span>
                </div>
                <div style={{ height: 10, background: "#102B2A", border: "1px solid rgba(168,136,78,0.45)", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: g.fill, width: g.width }} />
                </div>
                <div style={{ fontSize: 12, color: "#96A8A1", marginTop: 6, letterSpacing: "0.04em" }}>{g.vi}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== INSTRUCTORS ===== */}
      <div data-m="pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 32px 80px" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.3em", color: "#C9A24A", textTransform: "uppercase", marginBottom: 40 }}>Instructor Team · Đội ngũ giảng viên</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 40 }}>
          {instructors.map((t) => (
            <div key={t.name} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", flexShrink: 0, background: "repeating-linear-gradient(45deg, #0A302E 0px, #0A302E 8px, #0D3533 8px, #0D3533 16px)", border: "1px solid #A8884E", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 9, color: "#96A8A1" }}>photo</div>
              <div>
                <h3 style={{ fontFamily: DISPLAY, fontSize: 23, fontWeight: 600, margin: "0 0 4px", color: "#FBF8F4" }}>{t.name}</h3>
                <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9A24A", marginBottom: 8 }}>{t.role}</div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "#D5DFDA", margin: 0 }}>{t.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== TESTIMONIALS ===== */}
      <div style={{ background: "#042726", borderTop: "1px solid rgba(168,136,78,0.4)", borderBottom: "1px solid rgba(168,136,78,0.4)" }}>
        <div data-m="pad" style={{ maxWidth: 900, margin: "0 auto", padding: "100px 32px", display: "flex", flexDirection: "column", gap: 64 }}>
          {quotes.map((q, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: DISPLAY, fontSize: "clamp(24px,3.2vw,34px)", fontStyle: "italic", fontWeight: 500, lineHeight: 1.4, color: "#FBF8F4" }}>“{q.text}”</div>
              <div style={{ fontSize: 15, fontStyle: "italic", color: "#96A8A1", marginTop: 12, fontFamily: DISPLAY }}>{q.textVi}</div>
              <div style={{ marginTop: 18, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: "#C9A24A" }}>{q.who}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== FAQ ===== */}
      <div id="faq" data-m="pad" style={{ maxWidth: 820, margin: "0 auto", padding: "100px 32px" }}>
        <h2 style={{ fontFamily: DISPLAY, fontSize: 42, fontWeight: 500, margin: "0 0 6px", color: "#FBF8F4" }}>Questions, answered.</h2>
        <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 19, color: "#C9A24A", marginBottom: 40 }}>Giải đáp thắc mắc.</div>
        <Faq />
      </div>

      {/* ===== FINAL CTA + ENROLLMENT ===== */}
      <div id="enroll" style={{ background: "#042726", borderTop: "1px solid rgba(168,136,78,0.4)" }}>
        <div data-m="grid2" style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 32px", display: "grid", gridTemplateColumns: "1fr minmax(320px,460px)", gap: 72, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.3em", color: "#C9A24A", textTransform: "uppercase", marginBottom: 20 }}>Next Cohort · Fall 2026 — Khóa kế tiếp</div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(36px,4.5vw,56px)", fontWeight: 500, lineHeight: 1.1, margin: "0 0 10px", color: "#FBF8F4" }}>Take your seat at the table.</h2>
            <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 21, color: "#C9A24A", marginBottom: 24 }}>Giữ chỗ của bạn tại bàn ăn.</div>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#D5DFDA", maxWidth: 460 }}>Submit your details and the teaching team will review your application. Approved students receive an invitation to the course portal.<br /><span style={{ fontSize: 13.5, color: "#96A8A1" }}>Gửi thông tin đăng ký — đội ngũ giảng viên sẽ xét duyệt và gửi lời mời vào cổng học tập qua email.</span></p>
            <div style={{ marginTop: 36, borderTop: "1px solid rgba(168,136,78,0.45)", paddingTop: 20, fontSize: 13, color: "#96A8A1", letterSpacing: "0.06em" }}>15 sessions · Tue &amp; Fri · Campus Studio Kitchen B2 — 15 buổi · Thứ 3 &amp; Thứ 6</div>
          </div>
          <div style={{ background: "#102B2A", border: "1px solid #A8884E", borderRadius: 12, color: "#FBF8F4", padding: 40 }}>
            <EnrollForm />
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
