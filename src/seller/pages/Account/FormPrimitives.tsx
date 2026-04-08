import React, { useState } from "react";

const C = {
  orange:  "#0F766E",
  orangeD: "#0B5F59",
  border:  "#DCE5E8",
  focus:   "#0F766E",
  text:    "#0F172A",
  error:   "#CC0C39",
  bg:      "#FFFFFF",
};

export interface FieldProps {
  id:          string;
  name:        string;
  label:       string;
  value:       string;
  onChange:    React.ChangeEventHandler<HTMLInputElement>;
  onBlur?:     React.FocusEventHandler<HTMLInputElement>;
  error?:      boolean;
  helperText?: string | false;
  type?:       string;
}

export const Field = ({
  id, name, label, value, onChange, onBlur,
  error, helperText, type = "text",
}: FieldProps) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
        {label}
      </label>
      <input
        id={id} name={name} type={type}
        value={value} onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        style={{
          height:       38,
          padding:      "0 10px",
          fontSize:     14,
          color:        C.text,
          background:   C.bg,
          border:       `1px solid ${error ? C.error : focused ? C.focus : C.border}`,
          borderRadius: 4,
          outline:      "none",
          boxShadow:    focused ? `0 0 0 3px ${C.orange}22` : "none",
          transition:   "border-color .14s, box-shadow .14s",
          fontFamily:   "inherit",
          width:        "100%",
          boxSizing:    "border-box" as const,
        }}
      />
      {error && helperText && (
        <span style={{ fontSize: 12, color: C.error }}>{helperText}</span>
      )}
    </div>
  );
};

export const SaveButton = ({ label = "Save changes" }: { label?: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="submit"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width:        "100%",
        height:       40,
        background:   hover
          ? "linear-gradient(135deg,#0B5F59,#0F766E)"
          : "linear-gradient(to bottom,#FFB84D,#0F766E)",
        border:       "1px solid #C45500",
        borderRadius: 4,
        color:        "#111",
        fontSize:     13.5,
        fontWeight:   700,
        cursor:       "pointer",
        fontFamily:   "inherit",
        boxShadow:    "0 1px 0 rgba(255,255,255,.3) inset",
        transition:   "background .14s",
      }}
    >
      {label}
    </button>
  );
};