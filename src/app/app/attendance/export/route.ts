import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createClient } from "@/lib/supabase/server";
import { loadMatrix, STATUS_META } from "../matrix";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const matrix = await loadMatrix(supabase);
  if ("error" in matrix) return new NextResponse("Lỗi: " + matrix.error, { status: 500 });
  const { sessions, rows } = matrix;

  const shortOf = (s: string | null) => (s ? STATUS_META[s]?.short ?? "" : "");
  const header = [
    "STT", "MSSV", "Họ và tên",
    ...sessions.map((s) => `B${s.no}`),
    "Attendance/100", "Chuyên cần/100", "Phù hợp chuyên ngành/100", "Quiz/100", "Tổng kết/100",
  ];
  const body = rows.map((r, i) => [
    i + 1, r.student_code || "", r.full_name,
    ...r.cells.map(shortOf),
    r.attendance100, r.diligence ?? "", r.major_fit ?? "", r.quiz100 ?? "", r.tb,
  ]);
  const legend = ["Ký hiệu: C = Có mặt · P = Xin phép · T = Trễ · V = Vắng · (trống) = chưa điểm danh"];

  const ws = XLSX.utils.aoa_to_sheet([header, ...body, [], legend]);
  ws["!cols"] = [{ wch: 5 }, { wch: 12 }, { wch: 22 }, ...sessions.map(() => ({ wch: 4 })), { wch: 14 }, { wch: 13 }, { wch: 20 }, { wch: 9 }, { wch: 12 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Điểm danh & Điểm");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="F-NU-10-diem-danh-bang-diem.xlsx"',
    },
  });
}
