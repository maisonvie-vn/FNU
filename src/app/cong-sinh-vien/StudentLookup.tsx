"use client";

import { useActionState } from "react";
import { lookupStudent, type PortalResult } from "./actions";

const DISPLAY = "var(--font-display)";

const STATUS_VI: Record<string, string> = {
  present: "Có mặt",
  late: "Trễ",
  absent: "Vắng",
};

function statusColor(s: string | null) {
  if (s === "present") return "#7FB595";
  if (s === "late") return "#C9A24A";
  if (s === "absent") return "#D98A7E";
  return "#8f9d96";
}

export default function StudentLookup() {
  const [state, formAction, pending] = useActionState<PortalResult, FormData>(
    lookupStudent,
    {},
  );

  if (state.ok && state.data) {
    const d = state.data;
    return (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 32, fontWeight: 600, color: "#FBF8F4" }}>{d.fullName}</div>
          <div style={{ fontSize: 13, color: "#96A8A1", marginTop: 4 }}>
            MSSV {d.studentCode} · Khóa {d.cohort || "—"}
          </div>
        </div>

        {/* Tổng kết */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Chuyên cần", vi: "·10%", value: d.attendanceScore.toFixed(1), color: "#D5DFDA" },
            { label: "Quá trình", vi: "·30%", value: d.coursework != null ? d.coursework.toFixed(1) : "—", color: "#D5DFDA" },
            { label: "Cuối kỳ", vi: "·60%", value: d.final != null ? d.final.toFixed(1) : "—", color: "#D5DFDA" },
            { label: "Tổng kết", vi: "", value: d.total != null ? d.total.toFixed(1) : "—", color: "#C9A24A" },
          ].map((c) => (
            <div key={c.label} style={{ border: "1px solid rgba(168,136,78,0.3)", borderRadius: 12, padding: "16px 14px", textAlign: "center", background: "#042726" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#96A8A1" }}>{c.label} <span style={{ color: "#8f9d96" }}>{c.vi}</span></div>
              <div style={{ fontFamily: DISPLAY, fontSize: 34, color: c.color, marginTop: 4 }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Trạng thái */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <span style={{ fontSize: 13, color: "#96A8A1" }}>Trạng thái học phần: </span>
          <span style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 600, color: d.status === "ĐẠT" ? "#7FB595" : d.status === "Đang cập nhật" ? "#96A8A1" : "#D98A7E" }}>{d.status}</span>
          {d.barred && <div style={{ fontSize: 12, color: "#D98A7E", marginTop: 4 }}>Bạn đã vắng quá 20% số buổi.</div>}
        </div>

        {/* Điểm danh từng buổi */}
        <div style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A24A", marginBottom: 14 }}>Điểm danh · {d.present} có mặt · {d.late} trễ · {d.absent} vắng</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(58px,1fr))", gap: 8 }}>
          {d.sessions.map((s) => (
            <div key={s.no} style={{ border: `1px solid ${statusColor(s.status)}55`, borderRadius: 8, padding: "8px 4px", textAlign: "center", background: "#042726" }}>
              <div style={{ fontSize: 10, color: "#96A8A1" }}>Buổi {s.no}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: statusColor(s.status), marginTop: 2 }}>{s.status ? STATUS_VI[s.status] : "—"}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 36 }}>
          <a href="/cong-sinh-vien" style={{ fontSize: 13, color: "#96A8A1" }} className="l-ul">← Tra cứu sinh viên khác</a>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} style={{ maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label htmlFor="student_code" style={{ display: "block", fontSize: 14, color: "#D5DFDA", marginBottom: 6 }}>Mã sinh viên (MSSV)</label>
        <input id="student_code" name="student_code" required placeholder="vd: 2505013002" style={inputStyle} />
      </div>
      <div>
        <label htmlFor="full_name" style={{ display: "block", fontSize: 14, color: "#D5DFDA", marginBottom: 6 }}>Họ và tên</label>
        <input id="full_name" name="full_name" required placeholder="Nhập đúng họ tên như khi đăng ký" style={inputStyle} />
      </div>
      {state.error && <p role="alert" style={{ fontSize: 14, color: "#D98A7E", margin: 0 }}>{state.error}</p>}
      <button type="submit" disabled={pending} style={{ height: 46, borderRadius: 8, background: "#A8884E", color: "#042726", border: "none", fontWeight: 600, fontSize: 14, letterSpacing: "0.08em", cursor: pending ? "not-allowed" : "pointer", opacity: pending ? 0.6 : 1 }}>
        {pending ? "Đang tra cứu…" : "Xem kết quả của tôi"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  height: 46,
  width: "100%",
  borderRadius: 8,
  border: "1px solid rgba(168,136,78,0.35)",
  background: "#102B2A",
  color: "#FBF8F4",
  padding: "0 14px",
  fontSize: 15,
  outline: "none",
  fontFamily: "var(--font-body)",
};
