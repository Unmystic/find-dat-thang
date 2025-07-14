import React, { useEffect, useState } from "react";

const GuessBox = ({ box, scale, position, status = "pending" }) => {
    const [boxStatus, setBoxStatus] = useState(status);

    // Update status and reset animation if status changes
    useEffect(() => {
        setBoxStatus(status);
    }, [status]);

    if (!box) return null;

    const boxStyle = {
        position: "absolute",
        left: `${box.x * scale + position.x}px`,
        top: `${box.y * scale + position.y}px`,
        width: `${box.width * scale}px`,
        height: `${box.height * scale}px`,
        border: `3px solid ${boxStatus === "wrong"
                ? "#ff4d4f"
                : boxStatus === "correct"
                    ? "#52c41a"
                    : "rgba(255, 255, 255, 0.7)"
            }`,
        boxSizing: "border-box",
        pointerEvents: "none",
        boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.5)",
        zIndex: 10,
    };

    return <div className={`guess-box ${boxStatus}`} style={boxStyle} />;
};

export default GuessBox;
