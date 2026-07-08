import SiteNav from "../_components/SiteNav";
import SiteFooter from "../_components/SiteFooter";
import { createAdminClient } from "@/lib/supabase/admin";
import BookingForm, { type PublicSlot } from "./BookingForm";

export const metadata = {
  title: "Đặt lịch hẹn · Book an appointment · F&B-FCA",
  description: "Đặt lịch hẹn tư vấn, giờ trực hoặc phỏng vấn với giảng viên F&B-FCA. Book an appointment with F&B-FCA.",
};
export const dynamic = "force-dynamic";

const DISPLAY = "var(--font-display)";

export default async function BookingPage() {
  const admin = createAdminClient();
  const nowISO = new Date().toISOString();
  const { data } = await admin
    .from("availability_slots")
    .select("id, starts_at, ends_at, location")
    .eq("is_booked", false)
    .gte("starts_at", nowISO)
    .order("starts_at");

  const slots = (data || []) as PublicSlot[];

  return (
    <div style={{ background: "#102B2A", color: "#FBF8F4", fontFamily: "var(--font-body)", minHeight: "100vh" }}>
      <SiteNav />
      <header style={{ background: "#042726", borderBottom: "1px solid rgba(168,136,78,0.4)" }}>
        <div data-m="pad" style={{ maxWidth: 760, margin: "0 auto", padding: "64px 32px 48px" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.3em", color: "#C9A24A", textTransform: "uppercase", marginBottom: 18 }}>Đặt lịch · Book an appointment</p>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(32px,5vw,52px)", lineHeight: 1.1, margin: 0 }}>
            Đặt lịch gặp giảng viên
          </h1>
          <p style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 20, color: "#C9A24A", marginTop: 10 }}>
            Book a session with our instructors
          </p>
        </div>
      </header>

      <main data-m="pad" style={{ maxWidth: 760, margin: "0 auto", padding: "40px 32px 80px" }}>
        <BookingForm slots={slots} />
      </main>

      <SiteFooter />
    </div>
  );
}
