import React from "react";

function Food({ position , isExtraFood }) {
  const color = isExtraFood ? "green" : "white";
  return (
    <div
      style={{
        width: "15px",
        height: "15px",
        backgroundColor: color,
        margin: "3px",
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        zIndex: 0,
      }}
    />
  );
}

export default Food;