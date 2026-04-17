import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { HomePageContent } from "../../../../types/homeContentTypes";
import { toCatalogPath } from "../../../../utils/catalogRoute";

type TechItem = {
  id: string;
  title: string;
  image: string;
  target: string;
  badge: string;
};

const fallback: TechItem[] = [
  {
    id: "mobiles",
    title: "Mobiles",
    image: "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/5/t/j/edge-50-fusion-pb300002in-motorola-original-imahywzrfagkuyxx.jpeg?q=70",
    target: "mobiles",
    badge: "Top Rated",
  },
  {
    id: "laptops",
    title: "Laptops",
    image: "https://rukminim2.flixcart.com/image/312/312/xif0q/computer/x/9/j/-original-imahyjzh7m2zsqdg.jpeg?q=70",
    target: "laptops",
    badge: "Work + Play",
  },
  {
    id: "audio",
    title: "Audio",
    image: "https://rukminim2.flixcart.com/image/612/612/kz4gh3k0/headphone/c/v/r/-original-imagb7bmhdgghzxq.jpeg?q=70",
    target: "headphones_headsets",
    badge: "Best Sound",
  },
  {
    id: "wearables",
    title: "Wearables",
    image: "https://rukminim2.flixcart.com/image/612/612/xif0q/smartwatch/f/g/g/-original-imagywnz46fngcks.jpeg?q=70",
    target: "smart_watches",
    badge: "Fitness",
  },
  {
    id: "tv",
    title: "TV & Streaming",
    image: "https://rukminim2.flixcart.com/image/312/312/xif0q/television/9/p/9/-original-imah2v29z86u7b79.jpeg?q=70",
    target: "television",
    badge: "Cinema Mode",
  },
];

const resolveTarget = (target: string) => toCatalogPath(target);

const TechFeatureRail = ({ data }: { data: HomePageContent | null }) => {
  const navigate = useNavigate();

  const items = useMemo<TechItem[]>(() => {
    const source = data?.electronics || [];
    if (!source.length) return fallback;
    return source.map((item, index) => ({
      id: `${item.id || index}`,
      title: (item.title || item.subtitle || "Tech").split("_").join(" "),
      image: item.imageUrl || fallback[0].image,
      target: item.redirectLink || item.categoryId || "electronics",
      badge: item.badgeText || "Trending",
    }));
  }, [data?.electronics]);

  if (!items.length) return null;

  return (
    <section className="app-container" style={{ marginTop: 34 }}>
      <div
        className="surface"
        style={{
          padding: "clamp(18px,2.6vw,28px)",
          background: "linear-gradient(160deg, #FFFFFF 0%, #F4FAFB 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p className="section-kicker" style={{ marginBottom: 8 }}>Tech Focus</p>
            <h2 className="section-title" style={{ fontSize: "clamp(1.3rem,2.8vw,1.9rem)" }}>
              Electronics Strip
            </h2>
          </div>
          <button className="btn-secondary" onClick={() => navigate(toCatalogPath("electronics"))}>
            Browse All Electronics
          </button>
        </div>

        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "minmax(180px, 1fr)",
            gap: 12,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(resolveTarget(item.target))}
              style={{
                borderRadius: 14,
                border: "1px solid #D9E7EB",
                background: "#fff",
                textAlign: "left",
                overflow: "hidden",
                cursor: "pointer",
                padding: 0,
                minWidth: 180,
              }}
            >
              <div
                style={{
                  position: "relative",
                  aspectRatio: "1/1",
                  overflow: "hidden",
                  background: "linear-gradient(160deg,#F7FBFC 0%,#EEF4F6 100%)",
                  padding: 10,
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: 10,
                    background: "#fff",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 10,
                    top: 10,
                    borderRadius: 999,
                    padding: "4px 8px",
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "#0F766E",
                    background: "rgba(236,248,246,.96)",
                    border: "1px solid #CBE6E2",
                  }}
                >
                  {item.badge}
                </span>
              </div>
              <div style={{ padding: "10px 12px" }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", textTransform: "capitalize" }}>
                  {item.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechFeatureRail;
