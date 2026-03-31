import React from "react";
import { useNavigate } from "react-router-dom";

interface ElectronicItem {
  categoryId: string;
  name: string;
  image: string;
}

const COLORS = ["#2874F0","#FF6161","#26A541","#FF7B00","#9B59B6","#1ABC9C","#E74C3C"];

const ElectronicCategoryCard = ({ item, index = 0 }: { item: ElectronicItem; index?: number }) => {
  const navigate = useNavigate();
  const color = COLORS[index % COLORS.length];

  return (
    <>
      <style>{`
        .fk-cat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 14px 8px 12px;
          border-radius: 4px;
          background: #fff;
          min-width: 76px;
          max-width: 108px;
          flex: 1;
          transition: box-shadow .18s ease, transform .18s ease;
          border: 1px solid transparent;
          font-family: system-ui, sans-serif;
        }
        .fk-cat-card:hover {
          box-shadow: 0 4px 16px rgba(40,116,240,0.15);
          transform: translateY(-3px);
          border-color: #2874F0;
        }
      `}</style>

      <div
        className="fk-cat-card"
        onClick={() => navigate(`/products/${item.categoryId}`)}
      >
        <div style={{
          width: 60, height: 60, borderRadius: "50%",
          background: `${color}18`,
          display: "flex", alignItems: "center",
          justifyContent: "center", overflow: "hidden",
          border: `2px solid ${color}22`,
        }}>
          <img
            src={item.image}
            alt={item.name || "Electronic Item"}
            style={{ width: "72%", height: "72%", objectFit: "contain" }}
          />
        </div>

        <span style={{
          fontSize: 11, fontWeight: 600,
          color: "#212121", textAlign: "center", lineHeight: 1.3,
        }}>
          {item.name}
        </span>

        <div style={{
          width: 20, height: 2, borderRadius: 1,
          background: color, opacity: 0.6,
        }} />
      </div>
    </>
  );
};

export default ElectronicCategoryCard;