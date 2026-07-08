import AppSidebar from "./_components/AppSidebar";
import { getMyRole } from "@/lib/role";

// Bố cục chung cho toàn bộ khu quản trị: thanh menu trái cố định + nội dung trang.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const role = await getMyRole();
  return (
    <div className="flex min-h-screen flex-col bg-ink md:flex-row">
      <AppSidebar role={role} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
