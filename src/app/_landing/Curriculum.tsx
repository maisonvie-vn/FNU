"use client";

import { useState } from "react";

const LESSONS: [string, string, string, string][] = [
  ["01", "Introduction to the Course — Hospitality & Gastronomy · Nhập môn: Hospitality & Gastronomy", "Define gastronomy & hospitality, their parallel relationship, and why hospitality education needs gastronomy — set in the 2026 context of AI, Gen Z and sustainability.", "The MICHELIN Guide comes to Vietnam"],
  ["02", "Outline to Food Culture · Khái quát văn hóa ẩm thực", "Food as a communicative practice: how it builds personal, family and community identity; food in five major religions and in celebrations across cultures.", "The Halal economy — when dietary law becomes a global standard"],
  ["03", "The World's Food Districts · Bản đồ ẩm thực thế giới", "A cultural geography of 17+ influential cuisines across 4 continents — terroir, staples, fusion and glocalization: what happens when a cuisine leaves home?", "When cuisines travel — glocalization & the viral dish"],
  ["04", "What Shapes Food Culture · Điều gì định hình văn hóa ẩm thực", "The determinants of food choice — biological, economic, physical, social, psychological — plus barriers to change and behaviour-change models.", "The digital food environment — apps, feeds & AI meal-planners"],
  ["05", "Food as a Portal into Culture · Ẩm thực — cánh cổng vào văn hóa", "Nine reasons food is the richest portal into a culture: identity, story, values, climate, history, ingredients, tourism and language.", "Whose portal? Food, culture & the feed"],
  ["06", "Forming Food Culture · Sự hình thành văn hóa ẩm thực", "How history, power, faith and migration formed what the world eats — the sugar & spice trades, religion and custom, hot/cool theory and the poetry of dish names.", "A new “career of sugar”? Avocado, matcha & viral commodities"],
  ["07", "Trends & the New Food Culture · Xu hướng & văn hóa ẩm thực mới", "Read 25 dining trends as six cultural forces; tell a fad from a trend with the diffusion lifecycle; test everything against four lenses: culture, aesthetics, business, ethics.", "Which predictions aged well? Scoring 2019 forecasts from 2026"],
  ["08", "French Food Culture · Văn hóa ẩm thực Pháp", "Why French cuisine became the reference grammar of Western gastronomy — terroir, the structure of the meal, and the Michelin system.", "The retirement of the Green Star"],
  ["09", "Vietnamese Food Culture · Văn hóa ẩm thực Việt Nam", "The art of balance — âm–dương, five elements, fresh herbs and fish sauce; the northern, central and southern tables.", "When Michelin meets the street — phở & bún bò on the 2026 map"],
  ["10", "Italian Food Culture · Văn hóa ẩm thực Ý", "Simplicity, season and the shared table: Italy as a mosaic of regional identities, now UNESCO heritage of humanity.", "Heritage versus the “fakes”"],
  ["11", "British Food Culture · Văn hóa ẩm thực Anh", "A multicultural island cuisine — empire, trade and migration on a plate, from the Sunday roast to the modern British revival.", "Is Chicken Tikka Masala British?"],
  ["12", "German Food Culture · Văn hóa ẩm thực Đức", "A patchwork of regional traditions — bread, sausage, beer and ritualised meal-times — remaking itself for a plant-based 2026.", "Vegan sausage in the land of Wurst"],
  ["13", "Spanish Food Culture · Văn hóa ẩm thực Tây Ban Nha", "A day measured in meals — tapas, the long lunch and the siesta — built on olive oil, saffron and the sociable table.", "Liquid gold in a warming climate — olive oil under pressure"],
  ["14", "American Food Culture · Văn hóa ẩm thực Mỹ", "The melting pot as process: borrowing, fusing and reinventing the world's flavours, from the regional table to the fast-food nation.", "The Ozempic plate — GLP-1 and the health-driven table"],
];

const MODULES: [string, string, [string, string, string, string][]][] = [
  ["I", "Foundations of Food Culture — Nền tảng văn hóa ẩm thực", LESSONS.slice(0, 6)],
  ["III", "Cuisines as Cultural Case Studies — Các nền ẩm thực như tình huống văn hóa", LESSONS.slice(7, 14)],
  ["IV", "F&B in the 2026 Context — Trends & the New Food Culture", [LESSONS[6]]],
];

export default function Curriculum() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      {MODULES.map((m, i) => (
        <div key={i} style={{ borderBottom: "1px solid rgba(168,136,78,0.35)" }}>
          <div
            onClick={() => setOpen(open === i ? -1 : i)}
            style={{ display: "flex", alignItems: "baseline", gap: 20, padding: "26px 0", cursor: "pointer" }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, color: "#C9A24A", minWidth: 36 }}>{m[0]}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, flex: 1, color: "#FBF8F4" }}>{m[1]}</span>
            <span style={{ fontSize: 20, color: "#96A8A1" }}>{open === i ? "−" : "+"}</span>
          </div>
          {open === i && (
            <div data-m="lessonpad" style={{ padding: "0 0 26px 56px", display: "flex", flexDirection: "column", gap: 10 }}>
              {m[2].map((l) => (
                <div key={l[0]} style={{ display: "flex", gap: 16, alignItems: "baseline", padding: "10px 0", borderBottom: "1px solid rgba(168,136,78,0.18)" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: "#C9A24A", minWidth: 22 }}>{l[0]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15.5, fontWeight: 600, color: "#FBF8F4" }}>{l[1]}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, color: "#D5DFDA", marginTop: 4 }}>
                      <span style={{ color: "#C9A24A", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>You learn · Bạn học </span>
                      {l[2]}
                    </div>
                    <div style={{ fontSize: 12.5, color: "#96A8A1", marginTop: 3 }}>
                      <span style={{ color: "#C9A24A", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>Case study </span>
                      {l[3]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
