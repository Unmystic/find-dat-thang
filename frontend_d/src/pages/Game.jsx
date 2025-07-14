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

        // For now, simulate: hidden object at (300,300) with size 100x100
        const target = {
            x: 300,
            y: 300,
            width: 100,
            height: 100,
            center: { x: 350, y: 350 }, // Center of target
        };

        // Check if target center is within the box
        const isHit =
            target.center.x >= box.x &&
            target.center.x <= box.x + box.width &&
            target.center.y >= box.y &&
            target.center.y <= box.y + box.height;

        // Check proximity to center (within 25% of box size)
        const boxCenterX = box.x + box.width / 2;
        const boxCenterY = box.y + box.height / 2;
        const distance = Math.sqrt(
            Math.pow(target.center.x - boxCenterX, 2) +
            Math.pow(target.center.y - boxCenterY, 2),
        );

        // Require target to be near center of box
        const maxDistance = Math.min(box.width, box.height) * 0.25;
        const isCenterHit = distance <= maxDistance;

        // For now, require center hit
        makeGuess(isCenterHit);
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
