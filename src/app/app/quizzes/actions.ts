"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireStaff() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Chưa đăng nhập");
  return { supabase, user };
}

const num = (v: FormDataEntryValue | null, d: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

// ---- Đề thi ----
export async function createQuiz(formData: FormData) {
  const { supabase, user } = await requireStaff();
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  const { data } = await supabase
    .from("quizzes")
    .insert({
      title,
      title_en: String(formData.get("title_en") || "").trim() || null,
      cohort: String(formData.get("cohort") || "").trim() || null,
      created_by: user.id,
    })
    .select("id")
    .single();
  revalidatePath("/app/quizzes");
  if (data?.id) redirect(`/app/quizzes/${data.id}`);
}

export async function updateQuiz(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase
    .from("quizzes")
    .update({
      title: String(formData.get("title") || "").trim(),
      title_en: String(formData.get("title_en") || "").trim() || null,
      description: String(formData.get("description") || "").trim() || null,
      cohort: String(formData.get("cohort") || "").trim() || null,
      pass_score: num(formData.get("pass_score"), 5),
      time_limit_min: formData.get("time_limit_min") ? num(formData.get("time_limit_min"), 0) || null : null,
    })
    .eq("id", id);
  revalidatePath(`/app/quizzes/${id}`);
}

export async function togglePublish(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = String(formData.get("id") || "");
  const publish = String(formData.get("publish") || "") === "1";
  if (!id) return;
  await supabase.from("quizzes").update({ is_published: publish }).eq("id", id);
  revalidatePath("/app/quizzes");
  revalidatePath(`/app/quizzes/${id}`);
}

export async function deleteQuiz(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("quizzes").delete().eq("id", id);
  revalidatePath("/app/quizzes");
  redirect("/app/quizzes");
}

// ---- Câu hỏi ----
export async function addQuestion(formData: FormData) {
  const { supabase } = await requireStaff();
  const quizId = String(formData.get("quiz_id") || "");
  const prompt = String(formData.get("prompt") || "").trim();
  if (!quizId || !prompt) return;
  const { count } = await supabase.from("quiz_questions").select("*", { count: "exact", head: true }).eq("quiz_id", quizId);
  const { data: q } = await supabase
    .from("quiz_questions")
    .insert({
      quiz_id: quizId,
      prompt,
      prompt_en: String(formData.get("prompt_en") || "").trim() || null,
      qtype: String(formData.get("qtype") || "single"),
      points: num(formData.get("points"), 1),
      ord: count || 0,
    })
    .select("id")
    .single();
  // Nếu là đúng/sai thì tạo sẵn 2 đáp án
  if (q?.id && String(formData.get("qtype")) === "truefalse") {
    await supabase.from("quiz_options").insert([
      { question_id: q.id, ord: 0, label: "Đúng", label_en: "True", is_correct: false },
      { question_id: q.id, ord: 1, label: "Sai", label_en: "False", is_correct: false },
    ]);
  }
  revalidatePath(`/app/quizzes/${quizId}`);
}

export async function deleteQuestion(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = String(formData.get("id") || "");
  const quizId = String(formData.get("quiz_id") || "");
  if (!id) return;
  await supabase.from("quiz_questions").delete().eq("id", id);
  revalidatePath(`/app/quizzes/${quizId}`);
}

// ---- Đáp án ----
export async function addOption(formData: FormData) {
  const { supabase } = await requireStaff();
  const questionId = String(formData.get("question_id") || "");
  const quizId = String(formData.get("quiz_id") || "");
  const label = String(formData.get("label") || "").trim();
  if (!questionId || !label) return;
  const { count } = await supabase.from("quiz_options").select("*", { count: "exact", head: true }).eq("question_id", questionId);
  await supabase.from("quiz_options").insert({
    question_id: questionId,
    label,
    label_en: String(formData.get("label_en") || "").trim() || null,
    is_correct: String(formData.get("is_correct") || "") === "on",
    ord: count || 0,
  });
  revalidatePath(`/app/quizzes/${quizId}`);
}

export async function toggleCorrect(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = String(formData.get("id") || "");
  const quizId = String(formData.get("quiz_id") || "");
  const val = String(formData.get("val") || "") === "1";
  if (!id) return;
  await supabase.from("quiz_options").update({ is_correct: val }).eq("id", id);
  revalidatePath(`/app/quizzes/${quizId}`);
}

export async function deleteOption(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = String(formData.get("id") || "");
  const quizId = String(formData.get("quiz_id") || "");
  if (!id) return;
  await supabase.from("quiz_options").delete().eq("id", id);
  revalidatePath(`/app/quizzes/${quizId}`);
}
