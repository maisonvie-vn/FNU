import * as XLSX from "xlsx";
import { createClient } from "@/lib/supabase/server";

// Tải file MẪU để nhập danh sách sinh viên. Cột khớp với bộ nhập ở /app/students.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const rows = [
    ["MSSV", "Họ và tên", "Ngày sinh", "Email", "SĐT", "Lớp"],
    ["2505013099", "Nguyễn Văn Mẫu", "01/09/2007", "mau@example.com", "0900000000", "F-NU-10"],
    ["2505013100", "Trần Thị Ví Dụ", "15/03/2007", "", "", "F-NU-10"],
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 14 }, { wch: 26 }, { wch: 12 }, { wch: 24 }, { wch: 14 }, { wch: 12 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "DanhSach");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="F-NU-10-mau-nhap-sinh-vien.xlsx"',
    },
  });
}
