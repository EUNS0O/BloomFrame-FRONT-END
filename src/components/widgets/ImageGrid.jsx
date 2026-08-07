import React from "react";
import { C, IMAGE_SWATCHES } from "../../styles/tokens";

export function ImageGrid({ selected, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "24px 0 40px" }}>
      {IMAGE_SWATCHES.map((color, i) => (
        <div key={i} onClick={() => onSelect(i)}
          style={{
            aspectRatio: "1", borderRadius: 12, background: color, cursor: "pointer",
            border: selected === i ? `3px solid ${C.orange}` : "3px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>
          🌿
        </div>
      ))}
    </div>
  );
}
