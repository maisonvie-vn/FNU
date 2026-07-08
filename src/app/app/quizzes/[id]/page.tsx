import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  updateQuiz, togglePublish, deleteQuiz,
  addQuestion, deleteQuestion,
  addOption, toggleCorrect, deleteOption,
} from "../actions";
import ConfirmSubmit from "@/app/_components/ConfirmSubmit";

export const dynamic = "force-dynamic";

type Quiz = {
  id: string; title: string; title_en: string | null; description: string | null;
  cohort: string | null; pass_score: number; time_limit_min: number | null; is_published: boolean;
};
type Opt = { id: string; label: string; label_en: string | null; is_correct: boolean; ord: number };
type Q = { id: string; prompt: string; prompt_en: string | null; qtype: string; points: number; ord: number; options: Opt[] };

export default async function QuizEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, title, title_en, description, cohort, pass_score, time_limit_min, is_published")
    .eq("id", id)
    .single();
  if (!quiz) notFound();
  const qz = quiz as Quiz;

  const { data: qData } = await supabase
    .from("quiz_questions")
    .select("id, prompt, prompt_en, qtype, points, ord, quiz_options(id, label, label_en, is_correct, ord)")
    .eq("quiz_id", id)
    .order("ord");
  const questions = ((qData || []) as unknown as (Omit<Q, "options"> & { quiz_options: Opt[] })[])
    .map((q) => ({ ...q, options: (q.quiz_options || []).sort((a, b) => a.ord - b.ord) }));

  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("id, score, max_points, passed, submitted_at, students(full_name, student_code)")
    .eq("quiz_id", id)
    .order("submitted_at", { ascending: false });
  const rows = (attempts || []) as unknown as {
    id: string; score: number; max_points: number; passed: boolean; submitted_at: string;
    students: { full_name: string; student_code: string | null } | null;
  }[];

  const QTYPE: Record<string, string> = { single: "1 đáp án · Single", multi: "Nhiều đáp án · Multi", truefalse: "Đúng/Sai · True–False" };
  const totalPts = questions.reduce((s, q) => s + Number(q.points), 0);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-5">
        <Link href="/app/quizzes" className="text-sm text-sage transition hover:text-gold">← Danh sách đề</Link>
        <div className="flex flex-wrap gap-2">
          <form action={togglePublish}>
            <input type="hidden" name="id" value={qz.id} />
            <input type="hidden" name="publish" value={qz.is_published ? "0" : "1"} />
            <button disabled={questions.length === 0 && !qz.is_published} className="rounded-lg border border-gold/40 px-4 py-2 text-sm text-gold transition hover:bg-gold hover:text-ink disabled:opacity-40">
              {qz.is_published ? "Gỡ phát hành" : "Phát hành · Publish"}
            </button>
          </form>
          <form action={deleteQuiz}>
            <input type="hidden" name="id" value={qz.id} />
            <ConfirmSubmit message={`Xóa vĩnh viễn đề "${qz.title}"?\n\nToàn bộ câu hỏi, đáp án và kết quả làm bài của đề này sẽ bị xóa. Không khôi phục được.`} className="rounded-lg border border-danger/40 px-4 py-2 text-sm text-danger transition hover:bg-danger/10">Xóa đề</ConfirmSubmit>
          </form>
        </div>
      </header>

      {/* Thông tin đề */}
      <form action={updateQuiz} className="mb-8 space-y-3 rounded-xl border border-gold/20 bg-ink-deep/40 p-4">
        <input type="hidden" name="id" value={qz.id} />
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-sage">Tên đề (VI)</label>
            <input name="title" defaultValue={qz.title} required className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-sage">Title (EN)</label>
            <input name="title_en" defaultValue={qz.title_en || ""} className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-sage">Mô tả / Hướng dẫn · Description</label>
          <textarea name="description" defaultValue={qz.description || ""} rows={2} className="w-full rounded-lg border border-gold/25 bg-ink px-3 py-2 text-cream" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-sage">Khóa · Cohort</label>
            <input name="cohort" defaultValue={qz.cohort || ""} placeholder="Mọi khóa" className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream placeholder:text-sage/50" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-sage">Điểm đạt (/10)</label>
            <input name="pass_score" type="number" step="0.5" min="0" max="10" defaultValue={qz.pass_score} className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-sage">Giới hạn (phút)</label>
            <input name="time_limit_min" type="number" min="0" defaultValue={qz.time_limit_min || ""} placeholder="Không" className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream placeholder:text-sage/50" />
          </div>
        </div>
        <button className="h-10 rounded-lg border border-gold/40 px-5 text-sm text-gold transition hover:bg-gold hover:text-ink">Lưu thông tin đề</button>
      </form>

      {/* Câu hỏi */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-2xl text-cream">Câu hỏi ({questions.length})</h2>
        <span className="text-xs text-sage">Tổng điểm trọng số: {totalPts}</span>
      </div>

      <ol className="space-y-5">
        {questions.map((q, i) => (
          <li key={q.id} className="rounded-xl border border-gold/15 bg-ink-deep/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-cream"><span className="mr-1 font-semibold text-gold">{i + 1}.</span>{q.prompt}</div>
                {q.prompt_en && <div className="mt-0.5 text-sm italic text-sage">{q.prompt_en}</div>}
                <div className="mt-1 text-[11px] text-sage">{QTYPE[q.qtype] || q.qtype} · {q.points} điểm</div>
              </div>
              <form action={deleteQuestion}>
                <input type="hidden" name="id" value={q.id} />
                <input type="hidden" name="quiz_id" value={qz.id} />
                <ConfirmSubmit message="Xóa câu hỏi này (kèm các đáp án)?" className="shrink-0 rounded-lg border border-danger/30 px-2 py-1 text-xs text-danger transition hover:bg-danger/10">Xóa</ConfirmSubmit>
              </form>
            </div>

            {/* Đáp án */}
            <ul className="mt-3 space-y-1.5">
              {q.options.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-2 rounded-lg border border-gold/10 bg-ink/40 px-3 py-2">
                  <span className={`text-sm ${o.is_correct ? "text-success" : "text-mist"}`}>
                    {o.is_correct && "✓ "}{o.label}{o.label_en ? <span className="text-sage"> · {o.label_en}</span> : null}
                  </span>
                  <div className="flex shrink-0 gap-1">
                    <form action={toggleCorrect}>
                      <input type="hidden" name="id" value={o.id} />
                      <input type="hidden" name="quiz_id" value={qz.id} />
                      <input type="hidden" name="val" value={o.is_correct ? "0" : "1"} />
                      <button className={`rounded-md border px-2 py-1 text-[11px] transition ${o.is_correct ? "border-success/50 text-success" : "border-gold/25 text-sage hover:border-gold hover:text-gold"}`}>
                        {o.is_correct ? "Đáp án đúng" : "Đặt đúng"}
                      </button>
                    </form>
                    <form action={deleteOption}>
                      <input type="hidden" name="id" value={o.id} />
                      <input type="hidden" name="quiz_id" value={qz.id} />
                      <button aria-label="Xóa đáp án" title="Xóa đáp án" className="rounded-md border border-danger/20 px-2 py-1 text-[11px] text-danger/80 transition hover:bg-danger/10">✕</button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>

            {/* Thêm đáp án */}
            <form action={addOption} className="mt-2 flex flex-wrap items-center gap-2">
              <input type="hidden" name="question_id" value={q.id} />
              <input type="hidden" name="quiz_id" value={qz.id} />
              <input name="label" required placeholder="Đáp án (VI)" className="h-9 flex-1 rounded-lg border border-gold/20 bg-ink px-3 text-sm text-cream placeholder:text-sage/50" />
              <input name="label_en" placeholder="Answer (EN)" className="h-9 flex-1 rounded-lg border border-gold/20 bg-ink px-3 text-sm text-cream placeholder:text-sage/50" />
              <label className="flex items-center gap-1 text-xs text-sage"><input type="checkbox" name="is_correct" /> đúng</label>
              <button className="h-9 rounded-lg border border-gold/30 px-3 text-xs text-gold transition hover:bg-gold hover:text-ink">+ Đáp án</button>
            </form>
          </li>
        ))}
      </ol>

      {/* Thêm câu hỏi */}
      <form action={addQuestion} className="mt-6 space-y-3 rounded-xl border border-dashed border-gold/30 bg-ink-deep/20 p-4">
        <input type="hidden" name="quiz_id" value={qz.id} />
        <h3 className="font-display text-xl text-cream">+ Thêm câu hỏi</h3>
        <input name="prompt" required placeholder="Nội dung câu hỏi (VI) *" className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream placeholder:text-sage/50" />
        <input name="prompt_en" placeholder="Question (EN)" className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream placeholder:text-sage/50" />
        <div className="grid gap-3 sm:grid-cols-2">
          <select name="qtype" className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream">
            <option value="single">1 đáp án đúng · Single choice</option>
            <option value="multi">Nhiều đáp án đúng · Multiple</option>
            <option value="truefalse">Đúng / Sai · True–False</option>
          </select>
          <input name="points" type="number" step="0.5" min="0.5" defaultValue={1} placeholder="Điểm trọng số" className="h-11 w-full rounded-lg border border-gold/25 bg-ink px-3 text-cream" />
        </div>
        <button className="h-10 rounded-lg bg-gold px-5 font-semibold text-ink transition hover:bg-gold-soft">Thêm câu hỏi · Add question</button>
      </form>

      {/* Kết quả */}
      <section className="mt-10">
        <h2 className="mb-3 font-display text-2xl text-cream">Kết quả làm bài ({rows.length})</h2>
        <div className="overflow-x-auto rounded-xl border border-gold/15">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-gold/15 text-left text-xs text-sage">
                <th className="px-4 py-2 font-medium">Sinh viên</th>
                <th className="px-4 py-2 font-medium">Điểm /10</th>
                <th className="px-4 py-2 font-medium">Kết quả</th>
                <th className="px-4 py-2 font-medium">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-gold/10">
                  <td className="px-4 py-2 text-cream">{r.students?.full_name || "—"} <span className="text-xs text-sage">{r.students?.student_code || ""}</span></td>
                  <td className="px-4 py-2 text-mist">{r.score}</td>
                  <td className="px-4 py-2">{r.passed ? <span className="text-success">Đạt</span> : <span className="text-danger">Chưa đạt</span>}</td>
                  <td className="px-4 py-2 text-xs text-sage">{new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(r.submitted_at))}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-sage">Chưa có lượt làm bài nào.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
