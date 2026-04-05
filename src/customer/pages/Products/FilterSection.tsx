import React, { useState } from "react";
import { Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckIcon from "@mui/icons-material/Check";
import { colors } from "../../../data/Filter/color";
import { price } from "../../../data/Filter/price";
import { discount } from "../../../data/Filter/discount";
import { useSearchParams } from "react-router-dom";

// ── Collapsible section wrapper ───────────────────────────────────────────────
const FilterGroup = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-group">
      <button
        onClick={() => setOpen((p) => !p)}
        className="filter-group-header"
      >
        <span className="filter-group-title">{title}</span>
        {open ? (
          <ExpandLessIcon sx={{ fontSize: 18, color: "#555" }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 18, color: "#555" }} />
        )}
      </button>
      {open && <div className="filter-group-body">{children}</div>}
    </div>
  );
};

// ── Custom radio row ──────────────────────────────────────────────────────────
const FilterRow = ({
  label,
  value,
  name,
  selected,
  onChange,
  colorHex,
}: {
  label: string;
  value: string;
  name: string;
  selected: boolean;
  onChange: (name: string, value: string) => void;
  colorHex?: string;
}) => (
  <button
    onClick={() => onChange(name, selected ? "" : value)}
    className={`filter-row ${selected ? "selected" : ""}`}
  >
    <div className="filter-row-left">
      {colorHex && (
        <span
          className="color-dot"
          style={{ background: colorHex }}
        />
      )}
      <span className="filter-row-label">{label}</span>
    </div>
    <span className={`filter-check ${selected ? "visible" : ""}`}>
      <CheckIcon sx={{ fontSize: 13 }} />
    </span>
  </button>
);

// ── Main component ────────────────────────────────────────────────────────────
const FilterSection = () => {
  const [expendColor, setExpendColor] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const get = (key: string) => searchParams.get(key) ?? "";

  const handleChange = (name: string, value: string) => {
    const updated = new URLSearchParams(searchParams.toString());
    if (value) {
      updated.set(name, value);
    } else {
      updated.delete(name);
    }
    setSearchParams(updated);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const activeCount = ["color", "price", "discount"].filter((k) => get(k)).length;

  return (
    <>
      <style>{`
        .filter-sidebar {
          background: #fff;
          border-right: 1px solid #e8e8e8;
          min-height: 100vh;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        /* ── Header ── */
        .filter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid #e8e8e8;
          position: sticky;
          top: 0;
          background: #fff;
          z-index: 10;
        }
        .filter-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .filter-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f1111;
          letter-spacing: 0.1px;
        }
        .filter-active-badge {
          background: #CC0C39;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          border-radius: 999px;
          padding: 1px 6px;
          line-height: 1.6;
        }
        .filter-clear-btn {
          font-size: 12px;
          font-weight: 600;
          color: #0b7285;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 4px;
          transition: background 0.15s, color 0.15s;
        }
        .filter-clear-btn:hover {
          color: #b45309;
          background: #fff5f0;
        }

        /* ── Active chips ── */
        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 10px 18px 0;
        }
        .filter-chip {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #e6f4f5;
          border: 1px solid #b2dde3;
          color: #0b7285;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px 3px 10px;
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .filter-chip:hover {
          background: #cceef2;
        }
        .filter-chip-x {
          font-size: 13px;
          line-height: 1;
          color: #0b7285;
          margin-left: 2px;
        }

        /* ── Group ── */
        .filter-group {
          border-bottom: 1px solid #f0f0f0;
        }
        .filter-group-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.12s;
        }
        .filter-group-header:hover {
          background: #fafafa;
        }
        .filter-group-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #0f1111;
        }
        .filter-group-body {
          padding: 2px 18px 14px;
        }

        /* ── Row ── */
        .filter-row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 8px;
          border-radius: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: background 0.12s;
          margin-bottom: 1px;
        }
        .filter-row:hover {
          background: #f5f5f5;
        }
        .filter-row.selected {
          background: #e6f4f5;
        }
        .filter-row-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .filter-row-label {
          font-size: 13px;
          color: #333;
        }
        .filter-row.selected .filter-row-label {
          color: #0b7285;
          font-weight: 600;
        }
        .color-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.15);
          flex-shrink: 0;
        }
        .filter-check {
          color: #0b7285;
          opacity: 0;
          transition: opacity 0.15s;
          display: flex;
          align-items: center;
        }
        .filter-check.visible {
          opacity: 1;
        }

        /* ── Show more ── */
        .show-more-btn {
          font-size: 12px;
          color: #0b7285;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          margin-top: 2px;
          border-radius: 4px;
          font-weight: 500;
          transition: background 0.12s;
        }
        .show-more-btn:hover {
          background: #f0fafa;
          text-decoration: underline;
        }
      `}</style>

      <div className="filter-sidebar">
        {/* ── Header ── */}
        <div className="filter-header">
          <div className="filter-header-left">
            <span className="filter-title">Filters</span>
            {activeCount > 0 && (
              <span className="filter-active-badge">{activeCount}</span>
            )}
          </div>
          {activeCount > 0 && (
            <button onClick={clearAllFilters} className="filter-clear-btn">
              Clear all
            </button>
          )}
        </div>

        {/* ── Active filter chips ── */}
        {activeCount > 0 && (
          <div className="filter-chips">
            {["color", "price", "discount"].map((key) => {
              const val = get(key);
              if (!val) return null;
              return (
                <button
                  key={key}
                  className="filter-chip"
                  onClick={() => handleChange(key, "")}
                >
                  <span style={{ textTransform: "capitalize" }}>{key}: {val}</span>
                  <span className="filter-chip-x">×</span>
                </button>
              );
            })}
          </div>
        )}

        <div style={{ paddingTop: activeCount > 0 ? 10 : 0 }}>
          {/* ── Color ── */}
          <FilterGroup title="Colour">
            {colors
              .slice(0, expendColor ? colors.length : 5)
              .map((item) => (
                <FilterRow
                  key={item.name}
                  label={item.name}
                  value={item.name}
                  name="color"
                  selected={get("color") === item.name}
                  onChange={handleChange}
                  colorHex={item.hex}
                />
              ))}
            <button
              onClick={() => setExpendColor((p) => !p)}
              className="show-more-btn"
            >
              {expendColor
                ? "▲ Show less"
                : `▼ ${colors.length - 5} more colours`}
            </button>
          </FilterGroup>

          {/* ── Price ── */}
          <FilterGroup title="Price">
            {price.map((item) => (
              <FilterRow
                key={item.name}
                label={item.name}
                value={item.value}
                name="price"
                selected={get("price") === item.value}
                onChange={handleChange}
              />
            ))}
          </FilterGroup>

          {/* ── Discount ── */}
          <FilterGroup title="Discount">
            {discount.map((item) => (
              <FilterRow
                key={item.name}
                label={item.name}
                value={item.value.toString()}
                name="discount"
                selected={get("discount") === item.value.toString()}
                onChange={handleChange}
              />
            ))}
          </FilterGroup>
        </div>
      </div>
    </>
  );
};

export default FilterSection;