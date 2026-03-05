import React, { useState, useEffect, useRef, useCallback } from "react";

const slides = [
  {
    id: 1,
    tag: "New Season",
    name: "Summer\nEssentials",
    sub: "Light fabrics. Effortless silhouettes. Made for the warmth ahead.",
    cta: "Explore Collection",
    accent: "#C9A84C",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85&fit=crop",
  },
  {
    id: 2,
    tag: "Women's Edit",
    name: "Saree\nCouture",
    sub: "Handwoven stories draped in timeless Indian craft.",
    cta: "Shop The Edit",
    accent: "#D4896A",
    img: "https://www.ethnicplus.in/cdn/shop/files/5_0b7f45e4-22aa-435b-80e7-bd7d0e5d991f.jpg?v=1768755964&width=1770",
  },
  {
    id: 3,
    tag: "Tech Picks",
    name: "Premium\nAudio",
    sub: "Engineered silence. For those who hear the difference.",
    cta: "Discover Now",
    accent: "#7BAF9E",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&q=85&fit=crop",
  },
  {
    id: 4,
    tag: "Everyday Luxury",
    name: "Kurta\nCollection",
    sub: "Effortless elegance from morning to evening.",
    cta: "View All",
    accent: "#9B7EC8",
    img: "https://www.ethnicplus.in/cdn/shop/files/4_2f2042d1-33c3-4f2c-8397-472e103fefb0.jpg?v=1768755972&width=1770",
  },
];

const DELAY = 5200;

const MainCarousel: React.FC = () => {
  const [cur, setCur] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((idx: number) => {
    setCur(idx);
    clearInterval(timerRef.current!);
    timerRef.current = setInterval(
      () => setCur((c) => (c + 1) % slides.length),
      DELAY,
    );
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(
      () => setCur((c) => (c + 1) % slides.length),
      DELAY,
    );
    return () => clearInterval(timerRef.current!);
  }, []);

  const s = slides[cur];

  return (
    <>
      <style>{`
        @keyframes mcZoom{from{transform:scale(1.08)}to{transform:scale(1)}}
        @keyframes mcFadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes mcProg{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        .mc-zoom{animation:mcZoom 7s ease forwards}
        .mc-a1{animation:mcFadeUp .55s .06s ease both}
        .mc-a2{animation:mcFadeUp .55s .2s  ease both}
        .mc-a3{animation:mcFadeUp .55s .34s ease both}
        .mc-a4{animation:mcFadeUp .55s .48s ease both}
        .mc-prog{animation:mcProg ${DELAY}ms linear forwards;transform-origin:left}
      `}</style>
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(380px,58vw,720px)",
          overflow: "hidden",
          background: "#080C14",
        }}
      >
        {slides.map((sl, i) => (
          <div
            key={sl.id}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: i === cur ? 2 : 1,
              opacity: i === cur ? 1 : 0,
              transition: "opacity 1s ease",
            }}
          >
            <img
              src={sl.img}
              alt={sl.name}
              className={i === cur ? "mc-zoom" : ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(105deg,rgba(8,12,20,.92) 0%,rgba(8,12,20,.5) 40%,transparent 68%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(0deg,rgba(8,12,20,.65) 0%,transparent 42%)",
              }}
            />
          </div>
        ))}
        <div
          key={cur}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(20px,6vw,100px) clamp(20px,7vw,100px)",
            maxWidth: "clamp(320px,55vw,680px)",
          }}
        >
          <div
            className="mc-a1"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 24,
                height: 1.5,
                background: s.accent,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: ".2em",
                textTransform: "uppercase" as const,
                color: s.accent,
              }}
            >
              {s.tag}
            </span>
          </div>
          <h1
            className="mc-a2"
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "clamp(32px,7vw,88px)",
              fontWeight: 700,
              lineHeight: 1.0,
              color: "#FAFAF8",
              margin: "0 0 16px",
              whiteSpace: "pre-line" as const,
              letterSpacing: "-.02em",
            }}
          >
            {s.name}
          </h1>
          <p
            className="mc-a3"
            style={{
              fontSize: "clamp(13px,1.4vw,16px)",
              fontWeight: 300,
              color: "rgba(250,250,248,.62)",
              lineHeight: 1.75,
              maxWidth: 440,
              margin: "0 0 34px",
            }}
          >
            {s.sub}
          </p>
          <div className="mc-a4">
            <button
              style={{
                padding: "clamp(11px,1.4vw,14px) clamp(22px,2.8vw,32px)",
                background: s.accent,
                border: `1.5px solid ${s.accent}`,
                borderRadius: 4,
                color: "#0D0D0D",
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: ".1em",
                textTransform: "uppercase" as const,
                cursor: "pointer",
                transition: "all .22s ease",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "transparent";
                b.style.color = s.accent;
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = s.accent;
                b.style.color = "#0D0D0D";
              }}
            >
              {s.cta} →
            </button>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: "clamp(18px,3vw,32px)",
            right: "clamp(18px,3.5vw,48px)",
            zIndex: 20,
            fontFamily: "'Playfair Display',serif",
            display: "flex",
            alignItems: "baseline",
            gap: 2,
          }}
        >
          <span
            style={{
              fontSize: "clamp(20px,2.8vw,34px)",
              fontWeight: 400,
              color: "#FAFAF8",
              opacity: 0.85,
            }}
          >
            {String(cur + 1).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>
            /{String(slides.length).padStart(2, "0")}
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "clamp(20px,3vw,36px)",
            left: "clamp(20px,7vw,100px)",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{
                width: i === cur ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: i === cur ? s.accent : "rgba(255,255,255,.25)",
                border: "none",
                padding: 0,
                transition: "all .3s cubic-bezier(.4,0,.2,1)",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            onClick={() => go((cur + dir + slides.length) % slides.length)}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              [dir === -1 ? "left" : "right"]: "clamp(10px,2vw,28px)",
              zIndex: 20,
              width: "clamp(36px,4.5vw,54px)",
              height: "clamp(36px,4.5vw,54px)",
              borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,.2)",
              background: "rgba(8,12,20,.4)",
              backdropFilter: "blur(12px)",
              color: "#fff",
              fontSize: "clamp(16px,2vw,24px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "rgba(201,168,76,.25)";
              b.style.borderColor = "#C9A84C";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "rgba(8,12,20,.4)";
              b.style.borderColor = "rgba(255,255,255,.2)";
            }}
          >
            {dir === -1 ? "‹" : "›"}
          </button>
        ))}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2.5,
            background: "rgba(255,255,255,.07)",
            zIndex: 20,
          }}
        >
          <div
            key={`pb-${cur}`}
            className="mc-prog"
            style={{ height: "100%", background: s.accent }}
          />
        </div>
      </section>
    </>
  );
};

export default MainCarousel;
