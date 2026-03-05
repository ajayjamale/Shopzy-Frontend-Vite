import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../Redux Toolkit/Store";
import HomeCategoryCard from "./HomeCategoryCard";

const fallbackCategories = [ /* same as before */ ];

const HomeCategory: React.FC = () => {
  const navigate = useNavigate();
  const { homePage } = useAppSelector((state) => state);
  const categories = homePage.homePageData?.shopByCategories ?? fallbackCategories;

  return (
    <section style={{ background: "#F8F8F8", padding: "clamp(40px,5.5vw,72px) 0" }}>
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
                color: "#777", // muted dark gray
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
                  background: "#C9A84C", // keep gold accent
                  display: "inline-block",
                }}
              />
              Curated Collections
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(26px,3.8vw,52px)",
                fontWeight: 600,
                color: "#1A1612", // dark brown/black for contrast
                letterSpacing: "-.02em",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              Shop by Category
            </h2>
          </div>
        </div>

        {/* Grid of categories */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "clamp(12px,1.8vw,20px)",
          }}
        >
          {categories.map((cat: any) => (
            <HomeCategoryCard key={cat.categoryId} item={cat} />
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
            onClick={() => {}} // add navigation if needed
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
            View All Categories →
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeCategory;