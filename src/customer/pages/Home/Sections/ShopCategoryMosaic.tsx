import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { HomePageContent } from "../../../../types/homeContentTypes";

type CategoryCard = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  target: string;
};

const fallback: CategoryCard[] = [
  {
    id: "women",
    name: "Women",
    subtitle: "Contemporary silhouettes",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80&fit=crop",
    target: "women",
  },
  {
    id: "men",
    name: "Men",
    subtitle: "Everyday premium fits",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1200&q=80&fit=crop",
    target: "men",
  },
  {
    id: "home",
    name: "Home",
    subtitle: "Minimal living picks",
    image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1200&q=80&fit=crop",
    target: "home_furniture",
  },
  {
    id: "beauty",
    name: "Beauty",
    subtitle: "Glow essentials",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80&fit=crop",
    target: "beauty",
  },
  {
    id: "sports",
    name: "Sports",
    subtitle: "Activewear and gear",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&q=80&fit=crop",
    target: "men_sports_active_wear",
  },
];

const resolveTarget = (target: string) => (target.startsWith("/") ? target : `/products/${target}`);

const ShopCategoryMosaic = ({ data }: { data: HomePageContent | null }) => {
  const navigate = useNavigate();

  const cards = useMemo<CategoryCard[]>(() => {
    const incoming = data?.shopByCategories || [];
    if (!incoming.length) return fallback;
    return incoming.map((item, index) => ({
      id: `${item.id || item.categoryId || index}`,
      name: (item.name || item.categoryId || "Collection").split("_").join(" "),
      subtitle: "Handpicked for this week",
      image: item.image || item.imageUrl || fallback[0].image,
      target: item.redirectLink || item.categoryId || "products",
    }));
  }, [data?.shopByCategories]);

  if (!cards.length) return null;

  const hero = cards[0];
  const miniCards = cards.slice(1, 7);

  return (
    <section className="app-container" style={{ marginTop: 34 }}>
      <div className="surface" style={{ padding: "clamp(18px,3vw,30px)" }}>
        <p className="section-kicker" style={{ marginBottom: 8 }}>Category Edit</p>
        <h2 className="section-title" style={{ fontSize: "clamp(1.4rem,3vw,2rem)" }}>Shop By Category</h2>
        <p style={{ marginTop: 6, color: "#64748B", fontSize: 13 }}>
          Distinct category collections curated and managed from admin content.
        </p>

        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)",
            gap: 14,
          }}
          className="max-[920px]:grid-cols-1"
        >
          <button
            onClick={() => navigate(resolveTarget(hero.target))}
            style={{
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid #DBE7EB",
              background: "#0F172A",
              position: "relative",
              minHeight: 320,
              textAlign: "left",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <img
              src={hero.image}
              alt={hero.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(120deg, rgba(15,23,42,.75), rgba(15,118,110,.34))",
              }}
            />
            <div style={{ position: "relative", zIndex: 1, padding: 22, display: "grid", alignContent: "end", minHeight: 320 }}>
              <p style={{ color: "#99F6E4", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 800 }}>
                Featured Category
              </p>
              <h3 style={{ color: "#fff", fontSize: "clamp(1.3rem,2.2vw,1.9rem)", marginTop: 8 }}>
                {hero.name}
              </h3>
              <p style={{ color: "#D6E9EC", marginTop: 6 }}>{hero.subtitle}</p>
            </div>
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
            {miniCards.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(resolveTarget(item.target))}
                style={{
                  borderRadius: 14,
                  border: "1px solid #DBE7EB",
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
                    background: "linear-gradient(160deg,#F7FBFC 0%,#EEF4F6 100%)",
                    padding: 8,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: 10,
                      background: "#fff",
                    }}
                  />
                </div>
                <div style={{ padding: "10px 11px 12px" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", textTransform: "capitalize" }}>{item.name}</p>
                  <p style={{ marginTop: 2, fontSize: 11, color: "#64748B" }}>{item.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopCategoryMosaic;
