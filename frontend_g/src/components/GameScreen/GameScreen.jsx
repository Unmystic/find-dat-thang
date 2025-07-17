import React, { useState, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import TargetingBox from "../TargetingBox/TargetingBox";
import GameUI from "../GameUI/GameUI";
import "./GameScreen.css";

const GameScreen = ({ game, onGameFinish }) => {
    // Game State
    const [timer, setTimer] = useState(0);
    const [attemptsLeft, setAttemptsLeft] = useState(3);
    const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'found', 'game-over'
    const [gameMessage, setGameMessage] = useState(
        `Find the: ${game.target.name}!`,
    );

    // Guessing State
    const [boxPosition, setBoxPosition] = useState(null);
    const [isGuessCorrect, setIsGuessCorrect] = useState(null);
    const [scale, setScale] = useState(1);

    // Timer Logic
    useEffect(() => {
        if (gameStatus === "playing") {
            const interval = setInterval(() => setTimer((t) => t + 1), 1000);
            return () => clearInterval(interval);
        }
    }, [gameStatus]);

    const handleImageClick = (e) => {
        if (gameStatus !== "playing") return;
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setBoxPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
        setIsGuessCorrect(null);
    };

    const handleMakeGuess = async () => {
        if (!boxPosition || gameStatus !== "playing") return;

        // Call the backend to verify the guess
        const response = await fetch(`/api/games/${game.id}/guess`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(boxPosition),
        });
        const result = await response.json();

        if (result.correct) {
            setGameStatus("found");
            setIsGuessCorrect(true);
            setGameMessage(`You found it!`);
            setTimeout(() => onGameFinish({ status: "won", time: timer }), 2000); // End game after 2s
        } else {
            setTimer((t) => t + 10);
            const newAttempts = attemptsLeft - 1;
            setAttemptsLeft(newAttempts);
            setIsGuessCorrect(false);

            if (newAttempts <= 0) {
                setGameStatus("game-over");
                setGameMessage("Game Over!");
                // Pass a 'lost' status
                setTimeout(() => onGameFinish({ status: "lost", time: 0 }), 2000);
            } else {
                setGameMessage("Not quite... Try again!");
                setTimeout(() => setBoxPosition(null), 1500);
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
                    minScale={1}
                    limitToBounds={true}
                    onTransformed={(ref, state) => setScale(state.scale)}
                >
                    <TransformComponent wrapperClass="transform-wrapper">
                        <div className="image-container" onClick={handleImageClick}>
                            <img src={game.imageUrl} alt={game.title} />
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
