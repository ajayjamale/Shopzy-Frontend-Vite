import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { HomePageContent } from "../../../../types/homeContentTypes";
import { toCatalogPath } from "../../../../utils/catalogRoute";

type DiscountItem = {
  id: string;
  title: string;
  subtitle: string;
  discountText: string;
  image: string;
  target: string;
};

const fallback: DiscountItem[] = [
  {
    id: "deal-fashion",
    title: "Fashion Picks",
    subtitle: "Today only",
    discountText: "35% OFF",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=80&fit=crop",
    target: "women",
  },
  {
    id: "deal-tech",
    title: "Audio Upgrades",
    subtitle: "Limited stock",
    discountText: "42% OFF",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80&fit=crop",
    target: "headphones_headsets",
  },
  {
    id: "deal-home",
    title: "Home Decor",
    subtitle: "Special markdown",
    discountText: "28% OFF",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1000&q=80&fit=crop",
    target: "home_decor",
  },
];

const resolveTarget = (target: string) => toCatalogPath(target);

const DailyDiscountSection = ({ data }: { data: HomePageContent | null }) => {
  const navigate = useNavigate();

  const items = useMemo<DiscountItem[]>(() => {
    const source = data?.dailyDiscounts || [];
    if (!source.length) return fallback;

    return source
      .filter((item) => item && item.active !== false)
      .map((item, index) => {
        const value = Number(item.discountPercent);
        return {
          id: `${item.id || index}`,
          title: (item.title || "Daily Deal").split("_").join(" "),
          subtitle: item.subtitle || "Today only",
          discountText:
            item.discountLabel || (Number.isFinite(value) && value > 0 ? `${Math.round(value)}% OFF` : "HOT DEAL"),
          image: item.imageUrl || fallback[0].image,
          target: item.redirectLink || "/catalog",
        };
      })
      .slice(0, 8);
  }, [data?.dailyDiscounts]);

  if (!items.length) return null;

  const lead = items[0];
  const grid = items.slice(1, 7);

  return (
    <section className="app-container" style={{ marginTop: 34 }}>
      <style>
        {`
          @keyframes pulseDiscount {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: .78; transform: scale(1.03); }
          }
        `}
      </style>
      <div
        className="surface"
        style={{
          padding: "clamp(18px,2.8vw,30px)",
          background: "linear-gradient(145deg, #FFFFFF 0%, #FFF7ED 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p className="section-kicker" style={{ marginBottom: 8, color: "#C2410C" }}>Price Drops</p>
            <h2 className="section-title" style={{ fontSize: "clamp(1.35rem,2.9vw,2rem)" }}>Daily Discounts</h2>
            <p style={{ marginTop: 6, color: "#7C2D12", fontSize: 13 }}>
              Fresh discount cards synced from backend each day.
            </p>
          </div>
          <button className="btn-secondary" onClick={() => navigate(toCatalogPath())}>
            Explore All Offers
          </button>
        </div>

        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)",
            gap: 14,
          }}
          className="max-[930px]:grid-cols-1"
        >
          <button
            onClick={() => navigate(resolveTarget(lead.target))}
            style={{
              borderRadius: 18,
              border: "1px solid #F3C99D",
              background: "#7C2D12",
              overflow: "hidden",
              textAlign: "left",
              padding: 0,
              cursor: "pointer",
              position: "relative",
              minHeight: 280,
            }}
          >
            <img
              src={lead.image}
              alt={lead.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(130deg, rgba(124,45,18,.74), rgba(194,65,12,.32))",
              }}
            />
            <div style={{ position: "relative", zIndex: 1, padding: 22, minHeight: 280, display: "grid", alignContent: "space-between" }}>
              <span
                style={{
                  width: "fit-content",
                  padding: "7px 12px",
                  borderRadius: 999,
                  background: "#FEF3C7",
                  border: "1px solid #FCD34D",
                  color: "#7C2D12",
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  animation: "pulseDiscount 1.05s ease-in-out infinite",
                }}
              >
                {lead.discountText}
              </span>
              <div>
                <h3 style={{ color: "#fff", fontSize: "clamp(1.3rem,2.3vw,1.9rem)", textTransform: "capitalize" }}>
                  {lead.title}
                </h3>
                <p style={{ color: "#FDE6DA", marginTop: 6 }}>{lead.subtitle}</p>
              </div>
            </div>
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
            {grid.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(resolveTarget(item.target))}
                style={{
                  borderRadius: 14,
                  border: "1px solid #F4D8BA",
                  background: "#fff",
                  overflow: "hidden",
                  textAlign: "left",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    aspectRatio: "4/3",
                    overflow: "hidden",
                    background: "linear-gradient(165deg,#FFF8F1 0%,#FFF1E5 100%)",
                    padding: 8,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: 9,
                      background: "#fff",
                    }}
                  />
                </div>
                <div style={{ padding: "10px 11px 12px" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#9A3412" }}>{item.discountText}</p>
                  <p style={{ marginTop: 2, fontSize: 13, color: "#0F172A", fontWeight: 700, textTransform: "capitalize" }}>
                    {item.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyDiscountSection;
