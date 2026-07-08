-- =============================================================
--  F-NU-10 — Vai trò GIÁM SÁT (monitor)
--  Giám sát: chỉ xem Học viên + Điểm danh, được điểm danh & sửa, KHÔNG xóa.
--  Chạy trong Supabase → SQL Editor. CHẠY BƯỚC 1 TRƯỚC (commit), rồi mới BƯỚC 2.
-- =============================================================

-- ---- BƯỚC 1: thêm giá trị enum (phải commit trước khi dùng) ----
alter type public.user_role add value if not exists 'monitor';

-- ---- BƯỚC 2 (chạy sau khi bước 1 đã xong) ----
-- Cho monitor được coi là "staff" để RLS cho phép đọc/ghi students & attendance.
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('instructor', 'assistant', 'monitor')
  );
$$;

-- Gán vai trò monitor cho tài khoản giám sát.
update public.profiles set role = 'monitor' where username = 'giamsat';
