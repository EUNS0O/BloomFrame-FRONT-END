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
        width: "100%",
        padding: padding || "15px 60px",
        borderRadius: 5, border: "none",
        fontSize: 10, fontWeight: 700, 
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        alignItems: "center", 
        justifyContent: "center", 
        gap: 8,
        ...styles,
      }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export function Field({ label, textColor, placeholderColor, bg, borderColor, width, ...props }) {
  const uid = React.useId().replace(/:/g, "");
  return (
    <div style={{ marginTop: 20, marginBottom: 5 }}>
      {label && <div style={{ fontSize: 16, fontWeight: 700, color: C.black, marginBottom: 5, paddingLeft: 8 }}>{label}</div>}
      {placeholderColor && (
        <style>{`.f-${uid}::placeholder { color: ${placeholderColor}; }`}</style>
      )}
      <input
        {...props}
        className={`f-${uid}`}
        style={{
          display: "block",
          width: width || "100%", boxSizing: "border-box", padding: "9px 9px 9px 16px", borderRadius: 5,
          border: `1px solid ${borderColor || C.black}`,
          background: bg || C.field,
          fontSize: 12,
          color: textColor || C.black,
          outline: "none",
          margin: "0 auto",
        }}
      />
    </div>
  );
}

export function Card({ children, onClick, active }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: active ? C.orange : C.field, color: active ? "#fff" : C.black,
        borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center",
        justifyContent: "space-between", cursor: onClick ? "pointer" : "default", marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}