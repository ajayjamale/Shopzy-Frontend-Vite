import React from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useAppSelector } from "../../../../Redux Toolkit/Store";

const fallback = [
  { name:"Laptops",     img:"https://rukminim2.flixcart.com/image/312/312/xif0q/computer/x/9/j/-original-imahyjzh7m2zsqdg.jpeg?q=70",     categoryId:"laptops" },
  { name:"Mobiles",     img:"https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/5/t/j/edge-50-fusion-pb300002in-motorola-original-imahywzrfagkuyxx.jpeg?q=70", categoryId:"mobiles" },
  { name:"Smartwatch",  img:"https://rukminim2.flixcart.com/image/612/612/xif0q/smartwatch/f/g/g/-original-imagywnz46fngcks.jpeg?q=70",  categoryId:"smart_watches" },
  { name:"Headphones",  img:"https://rukminim2.flixcart.com/image/612/612/kz4gh3k0/headphone/c/v/r/-original-imagb7bmhdgghzxq.jpeg?q=70", categoryId:"headphones_headsets" },
  { name:"Speakers",    img:"https://rukminim2.flixcart.com/image/612/612/xif0q/speaker/6/z/2/-original-imahfgfkr5gkk9aq.jpeg?q=70",    categoryId:"speakers" },
  { name:"Televisions", img:"https://rukminim2.flixcart.com/image/312/312/xif0q/television/9/p/9/-original-imah2v29z86u7b79.jpeg?q=70",  categoryId:"television" },
  { name:"Cameras",     img:"https://rukminim2.flixcart.com/image/312/312/jfbfde80/camera/n/r/n/canon-eos-eos-3000d-dslr-original-imaf3t5h9yuyc5zu.jpeg?q=70", categoryId:"cameras" },
];

const ElectronicCategory: React.FC = () => {
  const navigate = useNavigate();
  const { homePage } = useAppSelector(s => s);
  const isSmall = useMediaQuery("(max-width:600px)");
  const cats = (homePage.homePageData?.electricCategories || fallback).slice(0, isSmall ? 5 : undefined);

  return (
    <section style={{ background:"#FAFAF8", padding:"clamp(20px,3vw,32px) 0", borderBottom:"1px solid #E0DBD3" }}>
      <div style={{ padding:"0 clamp(16px,5.5vw,80px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:"clamp(14px,2vw,22px)" }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:700, letterSpacing:".22em", textTransform:"uppercase" as const, color:"#7A7570", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ width:24, height:1.5, background:"#C9A84C", display:"inline-block" }} />
            Shop Electronics
          </span>
          <div style={{ flex:1, height:1, background:"#E0DBD3" }} />
          <button onClick={() => navigate("/products/electronics")} style={{ fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" as const, padding:"7px 16px", borderRadius:4, border:"1.5px solid #0D0D0D", background:"transparent", color:"#0D0D0D", cursor:"pointer", transition:"all .2s" }}
            onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.background="#0D0D0D";b.style.color="#FAFAF8"}}
            onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.background="transparent";b.style.color="#0D0D0D"}}
          >View All →</button>
        </div>
        <div style={{ display:"flex", gap:"clamp(8px,1.4vw,16px)", overflowX:"auto", scrollbarWidth:"none" as const }}>
          {cats.map((item: any) => (
            <div key={item.categoryId} onClick={() => navigate(`/products/${item.categoryId}`)}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:9, cursor:"pointer", padding:"14px 10px 12px", borderRadius:14, border:"1.5px solid #E0DBD3", background:"#F7F4EF", flex:"1 1 72px", minWidth:72, maxWidth:100, transition:"all .22s ease" }}
              onMouseEnter={e=>{const d=e.currentTarget as HTMLDivElement;d.style.borderColor="#C9A84C";d.style.boxShadow="0 6px 22px rgba(201,168,76,.18)";d.style.transform="translateY(-4px)"}}
              onMouseLeave={e=>{const d=e.currentTarget as HTMLDivElement;d.style.borderColor="#E0DBD3";d.style.boxShadow="none";d.style.transform="none"}}
            >
              <div style={{ width:48, height:48, borderRadius:12, background:"#EDE9E1", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                <img src={item.img || item.image} alt={item.name} style={{ width:"76%", height:"76%", objectFit:"contain" }} />
              </div>
              <span style={{ fontSize:10, fontWeight:600, color:"#0D0D0D", textAlign:"center", lineHeight:1.3, fontFamily:"'Syne',sans-serif", letterSpacing:".02em" }}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ElectronicCategory;