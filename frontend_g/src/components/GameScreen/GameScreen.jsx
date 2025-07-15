import React, { useState, useEffect, useRef } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useTransformContext,
} from "react-zoom-pan-pinch";
import TargetingBox from "../TargetingBox/TargetingBox";
import GameUI from "../GameUI/GameUI";
import "./GameScreen.css";

// --- Hardcoded Target for Testing ---
// These are the relative coordinates (in %) for the polar bear.
const TARGET_COORDS = { x: 25.5, y: 35.5 };
const TARGET_RADIUS_PERCENT = 7.5; // The guess must be within this % of the target's center.

const GameScreen = ({ imageUrl }) => {
  // Game State
  const [timer, setTimer] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'found', 'game-over'
  const [gameMessage, setGameMessage] = useState("Find the Polar Bear!");

  // Guessing State
  const [boxPosition, setBoxPosition] = useState(null); // The position of the targeting box {x, y}
  const [isGuessCorrect, setIsGuessCorrect] = useState(null); // null, true, false
  const [scale, setScale] = useState(1);
  const transformRef = useRef(null);

  // Timer Logic
  useEffect(() => {
    if (gameStatus === "playing") {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStatus]);

  // Handle placing the targeting box
  const handleImageClick = (e) => {
    if (gameStatus !== "playing") return;

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const relativeX = (x / rect.width) * 100;
    const relativeY = (y / rect.height) * 100;

    setBoxPosition({ x: relativeX, y: relativeY });
    setIsGuessCorrect(null); // Reset guess status when moving the box
  };

  // Handle guess submission
  const handleMakeGuess = () => {
    if (!boxPosition || gameStatus !== "playing") return;
    console.log(`Your guess: ( ${boxPosition.x}, ${boxPosition.y} )`);
    console.log("Target:", TARGET_COORDS);

    const distance = Math.sqrt(
      Math.pow(boxPosition.x - TARGET_COORDS.x, 2) +
        Math.pow(boxPosition.y - TARGET_COORDS.y, 2),
    );

    if (distance <= TARGET_RADIUS_PERCENT) {
      // CORRECT GUESS
      setGameStatus("found");
      setIsGuessCorrect(true);
      setGameMessage(`You found it in ${timer} seconds!`);
    } else {
      // WRONG GUESS
      setTimer((t) => t + 10); // Add 10-second penalty
      setAttemptsLeft((a) => a - 1);
      setIsGuessCorrect(false);

      if (attemptsLeft - 1 <= 0) {
        setGameStatus("game-over");
        setGameMessage("Game Over! Better luck next time.");
      } else {
        setGameMessage("Not quite... Try again!");
        // Hide the red box after 2 seconds
        setTimeout(() => {
          setBoxPosition(null);
          setIsGuessCorrect(null);
        }, 2000);
      }
    }
  };

  return (
    <div className="game-layout">
      <GameUI
        timer={timer}
        attemptsLeft={attemptsLeft}
        gameMessage={gameMessage}
        gameStatus={gameStatus}
        onMakeGuess={handleMakeGuess}
      />

      <div className="image-viewport">
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={1} // Prevents zooming out beyond the initial fit
          limitToBounds={true}
          doubleClick={{ disabled: true }}
          onTransformed={(ref, state) => setScale(state.scale)}
        >
          <TransformComponent wrapperClass="transform-wrapper">
            <div className="image-container" onClick={handleImageClick}>
              <img src={imageUrl} alt="Find the hidden object" />
              {boxPosition && (
                <TargetingBox
                  position={boxPosition}
                  scale={scale}
                  isCorrect={isGuessCorrect}
                />
              )}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default GameScreen;
