import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import GameLayout from "../components/Layout/GameLayout";
import GameWindow from "../components/GameWindow/GameWindow";
import Timer from "../components/UI/Timer";
import { useGameContext } from "../contexts/GameContext";

const Game = () => {
    const imageUrl = "/images/polar-bear.jpeg"; // Updated path

    const {
        isPlaying,
        attempts,
        time,
        timerActive,
        startGame,
        makeGuess,
        message,
    } = useGameContext();

    const [internalTime, setInternalTime] = useState(0);
    const timerIntervalRef = useRef(null);
    const hasStartedRef = useRef(false);

    // Timer effect
    useEffect(() => {
        if (timerActive) {
            timerIntervalRef.current = setInterval(() => {
                setInternalTime((prev) => prev + 100);
            }, 100);
        } else if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [timerActive]);

    // Start game on mount (only once)
    useEffect(() => {
        if (!hasStartedRef.current) {
            startGame();
            hasStartedRef.current = true;
        }
    }, [startGame]);

    const handleGuess = (box) => {
        if (!isPlaying) return;

        // For now, simulate correctness: let's say the hidden object is at (300,300) with size 100x100
        const target = { x: 300, y: 300, width: 100, height: 100 };
        const isHit =
            box.x < target.x + target.width &&
            box.x + box.width > target.x &&
            box.y < target.y + target.height &&
            box.y + box.height > target.y;

        makeGuess(isHit);
    };

    const totalTime = time + internalTime;

    return (
        <GameLayout message={message}>
            <div className="game-page">
                <div className="game-header">
                    <div className="game-stats">
                        <Timer time={totalTime} />
                        <div className="attempts-counter">Attempts left: {attempts}</div>
                    </div>
                    <Link to="/" className="button secondary">
                        Back to Home
                    </Link>
                </div>

                <div className="game-content">
                    <GameWindow
                        imageUrl={imageUrl}
                        onGuess={handleGuess}
                        attemptsLeft={attempts}
                    />
                </div>
            </div>
        </GameLayout>
    );
};

export default Game;
