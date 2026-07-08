"use client";

import Link from "next/link";
import { useState } from "react";

type L = { href: string; en: string; vi: string };

export default function MobileMenu({ links }: { links: L[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div data-hamburger style={{ position: "relative" }}>
      <style>{`[data-hamburger]{display:none}@media(max-width:780px){[data-hamburger]{display:block}}`}</style>
      <button
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{ background: "none", border: "1px solid rgba(168,136,78,0.5)", borderRadius: 8, width: 42, height: 42, color: "#C9A24A", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", left: 0, right: 0, top: 73, bottom: 0, background: "rgba(4,39,38,0.5)", zIndex: 40 }} />
          <nav style={{ position: "fixed", left: 0, right: 0, top: 73, background: "#042726", borderBottom: "1px solid rgba(168,136,78,0.45)", padding: "8px 20px 20px", zIndex: 50, display: "flex", flexDirection: "column" }}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ padding: "13px 4px", borderBottom: "1px solid rgba(168,136,78,0.15)", textDecoration: "none", color: "#F4EFE6" }}>
                <span style={{ fontSize: 14, letterSpacing: "0.06em" }}>{l.en}</span>
                <span style={{ fontSize: 12, color: "#96A8A1", marginLeft: 8 }}>· {l.vi}</span>
              </Link>
            ))}
            <Link href="/#enroll" onClick={() => setOpen(false)} style={{ marginTop: 14, textAlign: "center", border: "1px solid #A8884E", color: "#C9A24A", padding: "13px", borderRadius: 8, letterSpacing: "0.12em", fontSize: 13, textTransform: "uppercase", fontWeight: 600, textDecoration: "none" }}>
              Enroll · Ghi danh
            </Link>
          </nav>
        </>
      )}
    </div>
  );
}
