import React from "react";
import { useAppSelector } from "../../../../Redux Toolkit/Store";
import type { HomeContentItem } from "../../../../types/homeContentTypes";

const fallback = [
  { name:"Ethnic Plus",  image:"https://www.ethnicplus.in/cdn/shop/files/2_e396bfa9-adef-490a-9444-1095114de031.jpg?v=1771173950&width=640",  badge:"Women's Ethnic" },
  { name:"Audio Lab",    image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&fit=crop",                             badge:"Electronics" },
  { name:"Active Wear",  image:"https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/22109480/2023/9/5/06a17ac3-46b0-4f9d-bcb1-2d3582feda041693895310152PumaWomenBrandLogoPrintedPureCottonOutdoorT-shirt1.jpg", badge:"Sportswear" },
  { name:"Kurta Studio", image:"https://www.ethnicplus.in/cdn/shop/files/4_2f2042d1-33c3-4f2c-8397-472e103fefb0.jpg?v=1768755972&width=640",   badge:"Menswear" },
  { name:"Home Living",  image:"https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28460938/2024/3/22/7fb09e9c-86e0-4602-b54e-fa5c0171b50b1711104156746IrregularMirrorHomeDecor1.jpg", badge:"Home Décor" },
  { name:"Footwear Co",  image:"https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28024048/2024/3/5/fca98389-f9d6-4f19-b82a-53c7ee0518ec1709633175836CORSICABlockSandalswithBows1.jpg",  badge:"Footwear" },
];

/* ─── inject keyframes once ─── */
const STYLE_ID = "topbrand-marquee-style";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes marquee-pingpong {
      0%        { transform: translateX(0); }
      50%       { transform: translateX(-50%); }
      100%      { transform: translateX(0); }
    }
    .tb-track  { display:flex; width:max-content; animation: marquee-pingpong 32s ease-in-out infinite; }
    .tb-card img       { transition: transform .6s ease; }
    .tb-card:hover img { transform: scale(1.05); }
    .tb-card           { transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
    .tb-card:hover     { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(13,13,13,.14); border-color: #C9A84C !important; }
  `;
  document.head.appendChild(s);
}

const TopBrand: React.FC = () => {
  const { homePage } = useAppSelector(s => s);
  const items: any[] = homePage.homePageData?.topBrands?.map((i: HomeContentItem) => ({
    name: i.title,
    image: i.imageUrl,
    badge: i.badgeText || i.subtitle
  })) || fallback;

  // Duplicate items so the loop is seamless (track is 2× the original list)
  const doubled = [...items, ...items];

  return (
    <section style={{ background:"#FAFAF8", padding:"clamp(40px,5.5vw,72px) 0", borderBottom:"1px solid #E0DBD3", overflow:"hidden" }}>

      {/* ── Header ── */}
      <div style={{ padding:"0 clamp(16px,5.5vw,80px)", marginBottom:"clamp(20px,2.8vw,32px)", display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap" as const, gap:12 }}>
        <div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:700, letterSpacing:".22em", textTransform:"uppercase" as const, color:"#7A7570", display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <span style={{ width:24, height:1.5, background:"#C9A84C", display:"inline-block" }} />Curated for You
          </span>
          <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(26px,3.8vw,52px)", fontWeight:600, color:"#0D0D0D", letterSpacing:"-.02em", lineHeight:1.15, margin:0 }}>Top Brand Picks</h2>
        </div>
        <button
          style={{ fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase" as const, padding:"11px 24px", borderRadius:4, border:"1.5px solid #0D0D0D", background:"transparent", color:"#0D0D0D", cursor:"pointer", transition:"all .22s ease" }}
          onMouseEnter={e=>{const b=e.currentTarget;b.style.background="#0D0D0D";b.style.color="#FAFAF8";}}
          onMouseLeave={e=>{const b=e.currentTarget;b.style.background="transparent";b.style.color="#0D0D0D";}}
        >Browse All Brands →</button>
      </div>

      {/* ── Marquee track ── */}
      {/* Left + right fade edges */}
      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, background:"linear-gradient(to right,#FAFAF8,transparent)", zIndex:2, pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, background:"linear-gradient(to left,#FAFAF8,transparent)", zIndex:2, pointerEvents:"none" }} />

        <div
          className="tb-track"
          style={{ gap:"clamp(14px,2vw,22px)", padding:"8px clamp(16px,5.5vw,80px) 16px" }}
        >
          {doubled.map((item: any, i: number) => (
            <div
              key={i}
              className="tb-card"
              style={{ flexShrink:0, width:"clamp(220px,26vw,340px)", borderRadius:18, overflow:"hidden", cursor:"pointer", border:"1px solid #E0DBD3", background:"#F7F4EF", position:"relative" }}
            >
              <img
                src={item.image}
                alt={item.name || "brand"}
                style={{ width:"100%", height:"clamp(240px,30vw,380px)", objectFit:"cover", objectPosition:"center top" }}
              />
              {(item.badge || item.name) && (
                <div style={{ position:"absolute", bottom:14, left:14, background:"rgba(13,13,13,.72)", backdropFilter:"blur(12px)", borderRadius:8, padding:"6px 14px" }}>
                  <span style={{ fontSize:10, fontWeight:700, color:"#FAFAF8", letterSpacing:".1em", textTransform:"uppercase" as const, fontFamily:"'Syne',sans-serif" }}>
                    {item.badge || item.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopBrand;
