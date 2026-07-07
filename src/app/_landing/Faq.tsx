"use client";

import { useState } from "react";

const FAQS: [string, string, string][] = [
  ["What language is the course taught in? · Ngôn ngữ giảng dạy?", "Lectures and readings are in English. Administrative support and grade-sheet terminology are available in Vietnamese.", "Bài giảng và tài liệu bằng tiếng Anh; hỗ trợ hành chính và thuật ngữ bảng điểm có tiếng Việt."],
  ["Are there prerequisites? · Có yêu cầu đầu vào không?", "No formal prerequisites. Designed for Hospitality & F&B Management students in year 2 or above.", "Không có điều kiện tiên quyết; phù hợp sinh viên Quản trị Khách sạn & F&B từ năm 2 trở lên."],
  ["What is the attendance policy? · Chính sách chuyên cần?", "Attendance counts for 10% (present = full credit, late = half). Missing more than 20% of sessions bars you from the final exam (cấm thi).", "Chuyên cần chiếm 10% (đi học đủ = trọn điểm, đi trễ = nửa điểm). Vắng quá 20% số buổi sẽ bị cấm thi."],
  ["How is the course graded? · Cách tính điểm?", "Vietnamese 10-point scale: 10% attendance, 30% coursework, 60% final assessment. Letter grades follow the standard A+–F mapping.", "Thang điểm 10: 10% chuyên cần, 30% quá trình, 60% cuối kỳ; quy đổi điểm chữ A+–F theo chuẩn."],
  ["What is the capstone project? · Đồ án tốt nghiệp là gì?", "A blended final: a capstone dining-experience design project (50%) plus a written exam (50%).", "Cuối kỳ kết hợp: đồ án thiết kế trải nghiệm ẩm thực (50%) và bài thi viết (50%)."],
  ["How do I enroll? · Đăng ký thế nào?", "Submit the application form below. Approved students receive a portal invitation by email.", "Điền đơn ghi danh bên dưới; sinh viên được duyệt sẽ nhận lời mời vào cổng học tập qua email."],
];

export default function Faq() {
  const [open, setOpen] = useState(-1);
  return (
    <div>
      {FAQS.map((f, i) => (
        <div key={i} style={{ borderBottom: "1px solid rgba(168,136,78,0.35)" }}>
          <div
            onClick={() => setOpen(open === i ? -1 : i)}
            style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "22px 0", cursor: "pointer", alignItems: "baseline" }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600, color: "#FBF8F4" }}>{f[0]}</span>
            <span style={{ color: "#96A8A1", fontSize: 18 }}>{open === i ? "−" : "+"}</span>
          </div>
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
