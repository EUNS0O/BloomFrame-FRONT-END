import React from "react";
import { C } from "../../styles/tokens";

export function ImageGrid({ selected, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "35px 0 40px" }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} onClick={() => onSelect(i)}
          style={{
            aspectRatio: "1", borderRadius: 6, background: C.field, cursor: "pointer",
            border: selected === i ? `4px solid #FE731C` : "2px solid transparent",
          }}>
        </div>
      ))}
    </div>
  );
}