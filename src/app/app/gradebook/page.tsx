import { redirect } from "next/navigation";

// Bảng điểm cũ (thang 10) đã được thay bằng Ma trận Điểm danh & Điểm (thang 100)
// tại /app/attendance. Chuyển hướng để không còn trang mồ côi.
export default function GradebookRedirect() {
  redirect("/app/attendance");
}
