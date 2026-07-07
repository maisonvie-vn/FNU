import RegisterForm from "./register-form";

export const metadata = {
  title: "Đăng ký · Food Culture & Aesthetic",
  description:
    "Đăng ký học phần Food Culture & Aesthetic — Trường ĐH Ngoại thương, Đào tạo Quốc tế.",
};

const HIGHLIGHTS = [
  {
    k: "Học phần",
    v: "Food Culture & Aesthetic",
    d: "Văn hoá ẩm thực & thẩm mỹ — F-NU-10",
  },
  { k: "Đơn vị", v: "ĐH Ngoại thương", d: "Chương trình Đào tạo Quốc tế" },
  { k: "Hình thức", v: "Xét hồ sơ", d: "Phỏng vấn & định hướng đầu vào" },
];

export default function DangKyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14">
      {/* Hero */}
      <header className="mb-10 text-center">
        <p className="eyebrow">Trường ĐH Ngoại thương · Đào tạo Quốc tế</p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-gold">
          Food Culture
          <br />
          <span className="italic">&amp; Aesthetic</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-mist">
          Khám phá chiều sâu văn hoá ẩm thực và ngôn ngữ thẩm mỹ — một học phần
          dành cho những người muốn hiểu, cảm và kể câu chuyện của ẩm thực.
        </p>
      </header>

      {/* Điểm nổi bật */}
      <section className="mb-10 grid gap-4 sm:grid-cols-3">
        {HIGHLIGHTS.map((h) => (
          <div
            key={h.k}
            className="rounded-xl border border-gold/20 bg-ink-deep/40 p-4"
          >
            <p className="eyebrow">{h.k}</p>
            <p className="mt-1 font-display text-xl text-cream">{h.v}</p>
            <p className="mt-0.5 text-sm text-sage">{h.d}</p>
          </div>
        ))}
      </section>

      {/* Form đăng ký */}
      <section>
        <h2 className="mb-4 font-display text-2xl text-cream">
          Đăng ký ghi danh
        </h2>
        <RegisterForm />
      </section>

      <footer className="mt-10 text-center text-xs text-sage">
        Đã có tài khoản giảng viên?{" "}
        <a href="/login" className="text-gold hover:underline">
          Đăng nhập quản trị
        </a>
      </footer>
    </main>
  );
}
