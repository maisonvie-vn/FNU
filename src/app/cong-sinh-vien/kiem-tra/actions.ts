"use server";

import { createAdminClient } from "@/lib/supabase/admin";

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

export type TakingOption = { id: string; label: string; label_en: string | null };
export type TakingQuestion = { id: string; prompt: string; prompt_en: string | null; qtype: string; points: number; options: TakingOption[] };
export type TakingQuiz = {
  id: string; title: string; title_en: string | null; description: string | null;
  pass_score: number; time_limit_min: number | null; questions: TakingQuestion[];
};
export type LookupResult = {
  error?: string;
  student?: { id: string; full_name: string; student_code: string | null };
  quizzes?: TakingQuiz[];
};

// Bước 1: xác thực SV bằng mã + họ tên, trả về các đề đang phát hành (KHÔNG kèm đáp án đúng)
export async function findStudentQuizzes(_prev: LookupResult, formData: FormData): Promise<LookupResult> {
  const code = String(formData.get("student_code") || "").trim();
  const name = String(formData.get("full_name") || "").trim();
  if (!code || !name) return { error: "Vui lòng nhập Mã sinh viên và Họ tên." };

  const admin = createAdminClient();
  const { data: student } = await admin.from("students").select("id, student_code, full_name").eq("student_code", code).single();
  if (!student || norm(student.full_name) !== norm(name)) {
    return { error: "Không tìm thấy. Kiểm tra lại Mã sinh viên và Họ tên." };
  }

  const { data: enr } = await admin
    .from("enrollments").select("cohort, status").eq("student_id", student.id)
    .order("created_at", { ascending: false }).limit(1).single();
  if (!enr || enr.status === "withdrawn") {
    return { error: "Hồ sơ của bạn hiện không còn hoạt động. Vui lòng liên hệ giảng viên." };
  }

  const { data: quizzes } = await admin
    .from("quizzes")
    .select("id, title, title_en, description, cohort, pass_score, time_limit_min, quiz_questions(id, prompt, prompt_en, qtype, points, ord, quiz_options(id, label, label_en, ord))")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const list: TakingQuiz[] = ((quizzes || []) as unknown as (TakingQuiz & { cohort: string | null; quiz_questions: (TakingQuestion & { ord: number; quiz_options: (TakingOption & { ord: number })[] })[] })[])
    .filter((q) => !q.cohort || q.cohort === enr.cohort)
    .map((q) => ({
      id: q.id, title: q.title, title_en: q.title_en, description: q.description,
      pass_score: q.pass_score, time_limit_min: q.time_limit_min,
      questions: (q.quiz_questions || [])
        .sort((a, b) => a.ord - b.ord)
        .map((qq) => ({
          id: qq.id, prompt: qq.prompt, prompt_en: qq.prompt_en, qtype: qq.qtype, points: qq.points,
          options: (qq.quiz_options || []).sort((a, b) => a.ord - b.ord).map((o) => ({ id: o.id, label: o.label, label_en: o.label_en })),
        })),
    }))
    .filter((q) => q.questions.length > 0);

  return { student: { id: student.id, full_name: student.full_name, student_code: student.student_code }, quizzes: list };
}

export type SubmitResult = {
  error?: string;
  done?: boolean;
  score?: number; maxPoints?: number; correctCount?: number; totalCount?: number; passed?: boolean; passScore?: number;
};

// Bước 2: nộp bài — chấm điểm hoàn toàn ở server (đáp án đúng không bao giờ ra client)
export async function submitQuiz(_prev: SubmitResult, formData: FormData): Promise<SubmitResult> {
  const studentId = String(formData.get("student_id") || "");
  const quizId = String(formData.get("quiz_id") || "");
  let answers: Record<string, string[]> = {};
  try { answers = JSON.parse(String(formData.get("answers") || "{}")); } catch { answers = {}; }
  if (!studentId || !quizId) return { error: "Thiếu thông tin bài làm." };

  const admin = createAdminClient();
  const { data: quiz } = await admin.from("quizzes").select("id, pass_score").eq("id", quizId).eq("is_published", true).single();
  if (!quiz) return { error: "Đề thi không tồn tại hoặc đã gỡ." };

  const { data: qData } = await admin
    .from("quiz_questions")
    .select("id, points, qtype, quiz_options(id, is_correct)")
    .eq("quiz_id", quizId);
  const questions = (qData || []) as unknown as { id: string; points: number; qtype: string; quiz_options: { id: string; is_correct: boolean }[] }[];

  let earned = 0, totalPts = 0, correctCount = 0;
  for (const q of questions) {
    totalPts += Number(q.points);
    const correct = new Set((q.quiz_options || []).filter((o) => o.is_correct).map((o) => o.id));
    const chosen = new Set((answers[q.id] || []));
    // Đúng khi tập chọn TRÙNG KHỚP tập đáp án đúng (không thừa, không thiếu)
    const ok = correct.size > 0 && correct.size === chosen.size && [...correct].every((id) => chosen.has(id));
    if (ok) { earned += Number(q.points); correctCount++; }
  }

  const score = totalPts > 0 ? Math.round((earned / totalPts) * 10 * 100) / 100 : 0;
  const passed = score >= Number(quiz.pass_score);

  await admin.from("quiz_attempts").insert({
    quiz_id: quizId, student_id: studentId,
    score, max_points: totalPts, correct_count: correctCount, total_count: questions.length,
    passed, answers,
  });

  return { done: true, score, maxPoints: totalPts, correctCount, totalCount: questions.length, passed, passScore: Number(quiz.pass_score) };
}
