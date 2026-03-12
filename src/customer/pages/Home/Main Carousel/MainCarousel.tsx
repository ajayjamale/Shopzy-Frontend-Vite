import React, { useState, useEffect, useRef, useCallback } from "react";

const slides = [
  {
    id: 1,
    badge: "Limited Time Deal",
    title: "Up to 60% off",
    subtitle: "Summer Fashion",
    desc: "Top brands. Fresh styles. Free delivery on orders over ₹499.",
    cta: "Shop Now",
    ctaSecondary: "See all deals",
    tag: "Ends in 12 hrs",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=90&fit=crop",
    bg: "#FEF9EC",
    accent: "#FF9900",
    accentDark: "#E47911",
    textDark: "#0F1111",
    pill: "DEAL OF THE DAY",
  },
  {
    id: 2,
    badge: "New Arrival",
    title: "Smart Home Devices",
    subtitle: "Echo & Fire TV",
    desc: "Control your home with your voice. Starting at just ₹2,999.",
    cta: "Explore Devices",
    ctaSecondary: "Learn more",
    tag: "Free setup included",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=90&fit=crop",
    bg: "#EBF5FB",
    accent: "#0066C0",
    accentDark: "#004B8D",
    textDark: "#0F1111",
    pill: "NEW LAUNCH",
  },
  {
    id: 3,
    badge: "Best Seller",
    title: "Premium Audio",
    subtitle: "Headphones & Earbuds",
    desc: "Noise cancellation. Studio-grade sound. Ships in 24 hours.",
    cta: "Shop Audio",
    ctaSecondary: "Compare models",
    tag: "Free returns",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&q=90&fit=crop",
    bg: "#F0F4F0",
    accent: "#007600",
    accentDark: "#005A00",
    textDark: "#0F1111",
    pill: "TOP RATED",
  },
  {
    id: 4,
    badge: "Fresh Collection",
    title: "Home & Kitchen",
    subtitle: "Refresh Your Space",
    desc: "Thousands of products to transform every room. Prime eligible.",
    cta: "Shop Home",
    ctaSecondary: "View lookbook",
    tag: "Prime delivery",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=90&fit=crop",
    bg: "#FDF2F8",
    accent: "#C7511F",
    accentDark: "#A84010",
    textDark: "#0F1111",
    pill: "TRENDING",
  },
];

const DELAY = 5500;

