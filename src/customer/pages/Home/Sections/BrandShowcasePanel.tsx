import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { HomePageContent } from "../../../../types/homeContentTypes";
import { toCatalogPath } from "../../../../utils/catalogRoute";

type BrandItem = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  target: string;
};

const fallback: BrandItem[] = [
  {
    id: "ethnicplus",
    name: "Ethnic Plus",
    subtitle: "Elegant festive edits",
    image: "https://www.ethnicplus.in/cdn/shop/files/2_e396bfa9-adef-490a-9444-1095114de031.jpg?v=1771173950&width=640",
    target: "women_indian_and_fusion_wear",
  },
  {
    id: "audiolab",
    name: "Audio Lab",
    subtitle: "Immersive audio range",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&fit=crop",
    target: "headphones_headsets",
  },
  {
    id: "homeliving",
    name: "Home Living",
    subtitle: "Designer space upgrades",
    image: "https://images.unsplash.com/photo-1616594039964-3bcb21f6ba6b?w=1200&q=80&fit=crop",
    target: "home_decor",
  },
];

const resolveTarget = (target: string) => toCatalogPath(target);

const BrandShowcasePanel = ({ data }: { data: HomePageContent | null }) => {
  const navigate = useNavigate();

  const brands = useMemo<BrandItem[]>(() => {
    const source = data?.topBrands || [];
    if (!source.length) return fallback;
    return source.map((item, index) => ({
      id: `${item.id || index}`,
      name: (item.title || item.subtitle || "Brand").split("_").join(" "),
      subtitle: item.badgeText || "Featured label",
      image: item.imageUrl || fallback[0].image,
      target: item.redirectLink || item.categoryId || "products",
    }));
  }, [data?.topBrands]);

  if (!brands.length) return null;

  const lead = brands[0];
  const side = brands.slice(1, 5);

  return (
    <section className="app-container" style={{ marginTop: 34 }}>
      <div className="surface" style={{ padding: "clamp(18px,2.8vw,30px)" }}>
        <p className="section-kicker" style={{ marginBottom: 8 }}>Brand Stories</p>
        <h2 className="section-title" style={{ fontSize: "clamp(1.35rem,2.8vw,2rem)" }}>
          Premium Brand Showcase
        </h2>

        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
            gap: 14,
          }}
          className="max-[980px]:grid-cols-1"
        >
          <button
            onClick={() => navigate(resolveTarget(lead.target))}
            style={{
              borderRadius: 18,
              border: "1px solid #DBE7EB",
              background: "#0F172A",
              overflow: "hidden",
              position: "relative",
              minHeight: 280,
              textAlign: "left",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <img
              src={lead.image}
              alt={lead.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(160deg, rgba(2,6,23,.76), rgba(2,132,199,.35))",
              }}
            />
            <div style={{ position: "relative", zIndex: 1, padding: 22, display: "grid", alignContent: "end", minHeight: 280 }}>
              <p style={{ color: "#C7F9F0", fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 800 }}>
                Brand Focus
              </p>
              <h3 style={{ color: "#fff", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", marginTop: 8 }}>{lead.name}</h3>
              <p style={{ marginTop: 6, color: "#D6E8EE" }}>{lead.subtitle}</p>
            </div>
          </button>

          <div style={{ display: "grid", gap: 12 }}>
            {side.map((brand) => (
              <button
                key={brand.id}
                onClick={() => navigate(resolveTarget(brand.target))}
                style={{
                  borderRadius: 14,
                  border: "1px solid #DBE7EB",
                  background: "#fff",
                  overflow: "hidden",
                  padding: 0,
                  textAlign: "left",
                  cursor: "pointer",
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  alignItems: "stretch",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: 110,
                    background: "linear-gradient(160deg,#F7FBFC 0%,#EEF4F6 100%)",
                    padding: 8,
                  }}
                >
                  <img
                    src={brand.image}
                    alt={brand.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: 8,
                      background: "#fff",
                    }}
                  />
                </div>
                <div style={{ padding: "12px 14px", display: "grid", alignContent: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{brand.name}</p>
                  <p style={{ marginTop: 4, fontSize: 12, color: "#64748B" }}>{brand.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcasePanel;
