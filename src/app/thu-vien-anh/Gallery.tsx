"use client";

import { useCallback, useEffect, useState } from "react";
import { ALBUMS } from "../_data/gallery";

const DISPLAY = "var(--font-display)";

export default function Gallery() {
  const [albumIdx, setAlbumIdx] = useState<number | null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);

  const album = albumIdx != null ? ALBUMS[albumIdx] : null;

  const close = useCallback(() => setAlbumIdx(null), []);
  const next = useCallback(() => {
    if (album) setPhotoIdx((i) => (i + 1) % album.photos.length);
  }, [album]);
  const prev = useCallback(() => {
    if (album) setPhotoIdx((i) => (i - 1 + album.photos.length) % album.photos.length);
  }, [album]);

  // Điều khiển bằng bàn phím
  useEffect(() => {
    if (!album) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [album, close, next, prev]);

  const openAlbum = (i: number) => {
    setAlbumIdx(i);
    setPhotoIdx(0);
  };

  return (
    <>
      {/* Lưới album */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 18 }}>
        {ALBUMS.map((a, i) => (
          <button
            key={a.id}
            onClick={() => openAlbum(i)}
            style={{
              position: "relative",
              aspectRatio: "4 / 3",
              border: "1px solid rgba(168,136,78,0.4)",
              borderRadius: 12,
              overflow: "hidden",
              cursor: "pointer",
              padding: 0,
              background: "#042726",
            }}
            className="gal-tile"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.cover} alt={`${a.titleEn} · ${a.titleVi}`} className="gal-cover" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,39,38,0.9) 0%, rgba(4,39,38,0.15) 55%, transparent 100%)" }} />
            <div style={{ position: "absolute", left: 16, right: 16, bottom: 14, textAlign: "left" }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, color: "#FBF8F4" }}>{a.titleEn}</div>
              <div style={{ fontSize: 13, color: "#C9A24A" }}>{a.titleVi}</div>
              <div style={{ marginTop: 6, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#96A8A1" }}>{a.photos.length} ảnh · photos</div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {album && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={close}
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,20,20,0.94)", backdropFilter: "blur(6px)", display: "flex", flexDirection: "column" }}
        >
          {/* Thanh trên: tiêu đề + đóng */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <div>
              <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, color: "#FBF8F4" }}>{album.titleEn}</div>
              <div style={{ fontSize: 13, color: "#C9A24A" }}>{album.titleVi}</div>
            </div>
            <button onClick={close} aria-label="Đóng" style={{ background: "none", border: "1px solid rgba(168,136,78,0.5)", color: "#FBF8F4", borderRadius: 8, width: 40, height: 40, fontSize: 20, cursor: "pointer" }}>×</button>
          </div>

          {/* Ảnh + nút trước/sau */}
          <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 12px 8px", minHeight: 0 }} onClick={(e) => e.stopPropagation()}>
            <button onClick={prev} aria-label="Ảnh trước" className="gal-arrow" style={{ position: "absolute", left: 16, zIndex: 2 }}>‹</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={album.photos[photoIdx]} alt={`${album.titleEn} — ảnh ${photoIdx + 1}`} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 8 }} />
            <button onClick={next} aria-label="Ảnh sau" className="gal-arrow" style={{ position: "absolute", right: 16, zIndex: 2 }}>›</button>
          </div>

          {/* Đếm số + gợi ý */}
          <div style={{ textAlign: "center", padding: "10px 0 20px", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <span style={{ fontFamily: DISPLAY, fontSize: 18, color: "#C9A24A" }}>{photoIdx + 1}</span>
            <span style={{ color: "#96A8A1" }}> / {album.photos.length}</span>
            <div style={{ marginTop: 4, fontSize: 11, color: "#8f9d96" }}>Dùng phím ← → để chuyển · Esc để đóng</div>
          </div>
        </div>
      )}
    </>
  );
}
