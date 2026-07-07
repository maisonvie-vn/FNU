-- =============================================================
--  F-NU-10 Course CRM — Schema khởi tạo
--  Chạy trong Supabase → SQL Editor (hoặc: supabase db push)
-- =============================================================

-- ---------- Kiểu vai trò ----------
do $$ begin
  create type user_role as enum ('instructor', 'assistant', 'student');
exception when duplicate_object then null; end $$;

-- ---------- profiles: hồ sơ tài khoản (gắn với auth.users) ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text unique not null,
  full_name  text not null,
  role       user_role not null default 'instructor',
  created_at timestamptz not null default now()
);

-- Hàm tiện ích: người dùng hiện tại có phải nhân sự (GV/trợ giảng) không
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('instructor', 'assistant')
  );
$$;

-- ---------- leads: đơn ghi danh từ landing page ----------
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  email      text,
  phone      text,
  cohort     text,
  status     text not null default 'pending', -- pending | approved | rejected
  note       text,
  created_at timestamptz not null default now()
);

-- ---------- students: sinh viên chính thức ----------
create table if not exists public.students (
  id          uuid primary key default gen_random_uuid(),
  student_code text unique,
  full_name   text not null,
  email       text,
  phone       text,
  dob         date,
  created_at  timestamptz not null default now()
);

-- ---------- enrollments: ghi danh vào khóa ----------
create table if not exists public.enrollments (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid references public.students(id) on delete cascade,
  lead_id     uuid references public.leads(id) on delete set null,
  cohort      text not null default 'F-NU-10',
  status      text not null default 'active',
  created_at  timestamptz not null default now()
);

-- ---------- payments: thanh toán học phí (VietQR) ----------
create table if not exists public.payments (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid references public.enrollments(id) on delete cascade,
  amount        integer not null,              -- số tiền (VND)
  transfer_code text unique not null,          -- mã ghi trong nội dung chuyển khoản (Casso đối soát)
  status        text not null default 'pending', -- pending | paid | canceled
  paid_at       timestamptz,
  raw_txn       jsonb,                          -- dữ liệu giao dịch thô từ Casso
  created_at    timestamptz not null default now()
);

-- ---------- availability_slots: khung giờ trống của GV ----------
create table if not exists public.availability_slots (
  id         uuid primary key default gen_random_uuid(),
  staff_id   uuid references public.profiles(id) on delete cascade,
  starts_at  timestamptz not null,
  ends_at    timestamptz not null,
  is_booked  boolean not null default false
);

-- ---------- appointments: lịch hẹn ----------
create table if not exists public.appointments (
  id           uuid primary key default gen_random_uuid(),
  slot_id      uuid references public.availability_slots(id) on delete set null,
  staff_id     uuid references public.profiles(id) on delete set null,
  student_id   uuid references public.students(id) on delete set null,
  lead_id      uuid references public.leads(id) on delete set null,
  kind         text not null default 'interview', -- interview | office_hours | exam
  starts_at    timestamptz not null,
  ends_at      timestamptz not null,
  status       text not null default 'booked',    -- booked | done | canceled
  gcal_event_id text,                             -- id sự kiện Google Calendar
  note         text,
  created_at   timestamptz not null default now()
);

-- =============================================================
--  Row Level Security
-- =============================================================
alter table public.profiles           enable row level security;
alter table public.leads              enable row level security;
alter table public.students           enable row level security;
alter table public.enrollments        enable row level security;
alter table public.payments           enable row level security;
alter table public.availability_slots enable row level security;
alter table public.appointments       enable row level security;

-- profiles: ai đăng nhập cũng đọc được hồ sơ của chính mình; nhân sự đọc tất cả
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select using (id = auth.uid() or public.is_staff());

-- Các bảng nghiệp vụ: nhân sự (GV/trợ giảng) toàn quyền
do $$
declare t text;
begin
  foreach t in array array['leads','students','enrollments','payments','availability_slots','appointments']
  loop
    execute format('drop policy if exists staff_all on public.%I;', t);
    execute format(
      'create policy staff_all on public.%I for all using (public.is_staff()) with check (public.is_staff());',
      t
    );
  end loop;
end $$;
