import React from "react";
import "./GameUI.css";

const GameUI = ({
  timer,
  attemptsLeft,
  gameMessage,
  gameStatus,
  onMakeGuess,
}) => {
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="game-ui-header">
      <div className="header-info">
        <span>🕒 Timer: {formatTime(timer)}</span>
        <span>Attempts Left: {attemptsLeft}</span>
      </div>
      <p className="game-message">{gameMessage}</p>
      <button
        className="guess-button"
        onClick={onMakeGuess}
        disabled={gameStatus !== "playing"}
      >
        Make Guess
      </button>
    </div>
  );
};

export default GameUI;
