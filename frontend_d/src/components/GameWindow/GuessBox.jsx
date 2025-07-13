import React from "react";

const GuessBox = ({ box, scale, position }) => {
    if (!box) return null;

    const boxStyle = {
        position: "absolute",
        left: `${box.x * scale + position.x}px`,
        top: `${box.y * scale + position.y}px`,
        width: `${box.width * scale}px`,
        height: `${box.height * scale}px`,
        border: `3px solid ${box.status === "wrong" ? "#ff4d4f" : "#52c41a"}`,
        boxSizing: "border-box",
        pointerEvents: "none",
        boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.8)",
        zIndex: 10,
    };

    return (
        <div
            className={box.status === "wrong" ? "guess-box wrong" : "guess-box"}
            style={boxStyle}
        />
    );
};

export default GuessBox;
