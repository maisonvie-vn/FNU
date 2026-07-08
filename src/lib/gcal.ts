// Tạo link "Thêm vào Google Calendar" (không cần OAuth — mở sẵn form tạo sự kiện).
// Dùng cho cả giảng viên lẫn sinh viên bấm để lưu lịch hẹn vào lịch cá nhân.

function fmt(d: Date) {
  // Google Calendar cần định dạng UTC: YYYYMMDDTHHMMSSZ
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function gcalEventUrl(opts: {
  title: string;
  start: string | Date; // ISO string hoặc Date
  end: string | Date;
  details?: string;
  location?: string;
}) {
  const start = typeof opts.start === "string" ? new Date(opts.start) : opts.start;
  const end = typeof opts.end === "string" ? new Date(opts.end) : opts.end;
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${fmt(start)}/${fmt(end)}`,
  });
  if (opts.details) p.set("details", opts.details);
  if (opts.location) p.set("location", opts.location);
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}
