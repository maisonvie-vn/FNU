-- =============================================================
--  F-NU-10 — Bảng điểm & Điểm danh (Phần 2)
--  Chạy trong Supabase → SQL Editor
-- =============================================================

-- ---------- sessions: các buổi học ----------
create table if not exists public.sessions (
  id         uuid primary key default gen_random_uuid(),
  no         int not null,                 -- buổi số 1..15
  title      text,
  date       date,
  created_at timestamptz not null default now(),
  unique (no)
);

-- ---------- attendance: điểm danh (mỗi SV mỗi buổi) ----------
create table if not exists public.attendance (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  session_id uuid not null references public.sessions(id) on delete cascade,
  status     text not null default 'present', -- present | late | absent
  created_at timestamptz not null default now(),
  unique (student_id, session_id)
);

-- ---------- grades: điểm quá trình & cuối kỳ (điểm chuyên cần tính tự động) ----------
create table if not exists public.grades (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(id) on delete cascade,
  coursework  numeric(4,2),   -- điểm quá trình /10
  final       numeric(4,2),   -- điểm cuối kỳ /10
  updated_at  timestamptz not null default now(),
  unique (student_id)
);

-- RLS: nhân sự (GV/trợ giảng) toàn quyền
alter table public.sessions   enable row level security;
alter table public.attendance enable row level security;
alter table public.grades     enable row level security;

do $$
declare t text;
begin
  foreach t in array array['sessions','attendance','grades']
  loop
    execute format('drop policy if exists staff_all on public.%I;', t);
    execute format(
      'create policy staff_all on public.%I for all using (public.is_staff()) with check (public.is_staff());',
      t
    );
  end loop;
end $$;

-- ---------- Tạo sẵn 15 buổi học nếu chưa có ----------
insert into public.sessions (no, title)
select g.no, 'Buổi ' || g.no
from generate_series(1, 15) as g(no)
on conflict (no) do nothing;
