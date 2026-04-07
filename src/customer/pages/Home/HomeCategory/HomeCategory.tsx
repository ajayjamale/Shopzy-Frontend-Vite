import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../Redux Toolkit/Store";
import HomeCategoryCard from "./HomeCategoryCard";
import type { HomeCategory as HomeCategoryType } from "../../../../types/homeDataTypes";

const fallbackCategories: HomeCategoryType[] = [
  { categoryId: "winter_wear", name: "Winter Wear", image: "https://rukminim2.flixcart.com/image/612/612/kt1u3rk0/jacket/e/w/a/m-no-1675-886-roadster-original-imag6j2zmy6hezze.jpeg?q=70" },
  { categoryId: "women_dress", name: "Dresses", image: "https://rukminim2.flixcart.com/image/832/832/xif0q/dress/j/a/g/l-ss-11-sheetal-associates-original-imahf7qyzjjjzrez.jpeg?q=70&crop=false" },
  { categoryId: "wedding_special", name: "Wedding Special", image: "https://rukminim2.flixcart.com/image/612/612/xif0q/sari/6/j/n/free-banarasi-gold-mulberry-silk-saree-khatushayamfashion-unstitched-original-imagx7bffvzzfhpe.jpeg?q=70" },
  { categoryId: "casual_shoes", name: "Casual Shoes", image: "https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/t/t/a/-original-imagg5z8zhaepgbz.jpeg?q=70&crop=false" },
  { categoryId: "men_tshirts", name: "T-Shirts", image: "https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/e/i/b/4xl-bys-hd-fs7-btny-fubar-original-imahfgfetkgbtuhr.jpeg?q=70&crop=false" },
  { categoryId: "kids_wear", name: "Kids Wear", image: "https://rukminim2.flixcart.com/image/832/832/xif0q/kids-t-shirt/m/l/3/4-5-years-t333-eyebogler-original-imah5mfyvf2vmeqh.jpeg?q=70&crop=false" },
  { categoryId: "sports_shoes", name: "Sports Shoes", image: "https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/d/l/l/7-vrta0626-proase-black-original-imagt7cbtxkf6svx.jpeg?q=70&crop=false" },
  { categoryId: "ethnic_sets", name: "Ethnic Sets", image: "https://rukminim2.flixcart.com/image/832/832/khp664w0-0/kurta/b/5/h/s-534krr-blue-p4u-trend-original-imafxkgmuh3umct6.jpeg?q=70&crop=false" },
];

const HomeCategory: React.FC = () => {
  const navigate = useNavigate();
  const { homePage } = useAppSelector((state) => state);
  const categories: HomeCategoryType[] =
    homePage.homePageData?.shopByCategories?.map((c) => ({
      categoryId: c.categoryId || c.redirectLink || `${c.id}`,
      image: c.image || (c as any).imageUrl,
      name: c.name || (c as any).title,
      id: c.id,
      section: (c as any).section,
      parentCategoryId: c.parentCategoryId,
    })) ?? fallbackCategories;

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
