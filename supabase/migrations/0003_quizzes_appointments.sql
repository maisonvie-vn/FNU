-- =============================================================
--  F-NU-10 — Ngân hàng đề thi (Quiz) & Lịch hẹn (Phần 3)
--  Chạy trong Supabase → SQL Editor
-- =============================================================

-- ============ NGÂN HÀNG ĐỀ THI / QUIZ ============

-- ---------- quizzes: đề thi / bài kiểm tra ----------
create table if not exists public.quizzes (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,                 -- tiêu đề (tiếng Việt)
  title_en      text,                          -- tiêu đề tiếng Anh
  description   text,                           -- mô tả / hướng dẫn
  cohort        text,                           -- giới hạn theo khóa (null = mọi khóa)
  time_limit_min int,                           -- giới hạn thời gian (phút), null = không giới hạn
  pass_score    numeric(4,2) not null default 5, -- điểm đạt (thang 10)
  is_published  boolean not null default false, -- đã phát hành cho SV làm chưa
  created_by    uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now()
);

-- ---------- quiz_questions: câu hỏi ----------
create table if not exists public.quiz_questions (
  id         uuid primary key default gen_random_uuid(),
  quiz_id    uuid not null references public.quizzes(id) on delete cascade,
  ord        int not null default 0,           -- thứ tự hiển thị
  prompt     text not null,                     -- nội dung câu hỏi (tiếng Việt)
  prompt_en  text,                              -- nội dung tiếng Anh
  qtype      text not null default 'single',    -- single | multi | truefalse
  points     numeric(5,2) not null default 1,   -- điểm của câu (trọng số)
  created_at timestamptz not null default now()
);

-- ---------- quiz_options: đáp án ----------
create table if not exists public.quiz_options (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  ord         int not null default 0,
  label       text not null,                    -- đáp án (tiếng Việt)
  label_en    text,                             -- đáp án tiếng Anh
  is_correct  boolean not null default false
);

-- ---------- quiz_attempts: lượt làm bài của SV ----------
create table if not exists public.quiz_attempts (
  id           uuid primary key default gen_random_uuid(),
  quiz_id      uuid not null references public.quizzes(id) on delete cascade,
  student_id   uuid not null references public.students(id) on delete cascade,
  score        numeric(5,2),                    -- điểm đạt được (thang 10)
  max_points   numeric(6,2),                    -- tổng điểm tối đa (tổng points câu)
  correct_count int,
  total_count  int,
  passed       boolean,
  answers      jsonb,                           -- { question_id: [option_id, ...] }
  submitted_at timestamptz not null default now()
);

create index if not exists quiz_questions_quiz_idx on public.quiz_questions(quiz_id);
create index if not exists quiz_options_question_idx on public.quiz_options(question_id);
create index if not exists quiz_attempts_quiz_idx on public.quiz_attempts(quiz_id);
create index if not exists quiz_attempts_student_idx on public.quiz_attempts(student_id);

-- ============ LỊCH HẸN — bổ sung thông tin người đặt ============
-- appointments/availability_slots đã có từ 0001; thêm cột thông tin khách đặt lịch.
alter table public.appointments add column if not exists guest_name  text;
alter table public.appointments add column if not exists guest_email text;
alter table public.appointments add column if not exists guest_phone text;
alter table public.appointments add column if not exists topic       text;
alter table public.appointments add column if not exists location    text;
-- ghi chú địa điểm cho khung giờ (Online / phòng học)
alter table public.availability_slots add column if not exists location text;

-- ============ Row Level Security ============
alter table public.quizzes        enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options   enable row level security;
alter table public.quiz_attempts  enable row level security;

-- Nhân sự (GV/trợ giảng) toàn quyền. Sinh viên thao tác qua server action dùng
-- service-role (bỏ qua RLS), nên chỉ cần policy cho staff.
do $$
declare t text;
begin
  foreach t in array array['quizzes','quiz_questions','quiz_options','quiz_attempts']
  loop
    execute format('drop policy if exists staff_all on public.%I;', t);
    execute format(
      'create policy staff_all on public.%I for all using (public.is_staff()) with check (public.is_staff());',
      t
    );
  end loop;
end $$;
