-- =============================================================
--  F-NU-10 — Ma trận điểm danh + điểm (thang 100)
--  Thêm 2 cột điểm nhập tay cho bảng điểm mới (Attendance tự tính).
--  Chạy trong Supabase → SQL Editor.
-- =============================================================

-- Chuyên cần & Phù hợp chuyên ngành: điểm nhập tay thang 0–100
alter table public.grades add column if not exists diligence numeric(5,2);  -- Chuyên cần /100
alter table public.grades add column if not exists major_fit numeric(5,2);  -- Phù hợp chuyên ngành /100
