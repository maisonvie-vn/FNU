import { redirect } from "next/navigation";

// Trang dashboard cũ đã thay bằng /app. Chuyển hướng để không còn trang mồ côi.
export default function DashboardRedirect() {
  redirect("/app");
}
