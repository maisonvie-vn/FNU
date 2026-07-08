import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createClient } from "@/lib/supabase/server";

type Row = {
  cohort: string | null;
  status: string;
  created_at: string;
  students: { student_code: string | null; full_name: string; email: string | null; phone: string | null; dob: string | null } | null;
  payments: { amount: number; status: string; transfer_code: string }[] | null;
};

function csvEscape(v: string) {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const cohortFilter = req.nextUrl.searchParams.get("cohort");
  const includeWithdrawn = req.nextUrl.searchParams.get("show") === "withdrawn";
  const format = req.nextUrl.searchParams.get("format") === "xlsx" ? "xlsx" : "csv";
  let query = supabase
    .from("enrollments")
    .select("cohort, status, created_at, students(student_code, full_name, email, phone, dob), payments(amount, status, transfer_code)")
    .order("created_at", { ascending: false });
  if (cohortFilter) query = query.eq("cohort", cohortFilter);

  const { data } = await query;
  let rows = ((data || []) as unknown as Row[]).filter((r) => r.students);
  // Mặc định xuất giống danh sách chính (loại người đã nghỉ), khớp với /app/students
  if (!includeWithdrawn) rows = rows.filter((r) => r.status !== "withdrawn");
  // Sắp theo MSSV cho giống danh sách chuẩn
  rows.sort((a, b) => (a.students?.student_code || "").localeCompare(b.students?.student_code || ""));

  const header = ["STT", "MSSV", "Họ tên", "Ngày sinh", "Email", "SĐT", "Lớp/Khóa", "Trạng thái ghi danh", "Học phí", "Trạng thái thanh toán", "Mã CK", "Ngày ghi danh"];
  const dataRows = rows.map((r, i) => {
    const p = r.payments?.[0];
    const dob = r.students?.dob ? new Date(r.students.dob).toLocaleDateString("vi-VN") : "";
    return [
      i + 1,
      r.students?.student_code || "",
      r.students?.full_name || "",
      dob,
      r.students?.email || "",
      r.students?.phone || "",
      r.cohort || "",
      r.status,
      p ? p.amount : "",
      p ? (p.status === "paid" ? "Đã thu" : "Chờ thu") : "",
      p?.transfer_code || "",
      new Date(r.created_at).toLocaleDateString("vi-VN"),
    ];
  });

  const baseName = `hoc-vien-fca${cohortFilter ? `-${cohortFilter}` : ""}`;

  if (format === "xlsx") {
    const ws = XLSX.utils.aoa_to_sheet([header, ...dataRows]);
    ws["!cols"] = [{ wch: 5 }, { wch: 13 }, { wch: 24 }, { wch: 12 }, { wch: 22 }, { wch: 13 }, { wch: 11 }, { wch: 16 }, { wch: 12 }, { wch: 15 }, { wch: 14 }, { wch: 13 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${baseName}.xlsx"`,
      },
    });
  }

  const lines = [header.map((h) => csvEscape(String(h))).join(",")];
  for (const row of dataRows) lines.push(row.map((v) => csvEscape(String(v))).join(","));
  // Thêm BOM để Excel hiển thị đúng tiếng Việt (UTF-8)
  const csv = "﻿" + lines.join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${baseName}.csv"`,
    },
  });
}
