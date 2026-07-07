import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../_components/SiteNav";
import SiteFooter from "../../_components/SiteFooter";
import { POSTS, getPost } from "../../_data/blog";

const DISPLAY = "var(--font-display)";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://fnu-vatel.vercel.app";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

// SEO chuẩn Yoast: title, description, canonical, Open Graph, Twitter, keyword
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Không tìm thấy bài viết" };
  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: post.seoTitle,
    description: post.metaDescription,
    keywords: [post.focusKeyword],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.seoTitle,
      description: post.metaDescription,
      url,
      publishedTime: post.date,
      images: [{ url: post.cover, alt: post.coverAlt }],
      siteName: "Food Culture & Aesthetic",
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.metaDescription,
      images: [post.cover],
    },
  };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle,
    description: post.metaDescription,
    image: post.cover,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.focusKeyword,
    inLanguage: "vi-VN",
    author: { "@type": "Organization", name: "Food Culture & Aesthetic" },
    publisher: {
      "@type": "Organization",
      name: "Food Culture & Aesthetic",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${post.slug}` },
  };

  return (
    <div style={{ background: "#102B2A", color: "#FBF8F4", fontFamily: "var(--font-body)", minHeight: "100vh" }}>
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        {/* Tiêu đề */}
        <header data-m="pad" style={{ maxWidth: 800, margin: "0 auto", padding: "72px 32px 28px" }}>
          <Link href="/blog" className="l-ul" style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#96A8A1" }}>← Blog · Tin tức</Link>
          <div style={{ marginTop: 20, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9A24A" }}>
            <time dateTime={post.date}>{fmtDate(post.date)}</time> · {post.readMins} phút đọc
          </div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(32px,4.4vw,52px)", lineHeight: 1.12, margin: "12px 0 8px" }}>{post.titleVi}</h1>
          <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 20, color: "#C9A24A" }}>{post.titleEn}</div>
        </header>

        {/* Ảnh bìa */}
        <div data-m="pad" style={{ maxWidth: 960, margin: "0 auto", padding: "8px 32px 8px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover} alt={post.coverAlt} style={{ width: "100%", borderRadius: 14, border: "1px solid rgba(168,136,78,0.3)", display: "block" }} />
        </div>

        {/* Nội dung song ngữ */}
        <div data-m="pad" style={{ maxWidth: 720, margin: "0 auto", padding: "36px 32px 20px" }}>
          <p style={{ fontSize: 18, lineHeight: 1.75, color: "#EDE7DC", fontStyle: "italic", margin: "0 0 30px" }}>{post.excerptVi}</p>
          {post.content.map((b, i) =>
            b.type === "h2" ? (
              <div key={i} style={{ margin: "34px 0 12px" }}>
                <h2 style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 600, margin: 0, lineHeight: 1.2 }}>{b.vi}</h2>
                <div style={{ fontSize: 14, fontStyle: "italic", color: "#C9A24A", marginTop: 2 }}>{b.en}</div>
              </div>
            ) : (
              <div key={i} style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 16.5, lineHeight: 1.8, color: "#D5DFDA", margin: "0 0 6px" }}>{b.vi}</p>
                <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "#8f9d96", margin: 0 }}>{b.en}</p>
              </div>
            ),
          )}
        </div>

        {/* CTA */}
        <div data-m="pad" style={{ maxWidth: 720, margin: "0 auto", padding: "24px 32px 80px" }}>
          <div style={{ borderTop: "1px solid rgba(168,136,78,0.35)", paddingTop: 28, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: DISPLAY, fontSize: 20, color: "#FBF8F4" }}>Quan tâm học phần? · Interested?</span>
            <a href="/#enroll" className="l-gold" style={{ background: "#A8884E", color: "#042726", padding: "13px 28px", borderRadius: 8, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>Ghi danh · Enroll</a>
          </div>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
