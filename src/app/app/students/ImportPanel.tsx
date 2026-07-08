"use client";

import { useActionState, useRef, useState } from "react";
import { importStudents, type ImportResult } from "./actions";

export default function ImportPanel({ cohorts }: { cohorts: string[] }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ImportResult, FormData>(importStudents, {});
  const [fileName, setFileName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-10 rounded-lg border border-gold/40 px-4 text-sm text-gold transition hover:bg-gold hover:text-ink"
      >
        Nhập từ Excel ↑
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-[min(92vw,380px)] rounded-2xl border border-gold/30 bg-ink-deep p-5 shadow-2xl">
          <div className="mb-1 font-display text-xl text-cream">Nhập danh sách sinh viên</div>
          <p className="mb-4 text-xs text-sage">
            Tải mẫu, điền rồi tải lên (.xlsx hoặc .csv). Trùng MSSV sẽ được cập nhật, MSSV mới sẽ được thêm.
            <br />Import from Excel/CSV — matches by student code.
          </p>

          <a
            href="/app/students/template"
            className="mb-4 inline-block rounded-lg border border-gold/30 px-3 py-1.5 text-xs text-gold transition hover:bg-gold/10"
          >
            ↓ Tải file mẫu · Download template
          </a>

          {state.ok ? (
            <div className="rounded-lg border border-success/40 bg-success/10 p-4 text-sm text-cream">
              <div className="font-semibold text-success">✓ Đã nhập xong</div>
              <div className="mt-1 text-mist">Thêm mới: <b>{state.added}</b> · Cập nhật: <b>{state.updated}</b>{state.skipped ? ` · Bỏ qua: ${state.skipped}` : ""}</div>
              {state.names && state.names.length > 0 && (
                <div className="mt-2 text-xs text-sage">Mới: {state.names.join(", ")}</div>
              )}
              <button onClick={() => { setOpen(false); setFileName(""); location.reload(); }} className="mt-3 rounded-lg bg-gold px-4 py-1.5 text-xs font-semibold text-ink">Xong · Đóng</button>
            </div>
          ) : (
            <form ref={formRef} action={action} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-sage">Lớp / Khóa mặc định</label>
                <input name="cohort" defaultValue={cohorts[0] || "F-NU-10"} className="h-10 w-full rounded-lg border border-gold/25 bg-ink px-3 text-sm text-cream" />
              </div>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gold/40 px-3 py-3 text-sm text-mist transition hover:border-gold">
                <span className="rounded bg-gold/15 px-2 py-1 text-xs text-gold">Chọn tệp</span>
                <span className="truncate text-xs">{fileName || "Chưa chọn tệp .xlsx / .csv"}</span>
                <input
                  type="file"
                  name="file"
                  accept=".xlsx,.xls,.csv"
                  required
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                  className="hidden"
                />
              </label>
              {state.error && <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">{state.error}</p>}
              <button disabled={pending} className="h-10 w-full rounded-lg bg-gold text-sm font-semibold text-ink transition hover:bg-gold-soft disabled:opacity-50">
                {pending ? "Đang nhập…" : "Tải lên & nhập · Import"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
