import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createQuiz, togglePublish } from "./actions";

export const metadata = { title: "Ngân hàng đề thi · F&B-FCA" };
export const dynamic = "force-dynamic";

type Quiz = {
  id: string; title: string; title_en: string | null; cohort: string | null;
  is_published: boolean; pass_score: number;
};

export default async function QuizzesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: quizzesData } = await supabase
    .from("quizzes")
    .select("id, title, title_en, cohort, is_published, pass_score")
    .order("created_at", { ascending: false });
  const quizzes = (quizzesData || []) as Quiz[];

  // Đếm số câu hỏi & lượt làm cho từng đề
  const counts = new Map<string, { q: number; a: number }>();
  await Promise.all(
    quizzes.map(async (qz) => {
      const [{ count: q }, { count: a }] = await Promise.all([
        supabase.from("quiz_questions").select("*", { count: "exact", head: true }).eq("quiz_id", qz.id),
        supabase.from("quiz_attempts").select("*", { count: "exact", head: true }).eq("quiz_id", qz.id),
      ]);
      counts.set(qz.id, { q: q || 0, a: a || 0 });
    }),
  );

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-gold/20 pb-6">
        <div>
          <p className="eyebrow">F&amp;B-FCA</p>
          <h1 className="mt-1 font-display text-3xl text-cream sm:text-4xl">Ngân hàng đề thi</h1>
          <p className="mt-1 text-sm text-sage">Quiz &amp; exam bank · tự động chấm điểm</p>
        </div>
        <Link href="/app" className="h-10 rounded-lg border border-gold/30 px-4 text-sm leading-10 text-mist transition hover:border-gold hover:text-gold">← Giao diện chính</Link>
      </header>

      <form action={createQuiz} className="mb-8 grid gap-3 rounded-xl border border-gold/20 bg-ink-deep/40 p-4 sm:grid-cols-[1fr_1fr_auto]">
        <input name="title" required placeholder="Tên đề thi (VI) *" className="h-11 rounded-lg border border-gold/25 bg-ink px-3 text-cream placeholder:text-sage/50" />
        <input name="title_en" placeholder="Title (EN)" className="h-11 rounded-lg border border-gold/25 bg-ink px-3 text-cream placeholder:text-sage/50" />
        <button className="h-11 rounded-lg bg-gold px-5 font-semibold text-ink transition hover:bg-gold-soft">+ Tạo đề · Create</button>
      </form>

      <ul className="space-y-3">
        {quizzes.map((qz) => {
          const c = counts.get(qz.id) || { q: 0, a: 0 };
          return (
            <li key={qz.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/15 bg-ink-deep/30 p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/app/quizzes/${qz.id}`} className="font-medium text-cream hover:text-gold">{qz.title}</Link>
                  {qz.is_published
                    ? <span className="rounded-full border border-success/40 bg-success/15 px-2 py-0.5 text-[11px] text-success">Đang phát hành</span>
                    : <span className="rounded-full border border-gold/25 px-2 py-0.5 text-[11px] text-sage">Nháp · Draft</span>}
                </div>
                <div className="mt-1 text-xs text-sage">
                  {qz.title_en ? `${qz.title_en} · ` : ""}{c.q} câu hỏi · {c.a} lượt làm{qz.cohort ? ` · khóa ${qz.cohort}` : ""}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/app/quizzes/${qz.id}`} className="rounded-lg border border-gold/30 px-3 py-1.5 text-xs text-gold transition hover:bg-gold hover:text-ink">Sửa · Edit</Link>
                <form action={togglePublish}>
                  <input type="hidden" name="id" value={qz.id} />
                  <input type="hidden" name="publish" value={qz.is_published ? "0" : "1"} />
                  <button
                    disabled={c.q === 0 && !qz.is_published}
                    className="rounded-lg border border-gold/30 px-3 py-1.5 text-xs text-mist transition hover:border-gold hover:text-gold disabled:opacity-40"
                  >
                    {qz.is_published ? "Gỡ · Unpublish" : "Phát hành · Publish"}
                  </button>
                </form>
              </div>
            </li>
          );
        })}
        {quizzes.length === 0 && <li className="rounded-xl border border-gold/15 px-4 py-10 text-center text-sage">Chưa có đề thi nào. Tạo đề đầu tiên ở trên.</li>}
      </ul>
    </main>
  );
}
