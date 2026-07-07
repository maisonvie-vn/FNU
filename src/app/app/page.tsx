import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";

export const metadata = { title: "Food Culture & Aesthetic — CRM" };

// Hiển thị toàn bộ giao diện thiết kế (bản prototype) sau khi đăng nhập.
// Giai đoạn sau sẽ thay dần từng màn hình bằng dữ liệu Supabase thật.
export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen flex-col bg-ink">
      {/* Thanh trên cùng: danh tính + đăng xuất */}
      <div className="flex items-center justify-between border-b border-gold/20 bg-ink-deep px-4 py-2">
        <span className="eyebrow">Food Culture &amp; Aesthetic · CRM</span>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-sage">dữ liệu mẫu · sample data</span>
          <form action={logout}>
            <button className="h-8 rounded-md border border-gold/30 px-3 text-mist transition hover:border-gold hover:text-gold">
              Đăng xuất
            </button>
          </form>
        </div>
      </div>

      {/* Giao diện thiết kế của bạn */}
      <iframe
        src="/preview/index.html"
        title="Course CRM"
        className="w-full flex-1 border-0"
      />
    </div>
  );
}
