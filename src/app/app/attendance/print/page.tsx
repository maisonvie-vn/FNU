import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadMatrix, STATUS_META } from "../matrix";
import AutoPrint from "./AutoPrint";

export const metadata = { title: "In bảng điểm danh · F-NU-10" };
export const dynamic = "force-dynamic";

function fmtNow() {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
}

export default async function AttendancePrintPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const matrix = await loadMatrix(supabase);
  if ("error" in matrix) return <div style={{ padding: 40 }}>Lỗi: {matrix.error}</div>;
  const { sessions, rows } = matrix;

  return (
    <div className="print-wrap" style={{ background: "#fff", color: "#111", padding: 24, minHeight: "100vh" }}>
      {/* CSS in ấn: nền trắng, hiện màu ô, ẩn sidebar */}
      <style>{`
        @media print {
          aside, .no-print { display: none !important; }
          @page { size: A4 landscape; margin: 10mm; }
        }
        .print-wrap * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .pt-table { border-collapse: collapse; width: 100%; font-size: 10px; }
        .pt-table th, .pt-table td { border: 1px solid #d8c9a0; padding: 3px 4px; text-align: center; }
        .pt-table th { background: #C9A24A; color: #042726; }
        .pt-name { text-align: left !important; white-space: nowrap; }
      `}</style>

      <AutoPrint />

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#8a6d2f" }}>Lớp F-NU-10</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Bảng điểm danh &amp; điểm tổng hợp</div>
        <div style={{ fontSize: 11, color: "#555" }}>Sĩ số: {rows.length} · Số buổi: {sessions.length} · Ngày in: {fmtNow()}</div>
      </div>

      <table className="pt-table">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>STT</th>
            <th className="pt-name">MSSV · Họ và tên</th>
            {sessions.map((s) => <th key={s.id}>B{s.no}</th>)}
            <th>Att<br />/100</th>
            <th>Ch.cần<br />/100</th>
            <th>Phù hợp<br />CN</th>
            <th>Quiz<br />/100</th>
            <th>Tổng<br />/100</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id}>
              <td>{i + 1}</td>
              <td className="pt-name"><b>{r.student_code}</b> · {r.full_name}</td>
              {r.cells.map((c, j) => {
                const m = c ? STATUS_META[c] : null;
                return <td key={j} style={m ? { background: m.color, color: "#042726", fontWeight: 700 } : {}}>{m ? m.short : ""}</td>;
              })}
              <td style={{ fontWeight: 700 }}>{r.attendance100}</td>
              <td>{r.diligence ?? ""}</td>
              <td>{r.major_fit ?? ""}</td>
              <td>{r.quiz100 ?? ""}</td>
              <td style={{ fontWeight: 700 }}>{r.tb}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 10, fontSize: 10, color: "#555" }}>
        Ký hiệu:
        {Object.entries(STATUS_META).map(([k, m]) => (
          <span key={k} style={{ marginLeft: 8 }}>
            <span style={{ display: "inline-block", width: 10, height: 10, background: m.color, verticalAlign: "middle", marginRight: 3 }} />
            {m.short} = {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}
