import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Các tiền tố đường dẫn yêu cầu đăng nhập (khu vực CRM của giảng viên)
const PROTECTED_PREFIXES = ["/app", "/dashboard", "/attendance", "/gradebook", "/assessments", "/leads", "/students", "/settings", "/appointments"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Chưa cấu hình Supabase → cho qua (để xem giao diện trước khi nối backend)
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Bắt buộc gọi getUser() để refresh token — không dùng getSession() ở server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));

  // Chưa đăng nhập mà vào khu vực bảo vệ → đẩy về /login
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Đã đăng nhập mà vào /login → đẩy vào dashboard
  if (path === "/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  return response;
}
