"use client";

import { useActionState } from "react";
import { submitLead, type RegisterState } from "../dang-ky/actions";

const inputStyle: React.CSSProperties = {
  border: "none",
  borderBottom: "1px solid #96A8A1",
  background: "transparent",
  color: "#FBF8F4",
  padding: "10px 2px",
  fontSize: 15,
  fontFamily: "var(--font-body)",
  outline: "none",
};

export default function EnrollForm() {
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    submitLead,
    {},
  );

  if (state.ok) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 30,
            fontWeight: 600,
            color: "#C9A24A",
            marginBottom: 12,
          }}
        >
          Application received · Đã nhận hồ sơ
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "#D5DFDA" }}>
          Your registration is pending review. We will contact you at the email
          provided.
          <br />
          <span style={{ color: "#96A8A1" }}>
            Hồ sơ của bạn đang chờ duyệt. Chúng tôi sẽ liên hệ qua email.
          </span>
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "#C9A24A",
        }}
      >
        Enrollment Application · Đơn ghi danh
      </div>
      <input name="full_name" required placeholder="Full name / Họ tên" style={inputStyle} />
      <input name="student_code" placeholder="Student ID / MSSV" style={inputStyle} />
      <input name="email" type="email" required placeholder="Email" style={inputStyle} />
      <input name="phone" type="tel" placeholder="Phone / Số điện thoại" style={inputStyle} />
      <select name="cohort" defaultValue="FCA-2026-Fall" style={{ ...inputStyle, background: "#102B2A" }}>
        <option value="FCA-2026-Fall">Fall 2026 cohort · Khóa Thu 2026</option>
        <option value="FCA-2027-Spring">Spring 2027 cohort · Khóa Xuân 2027</option>
      </select>
      {state.error && (
        <div style={{ fontSize: 13, color: "#D98A7E" }}>{state.error}</div>
      )}
      <button
        type="submit"
        disabled={pending}
        style={{
          background: "#A8884E",
          color: "#042726",
          border: "none",
          borderRadius: 8,
          padding: 16,
          fontSize: 13,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          cursor: pending ? "not-allowed" : "pointer",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          marginTop: 6,
          opacity: pending ? 0.6 : 1,
        }}
      >
        {pending ? "Đang gửi… · Submitting" : "Submit Application · Gửi đơn"}
      </button>
    </form>
  );
}
