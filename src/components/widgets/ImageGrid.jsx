import React from "react";
import { C } from "../../styles/tokens";

export function ImageGrid({ selected, onSelect, thumbnails = [], cellBg = {}, imageScale = {}, imageOffsetY = {} }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "35px 0 40px" }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} onClick={() => onSelect(i)}
          style={{
            aspectRatio: "1", borderRadius: 6, background: cellBg[i] || C.field, cursor: "pointer", overflow: "hidden",
            border: selected === i ? `4px solid #FE731C` : "2px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          {thumbnails[i] && (
            <img
              src={thumbnails[i]} alt=""
              style={{
                width: "100%", height: "100%", objectFit: "cover", display: "block",
                transform: [
                  imageScale[i] ? `scale(${imageScale[i]})` : "",
                  imageOffsetY[i] ? `translateY(${imageOffsetY[i]}px)` : "",
                ].filter(Boolean).join(" ") || undefined,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}