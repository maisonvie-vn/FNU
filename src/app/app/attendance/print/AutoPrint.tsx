"use client";

import { useEffect } from "react";

export default function AutoPrint() {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="no-print mb-4 flex gap-2">
      <button onClick={() => window.print()} className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink">In / Lưu PDF</button>
      <button onClick={() => window.close()} className="rounded-lg border border-gold/40 px-4 py-2 text-sm text-gold">Đóng</button>
    </div>
  );
}
