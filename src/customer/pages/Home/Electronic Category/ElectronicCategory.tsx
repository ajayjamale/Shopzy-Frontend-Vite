import React from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useAppSelector } from "../../../../Redux Toolkit/Store";
import type { HomeContentItem } from "../../../../types/homeContentTypes";

const fallback = [
  { name: "Mobiles",     img: "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/5/t/j/edge-50-fusion-pb300002in-motorola-original-imahywzrfagkuyxx.jpeg?q=70", categoryId: "mobiles" },
  { name: "Laptops",     img: "https://rukminim2.flixcart.com/image/312/312/xif0q/computer/x/9/j/-original-imahyjzh7m2zsqdg.jpeg?q=70",     categoryId: "laptops" },
  { name: "Smartwatch",  img: "https://rukminim2.flixcart.com/image/612/612/xif0q/smartwatch/f/g/g/-original-imagywnz46fngcks.jpeg?q=70",  categoryId: "smart_watches" },
  { name: "Headphones",  img: "https://rukminim2.flixcart.com/image/612/612/kz4gh3k0/headphone/c/v/r/-original-imagb7bmhdgghzxq.jpeg?q=70", categoryId: "headphones_headsets" },
  { name: "Speakers",    img: "https://rukminim2.flixcart.com/image/612/612/xif0q/speaker/6/z/2/-original-imahfgfkr5gkk9aq.jpeg?q=70",    categoryId: "speakers" },
  { name: "Televisions", img: "https://rukminim2.flixcart.com/image/312/312/xif0q/television/9/p/9/-original-imah2v29z86u7b79.jpeg?q=70",  categoryId: "television" },
  { name: "Cameras",     img: "https://rukminim2.flixcart.com/image/312/312/jfbfde80/camera/n/r/n/canon-eos-eos-3000d-dslr-original-imaf3t5h9yuyc5zu.jpeg?q=70", categoryId: "cameras" },
];

const COLORS = ["#2874F0","#FF6161","#26A541","#FF7B00","#9B59B6","#1ABC9C","#E74C3C"];

const ElectronicCategory: React.FC = () => {
  const navigate  = useNavigate();
  const { homePage } = useAppSelector(s => s);
  const isSmall   = useMediaQuery("(max-width:600px)");
  const cats: (HomeContentItem | any)[] = (homePage.homePageData?.electronics?.length
    ? homePage.homePageData.electronics
    : fallback).slice(0, isSmall ? 5 : undefined);

  return (
    <>
      <style>{`
        .fk-elec-wrap {
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          padding: clamp(16px,2.5vw,24px) clamp(16px,4vw,28px);
        }
        .fk-elec-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 14px 8px 12px;
          border-radius: 4px;
          background: #fff;
          flex: 1 1 80px;
          min-width: 76px;
          max-width: 108px;
          transition: box-shadow .18s ease, transform .18s ease;
          border: 1px solid transparent;
          position: relative;
        }
        .fk-elec-card:hover {
          box-shadow: 0 4px 16px rgba(40,116,240,0.15);
          transform: translateY(-3px);
          border-color: #2874F0;
        }
        .fk-elec-offer {
          position: absolute;
          top: 6px; right: 6px;
          background: #FF6161;
          color: #fff;
          font-size: 8px; font-weight: 800;
          padding: 2px 5px; border-radius: 2px;
          font-family: system-ui,sans-serif;
          letter-spacing: .05em;
        }
        .fk-see-all {
          background: none; border: 1.5px solid #2874F0;
          color: #2874F0; font-size: 12px; font-weight: 700;
          padding: 6px 16px; border-radius: 2px;
          cursor: pointer; font-family: system-ui,sans-serif;
          transition: all .15s ease; white-space: nowrap;
        }
        .fk-see-all:hover { background: #2874F0; color: #fff; }
      `}</style>

      <section style={{ padding: "0 clamp(8px,2vw,16px)" }}>
        <div className="fk-elec-wrap">

          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "clamp(14px,2vw,20px)",
            borderBottom: "1px solid #f0f0f0",
            paddingBottom: 12,
          }}>
            <div>
              <h2 style={{
                fontFamily: "system-ui,sans-serif",
                fontSize: "clamp(16px,1.8vw,20px)",
                fontWeight: 700, color: "#212121",
                margin: "0 0 2px",
              }}>
                Electronics
              </h2>
              <p style={{
                fontFamily: "system-ui,sans-serif",
                fontSize: 11, color: "#878787", margin: 0,
              }}>
                Best deals on top brands
              </p>
            </div>
            <button className="fk-see-all"
              onClick={() => navigate("/products/electronics")}>
              View All →
            </button>
          </div>

          {/* Cards */}
          <div style={{
            display: "flex",
            gap: "clamp(6px,1vw,12px)",
            overflowX: "auto",
            scrollbarWidth: "none",
            paddingBottom: 4,
          }}>
            {cats.map((item: any, idx: number) => (
              <div
                key={item.id || item.categoryId || idx}
                className="fk-elec-card"
                onClick={() => navigate(`/products/${item.categoryId || item.redirectLink || "electronics"}`)}
              >
                {idx < 3 && <span className="fk-elec-offer">SALE</span>}

                {/* Colored circle bg */}
                <div style={{
                  width: 60, height: 60, borderRadius: "50%",
                  background: `${COLORS[idx % COLORS.length]}18`,
                  display: "flex", alignItems: "center",
                  justifyContent: "center", overflow: "hidden",
                  border: `2px solid ${COLORS[idx % COLORS.length]}22`,
                }}>
                  <img
                    src={item.img || item.image || item.imageUrl}
                    alt={item.name || item.title}
                    style={{ width: "72%", height: "72%", objectFit: "contain" }}
                  />
                </div>

                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: "#212121", textAlign: "center",
                  lineHeight: 1.3, fontFamily: "system-ui,sans-serif",
                }}>
                  {item.name || item.title}
                </span>

                {/* Colored underline accent */}
                <div style={{
                  width: 20, height: 2, borderRadius: 1,
                  background: COLORS[idx % COLORS.length],
                  opacity: 0.6,
                }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ElectronicCategory;
