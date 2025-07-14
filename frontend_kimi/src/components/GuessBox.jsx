import { useEffect } from "react";

const BOX_WIDTH = 8; // %  of displayed image
const BOX_HEIGHT = 8;

export default function GuessBox({ box, naturalSize, onResult }) {
  const { x, y, status } = box;

  // Stub logic – later replaced by backend call
  useEffect(() => {
    if (status !== "pending") return;
    const fakeCorrect = Math.random() < 0.2; // 20 % chance for demo
    setTimeout(() => onResult(box.id, fakeCorrect), 500);
  }, [box.id, status, onResult]);

  if (status === "correct") return null; // hide on success

  return (
    <div
      className={`guess-box ${status}`}
      style={{
        left: `${x - BOX_WIDTH / 2}%`,
        top: `${y - BOX_HEIGHT / 2}%`,
        width: `${BOX_WIDTH}%`,
        height: `${BOX_HEIGHT}%`,
      }}
    />
  );
}
