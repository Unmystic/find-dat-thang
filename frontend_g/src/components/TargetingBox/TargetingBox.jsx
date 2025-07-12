import React from "react";
import "./TargetingBox.css";

// The size of the box in percentage of the image dimensions.
const BOX_SIZE_PERCENT = 5;

const TargetingBox = ({ position }) => {
    // We offset the position by half the box size to center it on the click
    const style = {
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${BOX_SIZE_PERCENT}%`,
        height: `${BOX_SIZE_PERCENT}%`,
        transform: "translate(-50%, -50%)",
    };

    return <div className="targeting-box" style={style}></div>;
};

export default TargetingBox;
