import { redirect } from "next/navigation";

// Trang đăng ký công khai giờ nằm ở trang chủ "/". Giữ đường dẫn cũ để không gãy link.
export default function DangKyPage() {
  redirect("/");
}
