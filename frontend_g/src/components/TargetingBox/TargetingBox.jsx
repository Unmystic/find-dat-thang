import React from "react";
import "./TargetingBox.css";

// Base size of the box (as a percentage of image dimensions)
const BASE_SIZE_PERCENT = 10;

const TargetingBox = ({ position, scale, isCorrect }) => {
  // Scale the box size inversely to the zoom level to keep its apparent size consistent
  const scaledSize = BASE_SIZE_PERCENT / scale;

  const style = {
    left: `${position.x}%`,
    top: `${position.y}%`,
    width: `${scaledSize}%`,
    height: `${scaledSize}%`,
    transform: "translate(-50%, -50%)",
  };

  // Determine the CSS class based on the guess correctness
  const boxClass =
    isCorrect === true ? "correct" : isCorrect === false ? "incorrect" : "";

  return <div className={`targeting-box ${boxClass}`} style={style}></div>;
};

export default TargetingBox;
