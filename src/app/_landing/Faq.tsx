"use client";

import { useState } from "react";

const FAQS: [string, string, string][] = [
  ["What language is the course taught in? · Ngôn ngữ giảng dạy?", "Lectures and readings are in English. Administrative support and grade-sheet terminology are available in Vietnamese.", "Bài giảng và tài liệu bằng tiếng Anh; hỗ trợ hành chính và thuật ngữ bảng điểm có tiếng Việt."],
  ["Are there prerequisites? · Có yêu cầu đầu vào không?", "No formal prerequisites. Designed for Hospitality & F&B Management students in year 2 or above.", "Không có điều kiện tiên quyết; phù hợp sinh viên Quản trị Khách sạn & F&B từ năm 2 trở lên."],
  ["What is the attendance policy? · Chính sách chuyên cần?", "Present = full credit, late = half. Leave with permission (xin phép) is not penalised — it is excluded from the calculation, not counted as absence. Only unexcused absence over 20% of sessions bars you from the exam (cấm thi).", "Có mặt = trọn điểm, đi trễ = nửa điểm. Nghỉ có phép (xin phép) KHÔNG bị trừ điểm — được loại khỏi cách tính, không tính là vắng. Chỉ vắng KHÔNG phép quá 20% số buổi mới bị cấm thi."],
  ["How is the course graded? · Cách tính điểm?", "100-point scale. The overall grade is the average of four components: Attendance (auto from your check-ins), Diligence, Major-fit and Quizzes (auto-graded). Everything is computed live in the student portal. Pass threshold: 50/100.", "Thang điểm 100. Điểm tổng kết là trung bình của bốn thành phần: Chuyên cần (tự tính từ điểm danh), Chuyên cần đánh giá, Phù hợp chuyên ngành và Bài kiểm tra (chấm tự động). Tất cả tính trực tiếp trong cổng sinh viên. Điểm đạt: 50/100."],
  ["Where can I see my grades? · Xem điểm ở đâu?", "In the Student Portal: enter your student code and full name to see your attendance, each component score and your overall grade in real time — no login required.", "Vào Cổng sinh viên: nhập Mã sinh viên và Họ tên để xem điểm danh, điểm từng thành phần và điểm tổng kết theo thời gian thực — không cần đăng nhập."],
  ["How do I enroll? · Đăng ký thế nào?", "Submit the application form below. Approved students receive a portal invitation by email.", "Điền đơn ghi danh bên dưới; sinh viên được duyệt sẽ nhận lời mời vào cổng học tập qua email."],
];

export default function Faq() {
  const [open, setOpen] = useState(-1);
  return (
    <div>
      {FAQS.map((f, i) => (
        <div key={i} style={{ borderBottom: "1px solid rgba(168,136,78,0.35)" }}>
          <button
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? -1 : i)}
            style={{ display: "flex", width: "100%", justifyContent: "space-between", gap: 20, padding: "22px 0", cursor: "pointer", alignItems: "baseline", background: "none", border: "none", textAlign: "left", fontFamily: "inherit" }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600, color: "#FBF8F4" }}>{f[0]}</span>
            <span aria-hidden="true" style={{ color: "#96A8A1", fontSize: 18 }}>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#D5DFDA", margin: "0 0 8px", maxWidth: 640 }}>{f[1]}</p>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#96A8A1", margin: "0 0 22px", maxWidth: 640 }}>{f[2]}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
