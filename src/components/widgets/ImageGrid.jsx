import React from "react";
import { C } from "../../styles/tokens";

// thumbnails: 9칸에 대응하는 이미지 배열. 없는 칸(undefined/null)은 기존처럼 회색 박스 그대로.
export function ImageGrid({ selected, onSelect, thumbnails = [] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "35px 0 40px" }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} onClick={() => onSelect(i)}
          style={{
            aspectRatio: "1", borderRadius: 6, background: C.field, cursor: "pointer", overflow: "hidden",
            border: selected === i ? `4px solid #FE731C` : "2px solid transparent",
          }}>
          {thumbnails[i] && (
            <img src={thumbnails[i]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          )}
        </div>
      ))}
    </div>
  );
}