"use server";

import { revalidatePath } from "next/cache";
import * as XLSX from "xlsx";
import { createClient } from "@/lib/supabase/server";

async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Chưa đăng nhập");
  return supabase;
}

// ---------- Nhập danh sách từ Excel / CSV ----------
export type ImportResult = {
  error?: string;
  ok?: boolean;
  added?: number;
  updated?: number;
  skipped?: number;
  total?: number;
  names?: string[];
};

const low = (s: unknown) => String(s ?? "").toLowerCase().trim();
// "14/12/2007" | "2007-12-14" -> ISO date; else null
function parseDob(v: unknown): string | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  let m = s.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  m = s.match(/^(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})$/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  return null;
}

export async function importStudents(_prev: ImportResult, formData: FormData): Promise<ImportResult> {
  const supabase = await requireStaff();
  const file = formData.get("file") as File | null;
  const defaultCohort = String(formData.get("cohort") || "F-NU-10").trim() || "F-NU-10";
  if (!file || file.size === 0) return { error: "Vui lòng chọn tệp .xlsx hoặc .csv." };
  if (file.size > 2_000_000) return { error: "Tệp quá lớn (>2MB)." };

  const cell = (row: unknown[], i: number) => (i >= 0 && i < row.length ? String(row[i] ?? "").trim() : "");
  const isHeaderRow = (row: unknown[]) => row.some((c) => /mssv|msv|mã|student.?s? ?id|full ?name|họ (và |)tên/.test(low(c)));

  type Parsed = { code: string; name: string; dob: string | null; email: string | null; phone: string | null; cohort: string };
  // Phân tích 1 sheet → danh sách SV hợp lệ (mã là chuỗi số, có tên)
  function parseSheet(aoa: unknown[][]): Parsed[] {
    if (!aoa.length) return [];
    let hi = aoa.findIndex(isHeaderRow);
    if (hi < 0) hi = 0;
    const header = Array.from({ length: 40 }, (_, i) => low(aoa[hi][i])); // dày hóa, tránh "lỗ hổng" mảng thưa
    const findCol = (re: RegExp) => header.findIndex((h) => re.test(h));
    const codeCol = findCol(/mssv|msv|mã|student.?s? ?id|\bid\b/);
    let nameCol = findCol(/họ (và |)tên|full ?name|họ tên/);
    const dobCol = findCol(/ngày sinh|dob|date of birth/);
    const emailCol = findCol(/email|thư/);
    const phoneCol = findCol(/sđt|phone|điện thoại|số đt/);
    const cohortCol = findCol(/lớp|khóa|khoá|class|cohort/);
    if (nameCol < 0) nameCol = codeCol >= 0 ? codeCol + 1 : 1;
    // Tên có thể tách 2 cột (Họ và tên | Tên) do gộp ô. Nếu cột "đã biết" gần nhất sau tên
    // nằm ở nameCol+2 thì cột nameCol+1 chính là phần tên còn lại → nối lại.
    const laterKnown = [codeCol, dobCol, emailCol, phoneCol, cohortCol].filter((i) => i > nameCol);
    const nextKnown = laterKnown.length ? Math.min(...laterKnown) : -1;
    const nameCol2 = nextKnown === nameCol + 2 ? nameCol + 1 : -1;

    const out: Parsed[] = [];
    for (let r = hi + 1; r < aoa.length; r++) {
      const row = aoa[r];
      const code = cell(row, codeCol).replace(/\s+/g, "");
      let name = cell(row, nameCol);
      if (nameCol2 >= 0) name = `${name} ${cell(row, nameCol2)}`.replace(/\s+/g, " ").trim();
      if (!code || !name || !/^\d{4,}$/.test(code)) continue;
      out.push({
        code,
        name,
        dob: dobCol >= 0 ? parseDob(row[dobCol]) : null,
        email: emailCol >= 0 ? cell(row, emailCol) || null : null,
        phone: phoneCol >= 0 ? cell(row, phoneCol) || null : null,
        cohort: (cohortCol >= 0 ? cell(row, cohortCol) : "") || defaultCohort,
      });
    }
    return out;
  }

  // Quét MỌI sheet, chọn sheet cho nhiều SV hợp lệ nhất (bỏ qua sheet lớp khác/không có mã)
  let parsed: Parsed[] = [];
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const wb = XLSX.read(buf, { type: "buffer", raw: false });
    for (const sheetName of wb.SheetNames) {
      const aoa = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, blankrows: false, raw: false }) as unknown[][];
      const rows = parseSheet(aoa);
      if (rows.length > parsed.length) parsed = rows;
    }
  } catch {
    return { error: "Không đọc được tệp. Hãy dùng đúng mẫu (.xlsx hoặc .csv)." };
  }
  if (parsed.length === 0) return { error: "Không tìm thấy sinh viên hợp lệ (cần cột MSSV + Họ tên). Hãy dùng file mẫu." };

  let added = 0, updated = 0;
  const skipped = 0;
  const names: string[] = [];
  for (const { code, name, dob, email, phone, cohort } of parsed) {
    const { data: existing } = await supabase.from("students").select("id").eq("student_code", code).maybeSingle();
    if (existing) {
      const patch: Record<string, unknown> = { full_name: name };
      if (dob) patch.dob = dob;
      if (email) patch.email = email;
      if (phone) patch.phone = phone;
      await supabase.from("students").update(patch).eq("id", existing.id);
      const { data: e } = await supabase.from("enrollments").select("id, status").eq("student_id", existing.id).maybeSingle();
      if (!e) await supabase.from("enrollments").insert({ student_id: existing.id, cohort, status: "active" });
      else if (e.status === "withdrawn") await supabase.from("enrollments").update({ status: "active" }).eq("id", e.id);
      updated++;
    } else {
      const { data: ns } = await supabase.from("students").insert({ student_code: code, full_name: name, dob, email, phone }).select("id").single();
      if (ns) await supabase.from("enrollments").insert({ student_id: ns.id, cohort, status: "active" });
      added++;
      names.push(name);
    }
  }

  revalidatePath("/app/students");
  return { ok: true, added, updated, skipped, total: added + updated, names: names.slice(0, 30) };
}

// "Xóa" khỏi danh sách — đánh dấu đã nghỉ/bảo lưu, KHÔNG xóa dữ liệu thật
// (giữ nguyên lịch sử điểm/điểm danh/thanh toán để đối chiếu, có thể khôi phục)
export async function withdrawStudent(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await requireStaff();
  await supabase.from("enrollments").update({ status: "withdrawn" }).eq("id", id);
  revalidatePath("/app/students");
}

// Khôi phục SV đã đánh dấu nghỉ trở lại danh sách hoạt động
export async function reactivateStudent(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await requireStaff();
  await supabase.from("enrollments").update({ status: "active" }).eq("id", id);
  revalidatePath("/app/students");
}

// Chuyển sinh viên sang khóa/lớp khác (bảo lưu)
export async function moveCohort(formData: FormData) {
  const id = String(formData.get("id") || "");
  const cohort = String(formData.get("cohort") || "").trim();
  if (!id || !cohort) return;
  const supabase = await requireStaff();
  await supabase.from("enrollments").update({ cohort }).eq("id", id);
  revalidatePath("/app/students");
}
