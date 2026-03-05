import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../Redux Toolkit/Store";

const fallbackDeals = [
  { category:{ categoryId:"women_indian_and_fusion_wear", image:"https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/22866694/2023/4/24/98951db4-e0a5-47f8-a1be-353863d24dc01682349679664KaliniOrangeSilkBlendEthnicWovenDesignFestiveSareewithMatchi2.jpg" }, discount:40 },
  { category:{ categoryId:"men_topwear",                  image:"https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/23029834/2023/9/18/96c015ae-1090-4036-954b-d9c80085b1d71695022844653-HRX-by-Hrithik-Roshan-Men-Jackets-6981695022843934-1.jpg" }, discount:35 },
  { category:{ categoryId:"women_footwear",               image:"https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28024048/2024/3/5/fca98389-f9d6-4f19-b82a-53c7ee0518ec1709633175836CORSICABlockSandalswithBows1.jpg" }, discount:50 },
  { category:{ categoryId:"home_decor",                   image:"https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28460938/2024/3/22/7fb09e9c-86e0-4602-b54e-fa5c0171b50b1711104156746IrregularMirrorHomeDecor1.jpg" }, discount:30 },
  { category:{ categoryId:"headphones_headsets",          image:"https://rukminim2.flixcart.com/image/612/612/kz4gh3k0/headphone/c/v/r/-original-imagb7bmhdgghzxq.jpeg?q=70" }, discount:45 },
  { category:{ categoryId:"men_bottomwear",               image:"https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/20122324/2022/9/22/91c61c45-fe17-4d1d-8e20-0aaaf90186b61663827920015RaymondSlimFitBlueJeansForMen1.jpg" }, discount:25 },
  { category:{ categoryId:"women_western_wear",           image:"https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/22391504/2023/3/17/3259c109-060a-4c39-aba2-e9d32e2068e41679049035856StyleQuotientPeach-ColouredTie-UpNeckPuffSleeveCottonTop1.jpg" }, discount:55 },
  { category:{ categoryId:"bed_linen_furnishing",         image:"https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/19284508/2022/7/28/92df52de-27dc-4d72-8ab4-fee2c82c85081659003977664DreamscapeUnisexPinkBedsheets1.jpg" }, discount:38 },
];

const DealCardLight: React.FC<{ deal: any }> = ({ deal }) => {
  const navigate = useNavigate();
  const label = deal.category.categoryId.split("_").join(" ");
  return (
    <div
      onClick={() => navigate(`/products/${deal.category.categoryId}`)}
      style={{
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid #f1f5f9",
        background: "#fff",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-5px)";
        el.style.boxShadow = "0 14px 32px rgba(0,0,0,0.08)";
        el.style.borderColor = "#C9A84C";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "none";
        el.style.boxShadow = "none";
        el.style.borderColor = "#f1f5f9";
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={deal.category.image}
          alt={label}
          style={{
            width: "100%",
            height: "clamp(140px, 17vw, 200px)",
            objectFit: "cover",
            objectPosition: "top",
            transition: "transform 0.5s ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.07)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")
          }
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "#C9A84C",
            color: "#1e293b",
            borderRadius: 6,
            padding: "4px 10px",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 13,
            textAlign: "center",
          }}
        >
          {deal.discount}%<br />
          <span style={{ fontSize: 8, letterSpacing: "0.06em" }}>OFF</span>
        </div>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#1e293b",
            textTransform: "capitalize",
            margin: "0 0 6px",
            fontFamily: "'Syne', sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </p>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#C9A84C",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Shop Now →
        </span>
      </div>
    </div>
  );
};

const Deals: React.FC = () => {
  const { homePage } = useAppSelector((s) => s);
  const deals = homePage.homePageData?.deals || fallbackDeals;
  const [t, setT] = useState({ h: 8, m: 24, s: 17 });

  useEffect(() => {
    const iv = setInterval(
      () =>
        setT((tl) => {
          let { h, m, s } = tl;
          s--;
          if (s < 0) {
            s = 59;
            m--;
          }
          if (m < 0) {
            m = 59;
            h--;
          }
          if (h < 0) h = 23;
          return { h, m, s };
        }),
      1000
    );
    return () => clearInterval(iv);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section style={{ padding: "clamp(40px,5.5vw,72px) 0" }}>
      <div style={{ padding: "0 clamp(16px,5.5vw,80px)" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: "clamp(24px,3.5vw,40px)",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: "#777",
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 1.5,
                  background: "#C9A84C",
                  display: "inline-block",
                }}
              />
              Limited Time Only
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(26px,3.8vw,52px)",
                fontWeight: 600,
                color: "#1a1612",
                letterSpacing: "-.02em",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              Today's Deals
            </h2>
          </div>
          {/* Countdown */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: "12px 20px",
            }}
          >
            {[
              ["Hrs", t.h],
              ["Min", t.m],
              ["Sec", t.s],
            ].map(([label, val], i) => (
              <div
                key={label as string}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(20px,2.8vw,32px)",
                      fontWeight: 700,
                      color: "#C9A84C",
                      lineHeight: 1,
                    }}
                  >
                    {pad(val as number)}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#64748b",
                      fontFamily: "'Syne', sans-serif",
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      marginTop: 2,
                    }}
                  >
                    {label as string}
                  </div>
                </div>
                {i < 2 && (
                  <span
                    style={{
                      fontSize: 22,
                      color: "#C9A84C",
                      opacity: 0.5,
                      marginBottom: 10,
                    }}
                  >
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "clamp(12px,1.8vw,20px)",
          }}
        >
          {deals.map((deal: any, i: number) => (
            <DealCardLight key={i} deal={deal} />
          ))}
        </div>

        {/* View All button */}
        <div
          style={{
            textAlign: "center",
            marginTop: "clamp(28px,3.5vw,44px)",
          }}
        >
          <button
            onClick={() => {}}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              borderRadius: 4,
              background: "#C9A84C",
              border: "1.5px solid #C9A84C",
              color: "#0D0D0D",
              fontFamily: "'Syne', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all .22s ease",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "transparent";
              b.style.color = "#C9A84C";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "#C9A84C";
              b.style.color = "#0D0D0D";
            }}
          >
            View All Deals →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Deals;