import SiteNav from "../../_components/SiteNav";
import SiteFooter from "../../_components/SiteFooter";
import QuizTaker from "./QuizTaker";

export const metadata = {
  title: "Bài kiểm tra · Quizzes · F&B-FCA",
  description: "Làm bài kiểm tra trực tuyến và xem điểm ngay — học phần F&B-FCA. Online quizzes with instant grading.",
};

const DISPLAY = "var(--font-display)";

export default function StudentQuizPage() {
  return (
    <div style={{ background: "#102B2A", color: "#FBF8F4", fontFamily: "var(--font-body)", minHeight: "100vh" }}>
      <SiteNav />
      <header style={{ background: "#042726", borderBottom: "1px solid rgba(168,136,78,0.4)" }}>
        <div data-m="pad" style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px 48px" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.3em", color: "#C9A24A", textTransform: "uppercase", marginBottom: 18 }}>Bài kiểm tra · Quizzes</p>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(32px,5vw,52px)", lineHeight: 1.1, margin: 0 }}>
            Làm bài &amp; xem điểm ngay
          </h1>
          <p style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 20, color: "#C9A24A", marginTop: 10 }}>
            Take a quiz, get your score instantly
          </p>
        </div>
      </header>
      <main data-m="pad" style={{ maxWidth: 720, margin: "0 auto", padding: "40px 32px 80px" }}>
        <QuizTaker />
      </main>
      <SiteFooter />
    </div>
  );
}
