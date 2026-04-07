import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../Redux Toolkit/Store";

const DELAY = 5500;

const MainCarousel: React.FC = () => {
  const { homePage } = useAppSelector((s) => s);
  const navigate = useNavigate();

  const slides = useMemo(() => {
    if (homePage.homePageData?.heroSlides?.length) {
      return homePage.homePageData.heroSlides.map((item, idx) => ({
        id: item.id || idx,
        badge: item.badgeText || "Featured",
        title: item.title || "Shop the best picks",
        subtitle: item.subtitle || "",
        desc: item.description || "",
        cta: item.buttonText || "Shop Now",
        ctaSecondary: "Learn more",
        tag: item.categoryId || item.redirectLink || "",
        img: item.imageUrl,
        bg: "#f5f6f8",
        accent: "#FF9900",
        accentDark: "#c96b00",
        textDark: "#0F1111",
        pill: item.badgeText || "FEATURED",
        link: item.buttonLink || item.redirectLink || "#",
      }));
    }
    return [
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
        link: "#",
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
        link: "#",
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
        link: "#",
      },
    ];
  }, [homePage.homePageData?.heroSlides]);

  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (idx: number, direction: 1 | -1 = 1) => {
      setPrev(cur);
      setDir(direction);
      setCur(idx);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(
        () => setCur((c) => {
          setPrev(c);
          setDir(1);
          return (c + 1) % slides.length;
        }),
        DELAY
      );
    },
    [cur, slides.length]
  );

  useEffect(() => {
    timerRef.current = setInterval(
      () => setCur((c) => {
        setPrev(c);
        setDir(1);
        return (c + 1) % slides.length;
      }),
      DELAY
    );
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [slides.length]);

  const s = slides[cur];

  const handlePrimaryClick = () => {
    if (s.link && s.link.startsWith("/")) navigate(s.link);
  };

  return (
    <>
      <style>{`
        .amz-carousel * { box-sizing: border-box; }
        @keyframes amzFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes amzImgIn { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: scale(1); } }
        @keyframes amzProg { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .amz-text-enter { animation: amzFadeIn 0.45s ease both; }
        .amz-img-enter { animation: amzImgIn 0.6s ease both; }
        .amz-prog-bar  { animation: amzProg ${DELAY}ms linear forwards; transform-origin: left; }
        .amz-cta-primary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 22px; border-radius: 20px;
          font-size: 13px; font-weight: 700; cursor: pointer; border: none;
          transition: all 0.18s ease; font-family: system-ui, sans-serif;
        }
        .amz-cta-primary:hover { filter: brightness(0.92); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.18); }
        .amz-cta-secondary { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; cursor: pointer; background: none; border: none; }
        .amz-nav-btn { position: absolute; top: 50%; transform: translateY(-50%); z-index: 20; width: 40px; height: 72px; border: none; cursor: pointer; display: flex; align-items: center; justifyContent: center; transition: all 0.2s ease; font-size: 22px; font-weight: 300; }
        .amz-dot { border: none; padding: 0; cursor: pointer; border-radius: 50%; transition: all 0.25s ease; }
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
            <div className="amz-text-enter" style={{ marginBottom: 12 }}>
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
            <h2
              className="amz-text-enter amz-title"
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
            <p
              className="amz-text-enter"
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
            <p
              className="amz-text-enter"
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "clamp(12px, 1.2vw, 14px)",
                color: "#565959",
                lineHeight: 1.6,
                margin: "0 0 20px",
                maxWidth: 420,
              }}
            >
              {s.desc}
            </p>
            <div className="amz-text-enter" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <button
                onClick={handlePrimaryClick}
                className="amz-cta-primary"
                style={{
                  background: `linear-gradient(180deg, ${s.accent} 0%, ${s.accentDark} 100%)`,
                  color: "#fff",
                  boxShadow: `0 2px 8px ${s.accent}55`,
                }}
              >
                {s.cta} →
              </button>
              <button className="amz-cta-secondary" style={{ color: s.accent }}>
                {s.ctaSecondary} ›
              </button>
            </div>
            <div className="amz-text-enter" style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: s.accent,
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 11, color: "#565959", fontFamily: "system-ui, sans-serif" }}>
                {s.tag}
              </span>
            </div>
          </div>

          <div className="amz-img-col" style={{ flex: 1, position: "relative", overflow: "hidden" }}>
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
          <div key={`prog-${cur}`} className="amz-prog-bar" style={{ height: "100%", background: s.accent }} />
        </div>
      </section>
    </>
  );
};

export default MainCarousel;
