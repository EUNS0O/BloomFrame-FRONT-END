import React from "react";
import { C } from "../../styles/tokens";

export function Btn({ children, onClick, variant = "primary", disabled, icon: Icon, padding }) {
  const styles = {
    primary: { background: disabled ? "#C9C8C3" : C.black, color: "#fff" },
    ghost: { background: C.field, color: C.black },
    orange: { background: disabled ? "#F4C4AC" : C.orange, color: "#fff" },
  }[variant];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        width: "100%", padding: padding || "15px 16px", borderRadius: 14, border: "none",
        fontSize: 15, fontWeight: 700, cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        ...styles,
      }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export function Field({ label, textColor, placeholderColor, bg, borderColor, marginBottom, ...props }) {
  const uid = React.useId().replace(/:/g, "");
  return (
    <div style={{ marginBottom: marginBottom ?? 16 }}>
      {label && <div style={{ fontSize: 13.5, fontWeight: 700, color: C.black, marginBottom: 8 }}>{label}</div>}
      {placeholderColor && (
        <style>{`.f-${uid}::placeholder { color: ${placeholderColor}; }`}</style>
      )}
      <input
        {...props}
        className={`f-${uid}`}
        style={{
          width: "100%", boxSizing: "border-box", padding: "13px 14px", borderRadius: 12,
          border: `1px solid ${borderColor || C.grayLine}`, background: bg || C.field, fontSize: 14.5, color: textColor || C.black, outline: "none",
        }}
      />
    </div>
  );
}

export function Card({ children, onClick, active, borderRadius = 16, padding = "16px 18px", width = "100%", marginBottom = 12, bg }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: active ? C.orange : (bg || C.field), color: active ? "#fff" : C.black,
        borderRadius, padding, width, margin: `0 auto ${marginBottom}px`, boxSizing: "border-box",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
}