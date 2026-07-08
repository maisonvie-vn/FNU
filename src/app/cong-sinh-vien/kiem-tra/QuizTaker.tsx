"use client";

import { useActionState, useState } from "react";
import { findStudentQuizzes, submitQuiz, type LookupResult, type SubmitResult, type TakingQuiz } from "./actions";

const inputCls = "h-12 w-full rounded-lg border border-gold/30 bg-ink px-4 text-cream placeholder:text-sage/50";

export default function QuizTaker() {
  const [lookup, lookupAction, lookupPending] = useActionState<LookupResult, FormData>(findStudentQuizzes, {});
  const [submit, submitAction, submitPending] = useActionState<SubmitResult, FormData>(submitQuiz, {});
  const [active, setActive] = useState<TakingQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  function pick(quiz: TakingQuiz) {
    setActive(quiz);
    setAnswers({});
  }
  function setSingle(qid: string, oid: string) {
    setAnswers((a) => ({ ...a, [qid]: [oid] }));
  }
  function toggleMulti(qid: string, oid: string) {
    setAnswers((a) => {
      const cur = new Set(a[qid] || []);
      cur.has(oid) ? cur.delete(oid) : cur.add(oid);
      return { ...a, [qid]: [...cur] };
    });
  }

  // ----- Kết quả -----
  if (submit.done) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-ink-deep/50 p-6 text-center sm:p-8">
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${submit.passed ? "bg-success/20 text-success" : "bg-danger/20 text-danger"}`}>
          {submit.passed ? "✓" : "!"}
        </div>
        <h2 className="font-display text-3xl text-cream">{submit.score}<span className="text-lg text-sage">/10</span></h2>
        <p className={`mt-1 font-medium ${submit.passed ? "text-success" : "text-danger"}`}>
          {submit.passed ? "Đạt · Passed" : "Chưa đạt · Not passed"}
        </p>
        <p className="mt-3 text-sm text-sage">
          Đúng {submit.correctCount}/{submit.totalCount} câu · điểm đạt yêu cầu {submit.passScore}/10
        </p>
        <button onClick={() => { setActive(null); location.reload(); }} className="mt-6 rounded-lg border border-gold/30 px-6 py-3 text-sm text-gold transition hover:bg-gold hover:text-ink">
          ← Về danh sách đề
        </button>
      </div>
    );
  }

  // ----- Làm bài -----
  if (active && lookup.student) {
    return (
      <div>
        <button onClick={() => setActive(null)} className="mb-4 text-sm text-sage transition hover:text-gold">← Chọn đề khác</button>
        <h2 className="font-display text-2xl text-cream">{active.title}</h2>
        {active.title_en && <p className="text-sm italic text-sage">{active.title_en}</p>}
        {active.description && <p className="mt-2 text-sm text-mist">{active.description}</p>}
        {active.time_limit_min && <p className="mt-1 text-xs text-gold">Gợi ý thời gian: {active.time_limit_min} phút</p>}

        <ol className="mt-6 space-y-5">
          {active.questions.map((q, i) => {
            const multi = q.qtype === "multi";
            return (
              <li key={q.id} className="rounded-xl border border-gold/15 bg-ink-deep/30 p-4">
                <div className="text-cream"><span className="mr-1 font-semibold text-gold">{i + 1}.</span>{q.prompt}</div>
                {q.prompt_en && <div className="mt-0.5 text-sm italic text-sage">{q.prompt_en}</div>}
                {multi && <div className="mt-1 text-[11px] text-gold">Chọn nhiều đáp án · Select all that apply</div>}
                <div className="mt-3 space-y-2">
                  {q.options.map((o) => {
                    const checked = (answers[q.id] || []).includes(o.id);
                    return (
                      <label key={o.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${checked ? "border-gold bg-gold/10 text-cream" : "border-gold/20 text-mist hover:border-gold/50"}`}>
                        <input
                          type={multi ? "checkbox" : "radio"}
                          name={`q_${q.id}`}
                          checked={checked}
                          onChange={() => (multi ? toggleMulti(q.id, o.id) : setSingle(q.id, o.id))}
                          className="accent-gold"
                        />
                        <span>{o.label}{o.label_en ? <span className="text-sage"> · {o.label_en}</span> : null}</span>
                      </label>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>

        <form action={submitAction} className="mt-6">
          <input type="hidden" name="student_id" value={lookup.student.id} />
          <input type="hidden" name="quiz_id" value={active.id} />
          <input type="hidden" name="answers" value={JSON.stringify(answers)} />
          {submit.error && <p className="mb-3 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">{submit.error}</p>}
          <button disabled={submitPending} className="h-12 w-full rounded-lg bg-gold text-base font-semibold text-ink transition hover:bg-gold-soft disabled:opacity-50">
            {submitPending ? "Đang chấm điểm…" : "Nộp bài · Submit"}
          </button>
        </form>
      </div>
    );
  }

  // ----- Danh sách đề (sau khi xác thực) -----
  if (lookup.student && lookup.quizzes) {
    return (
      <div>
        <p className="mb-4 text-sm text-mist">Xin chào <b className="text-cream">{lookup.student.full_name}</b>. Chọn một đề để làm:</p>
        {lookup.quizzes.length === 0 ? (
          <p className="rounded-xl border border-gold/15 px-4 py-10 text-center text-sage">Hiện chưa có đề thi nào được phát hành cho bạn.</p>
        ) : (
          <ul className="space-y-3">
            {lookup.quizzes.map((q) => (
              <li key={q.id}>
                <button onClick={() => pick(q)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-gold/20 bg-ink-deep/30 p-4 text-left transition hover:border-gold">
                  <div>
                    <div className="font-medium text-cream">{q.title}</div>
                    <div className="text-xs text-sage">{q.title_en ? `${q.title_en} · ` : ""}{q.questions.length} câu · điểm đạt {q.pass_score}/10</div>
                  </div>
                  <span className="shrink-0 text-gold">Làm bài →</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // ----- Xác thực SV -----
  return (
    <form action={lookupAction} className="space-y-4">
      <p className="text-sm text-sage">Nhập Mã sinh viên và Họ tên để xem các bài kiểm tra. · Enter your student code and full name.</p>
      <div>
        <label className="mb-1 block text-xs text-sage">Mã sinh viên · Student code</label>
        <input name="student_code" required className={inputCls} placeholder="VD: 2505013002" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-sage">Họ và tên · Full name</label>
        <input name="full_name" required className={inputCls} placeholder="VD: Đặng Quỳnh Anh" />
      </div>
      {lookup.error && <p className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">{lookup.error}</p>}
      <button disabled={lookupPending} className="h-12 w-full rounded-lg bg-gold text-base font-semibold text-ink transition hover:bg-gold-soft disabled:opacity-50">
        {lookupPending ? "Đang kiểm tra…" : "Xem bài kiểm tra · Continue"}
      </button>
    </form>
  );
}
