import AppSidebar from "./_components/AppSidebar";

// Bố cục chung cho toàn bộ khu quản trị: thanh menu trái cố định + nội dung trang.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ink md:flex-row">
      <AppSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
