import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Row = {
  cohort: string | null;
  status: string;
  created_at: string;
  students: { student_code: string | null; full_name: string; email: string | null; phone: string | null } | null;
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
  let query = supabase
    .from("enrollments")
    .select("cohort, status, created_at, students(student_code, full_name, email, phone), payments(amount, status, transfer_code)")
    .order("created_at", { ascending: false });
  if (cohortFilter) query = query.eq("cohort", cohortFilter);

  const { data } = await query;
  const rows = ((data || []) as unknown as Row[]).filter((r) => r.students);

  const header = ["Họ tên", "MSSV", "Email", "SĐT", "Lớp/Khóa", "Trạng thái ghi danh", "Học phí", "Trạng thái thanh toán", "Mã CK", "Ngày ghi danh"];
  const lines = [header.map(csvEscape).join(",")];
  for (const r of rows) {
    const p = r.payments?.[0];
    lines.push(
      [
        r.students?.full_name || "",
        r.students?.student_code || "",
        r.students?.email || "",
        r.students?.phone || "",
        r.cohort || "",
        r.status,
        p ? String(p.amount) : "",
        p ? (p.status === "paid" ? "Đã thu" : "Chờ thu") : "",
        p?.transfer_code || "",
        new Date(r.created_at).toLocaleDateString("vi-VN"),
      ]
        .map((v) => csvEscape(String(v)))
        .join(","),
    );
  }

  // Thêm BOM để Excel hiển thị đúng tiếng Việt (UTF-8)
  const csv = "﻿" + lines.join("\r\n");
  const filename = `hoc-vien-fca${cohortFilter ? `-${cohortFilter}` : ""}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