const MainCarousel: React.FC = () => {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((idx: number, direction: 1 | -1 = 1) => {
    setPrev(cur);
    setDir(direction);
    setCur(idx);
    clearInterval(timerRef.current!);
    timerRef.current = setInterval(
      () => setCur((c) => { setPrev(c); setDir(1); return (c + 1) % slides.length; }),
      DELAY
    );
  }, [cur]);

  useEffect(() => {
    timerRef.current = setInterval(
      () => setCur((c) => { setPrev(c); setDir(1); return (c + 1) % slides.length; }),
      DELAY
    );
    return () => clearInterval(timerRef.current!);
  }, []);

  const s = slides[cur];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amazon+Ember:wght@400;700&family=Bookman+Old+Style:wght@700&display=swap');

        .amz-carousel * { box-sizing: border-box; }

        @keyframes amzFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes amzImgIn {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes amzProg {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes amzPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }

        .amz-text-enter { animation: amzFadeIn 0.45s ease both; }
        .amz-text-1 { animation-delay: 0.05s; }
        .amz-text-2 { animation-delay: 0.15s; }
        .amz-text-3 { animation-delay: 0.25s; }
        .amz-text-4 { animation-delay: 0.35s; }
        .amz-text-5 { animation-delay: 0.45s; }
        .amz-img-enter { animation: amzImgIn 0.6s ease both; }
        .amz-prog-bar  { animation: amzProg ${DELAY}ms linear forwards; transform-origin: left; }
        .amz-badge-pulse { animation: amzPulse 2s ease-in-out infinite; }

        .amz-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 22px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.01em;
          cursor: pointer;
          border: none;
          transition: all 0.18s ease;
          font-family: system-ui, sans-serif;
        }
        .amz-cta-primary:hover { filter: brightness(0.92); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.18); }
        .amz-cta-primary:active { transform: translateY(0); }

        .amz-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          background: none;
          border: none;
          text-decoration: none;
          transition: gap 0.15s ease;
          font-family: system-ui, sans-serif;
          padding: 0;
        }
        .amz-cta-secondary:hover { gap: 8px; }

        .amz-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          width: 40px;
          height: 72px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          font-size: 22px;
          font-weight: 300;
        }
        .amz-nav-btn:hover { width: 46px; }

        .amz-dot {
          border: none;
          padding: 0;
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.25s ease;
        }

        .amz-rating-star { color: #FF9900; font-size: 13px; }

        @media (max-width: 768px) {
          .amz-content-grid { flex-direction: column !important; }
          .amz-text-col { max-width: 100% !important; padding: clamp(20px, 5vw, 40px) !important; }
          .amz-img-col { height: 220px !important; }
          .amz-title { font-size: clamp(26px, 7vw, 40px) !important; }
        }
      `}</style>

      <section
        className="amz-carousel"
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(300px, 45vw, 560px)",
          overflow: "hidden",
          background: s.bg,
          transition: "background 0.5s ease",
          zIndex: 1,
        }}
      >
        {/* ── Slide layers ── */}
        {slides.map((sl, i) => (
          <div
            key={sl.id}
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === cur ? 1 : 0,
              transition: "opacity 0.5s ease",
              zIndex: i === cur ? 2 : 1,
              background: sl.bg,
            }}
          />
        ))}

        {/* ── Main content grid ── */}
        <div
          key={`content-${cur}`}
          className="amz-content-grid"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "stretch",
          }}
        >
          {/* Left: Text column */}
          <div
            className="amz-text-col"
            style={{
              flex: "0 0 clamp(280px, 42%, 520px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(24px, 5vw, 64px) clamp(20px, 4vw, 56px)",
              position: "relative",
            }}
          >
            {/* Pill badge */}
            <div
              className="amz-text-enter amz-text-1"
              style={{ marginBottom: 12 }}
            >
              <span
                style={{
                  display: "inline-block",
                  background: s.accent,
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  padding: "3px 10px",
                  borderRadius: 3,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {s.pill}
              </span>
            </div>

            {/* Main title */}
            <h2
              className="amz-text-enter amz-text-2 amz-title"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 700,
                color: s.textDark,
                margin: "0 0 4px",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {s.title}
            </h2>

            {/* Subtitle */}
            <p
              className="amz-text-enter amz-text-3"
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "clamp(15px, 1.8vw, 20px)",
                fontWeight: 400,
                color: s.accent,
                margin: "0 0 12px",
                letterSpacing: "-0.01em",
              }}
            >
              {s.subtitle}
            </p>

            {/* Stars + tag */}
            <div
              className="amz-text-enter amz-text-3"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <span>
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="amz-rating-star">{star}</span>
                ))}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#565959",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                4.8 · 12,400+ ratings
              </span>
            </div>

            {/* Description */}
            <p
              className="amz-text-enter amz-text-4"
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "clamp(12px, 1.2vw, 14px)",
                color: "#565959",
                lineHeight: 1.6,
                margin: "0 0 20px",
                maxWidth: 380,
              }}
            >
              {s.desc}
            </p>

            {/* CTAs */}
            <div
              className="amz-text-enter amz-text-5"
              style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}
            >
              <button
                className="amz-cta-primary"
                style={{
                  background: `linear-gradient(180deg, ${s.accent} 0%, ${s.accentDark} 100%)`,
                  color: "#fff",
                  boxShadow: `0 2px 8px ${s.accent}55`,
                }}
              >
                {s.cta} →
              </button>
              <button
                className="amz-cta-secondary"
                style={{ color: s.accent }}
              >
                {s.ctaSecondary} ›
              </button>
            </div>

            {/* Tag strip */}
            <div
              className="amz-text-enter amz-text-5"
              style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 6 }}
            >
              <span
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: s.accent,
                  display: "inline-block",
                }}
                className="amz-badge-pulse"
              />
              <span
                style={{
                  fontSize: 11,
                  color: "#565959",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {s.tag}
              </span>
            </div>
          </div>

          {/* Right: Image column */}
          <div
            className="amz-img-col"
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Soft left fade to blend with text */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "30%",
                background: `linear-gradient(to right, ${s.bg}, transparent)`,
                zIndex: 2,
              }}
            />
            <img
              key={`img-${cur}`}
              src={s.img}
              alt={s.title}
              className="amz-img-enter"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            {/* Badge overlay on image */}
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 3,
                background: s.accent,
                color: "#fff",
                fontFamily: "system-ui, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                padding: "6px 12px",
                borderRadius: 4,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {s.badge}
            </div>
          </div>
        </div>

        {/* ── Left nav arrow ── */}
        <button
          className="amz-nav-btn"
          onClick={() => go((cur - 1 + slides.length) % slides.length, -1)}
          style={{
            left: 0,
            background: "rgba(255,255,255,0.85)",
            color: s.textDark,
            borderRadius: "0 6px 6px 0",
            boxShadow: "2px 0 8px rgba(0,0,0,0.12)",
          }}
        >
          ‹
        </button>

        {/* ── Right nav arrow ── */}
        <button
          className="amz-nav-btn"
          onClick={() => go((cur + 1) % slides.length, 1)}
          style={{
            right: 0,
            background: "rgba(255,255,255,0.85)",
            color: s.textDark,
            borderRadius: "6px 0 0 6px",
            boxShadow: "-2px 0 8px rgba(0,0,0,0.12)",
          }}
        >
          ›
        </button>

        {/* ── Dot indicators ── */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              className="amz-dot"
              onClick={() => go(i)}
              style={{
                width: i === cur ? 20 : 7,
                height: 7,
                background: i === cur ? s.accent : "rgba(0,0,0,0.2)",
              }}
            />
          ))}
        </div>

        {/* ── Slide counter ── */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            right: 56,
            zIndex: 20,
            fontFamily: "system-ui, sans-serif",
            fontSize: 10,
            color: "#565959",
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          {cur + 1} / {slides.length}
        </div>

        {/* ── Progress bar ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "rgba(0,0,0,0.07)",
            zIndex: 20,
          }}
        >
          <div
            key={`prog-${cur}`}
            className="amz-prog-bar"
            style={{ height: "100%", background: s.accent }}
          />
        </div>
      </section>
    </>
  );
};

export default MainCarousel;