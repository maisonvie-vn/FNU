"use client";

import { useRef } from "react";
import { withdrawStudent, reactivateStudent, moveCohort } from "./actions";

const COHORT_OPTIONS = [
  "FCA-2026-Summer",
  "FCA-2026-Fall",
  "FCA-2026-Winter",
  "FCA-2027-Spring",
];

export function MoveCohortForm({
  enrollmentId,
  currentCohort,
  knownCohorts,
}: {
  enrollmentId: string;
  currentCohort: string | null;
  knownCohorts: string[];
}) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const options = [...new Set([...COHORT_OPTIONS, ...knownCohorts])];

  return (
    <form action={moveCohort} className="flex items-center gap-1.5">
      <input type="hidden" name="id" value={enrollmentId} />
      <select
        ref={selectRef}
        name="cohort"
        defaultValue={currentCohort || ""}
        className="h-8 rounded-md border border-gold/25 bg-ink px-2 text-xs text-mist outline-none focus:border-gold"
      >
        {options.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button
        type="submit"
        title="Chuyển sang khóa đã chọn"
        className="h-8 rounded-md border border-gold/30 px-2 text-xs text-gold transition hover:bg-gold hover:text-ink"
      >
        Chuyển
      </button>
    </form>
  );
}

export function WithdrawButton({ enrollmentId, studentName }: { enrollmentId: string; studentName: string }) {
  return (
    <form
      action={withdrawStudent}
      onSubmit={(e) => {
        if (!confirm(`Đánh dấu "${studentName}" đã nghỉ / bảo lưu?\n\nHọ sẽ biến mất khỏi danh sách chính (có thể khôi phục lại sau). Dữ liệu điểm và thanh toán vẫn được giữ nguyên.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={enrollmentId} />
      <button
        type="submit"
        className="h-8 rounded-md border border-danger/50 px-2.5 text-xs text-danger transition hover:bg-danger/10"
      >
        Xóa
      </button>
    </form>
  );
}

export function ReactivateButton({ enrollmentId }: { enrollmentId: string }) {
  return (
    <form action={reactivateStudent}>
      <input type="hidden" name="id" value={enrollmentId} />
      <button
        type="submit"
        className="h-8 rounded-md border border-success/50 px-2.5 text-xs text-success transition hover:bg-success/10"
      >
        Khôi phục
      </button>
    </form>
  );
}
