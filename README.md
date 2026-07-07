# Food Culture & Aesthetic — Course CRM (F-NU-10)

Hệ thống quản lý học phần cho ĐH Ngoại thương (Đào tạo Quốc tế).
Stack: **Next.js 16 (App Router) + Supabase + Tailwind v4**, deploy trên **Vercel**.

## ✅ Đã có (bước này)
- Backend Supabase + schema cơ sở dữ liệu (`supabase/migrations/0001_init.sql`)
- **Cổng đăng nhập cho giảng viên/hướng dẫn viên bằng username + mật khẩu**
- Bảo vệ route admin (`src/proxy.ts`) + trang Dashboard sau đăng nhập
- Giao diện theo đúng nhận diện thương hiệu (xanh rêu + gold, Cormorant Garamond)

---

## Cài đặt & chạy

### 1. Tạo project Supabase
1. Vào https://supabase.com → **New project**.
2. Vào **Project Settings → API**, lấy 3 giá trị và điền vào `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (mục *Service role* — bí mật, chỉ dùng ở server)

### 2. Tạo bảng dữ liệu
Mở **Supabase → SQL Editor**, dán toàn bộ nội dung
`supabase/migrations/0001_init.sql` rồi bấm **Run**.

### 3. Tạo tài khoản giảng viên đầu tiên
```bash
node --env-file=.env.local supabase/scripts/create-instructor.mjs gv.thanh "MatKhau@123" "Nguyễn Văn Thanh" instructor
```
> Đăng nhập bằng **username** `gv.thanh` (không phải email). Hệ thống dùng email nội bộ
> `gv.thanh@fnhu.local` ở bên dưới, người dùng không cần biết.

### 4. Chạy
```bash
npm run dev
```
Mở http://localhost:3000 → tự chuyển tới `/login`.

---

## Deploy lên Vercel
1. `git push` repo này lên GitHub.
2. Vercel → **Import** repo → thêm 4 biến môi trường (như `.env.local`) trong **Settings → Environment Variables**.
3. Deploy.

## Lộ trình tiếp theo
- [ ] Port các module UI (Dashboard/Attendance/Gradebook/Assessments) từ prototype
- [ ] Landing page + form ghi danh → bảng `leads` + email (Resend)
- [ ] Thanh toán VietQR + webhook Casso
- [ ] Lịch hẹn + đồng bộ Google Calendar
