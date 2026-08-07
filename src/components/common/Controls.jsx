import React from "react";
import { C } from "../../styles/tokens";

export function Btn({ children, onClick, variant = "primary", disabled, icon: Icon }) {
  const styles = {
    primary: { background: disabled ? "#C9C8C3" : C.black, color: "#fff" },
    ghost: { background: C.field, color: C.black },
    orange: { background: disabled ? "#F4C4AC" : C.orange, color: "#fff" },
  }[variant];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        width: "100%", padding: "15px 16px", borderRadius: 14, border: "none",
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

export function Field({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <div style={{ fontSize: 13.5, fontWeight: 700, color: C.black, marginBottom: 8 }}>{label}</div>}
      <input
        {...props}
        style={{
          width: "100%", boxSizing: "border-box", padding: "13px 14px", borderRadius: 12,
          border: `1px solid ${C.grayLine}`, background: C.field, fontSize: 14.5, color: C.black, outline: "none",
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
