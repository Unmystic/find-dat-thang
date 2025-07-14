import { useState, useRef } from "react";
import ImageViewport from "../components/ImageViewport";
import GameHUD from "../components/GameHUD";
import GuessButton from "../components/GuessButton";
import useTimer from "../hooks/useTimer";
import "../styles/game.css";

export default function GamePage() {
    const [guessBox, setGuessBox] = useState(null);
    const [attempts, setAttempts] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState("Find the hidden object!");

    const imageRef = useRef(null);
    const { time, startTimer, addPenalty } = useTimer();

    const handleImageClick = (pos) => {
        if (gameOver || attempts === 0) return;
        setGuessBox({ ...pos, status: "pending" });
        startTimer();
    };

    const handleGuess = async () => {
        if (!guessBox || guessBox.status !== "pending") return;

        const isCorrect = Math.random() < 0.2; // stub
        const status = isCorrect ? "correct" : "wrong";
        setGuessBox({ ...guessBox, status });

        if (isCorrect) {
            setMessage("🎉  You found it!");
            setGameOver(true);
        } else {
            const left = attempts - 1;
            setAttempts(left);
            addPenalty(10);
            if (left === 0) {
                setMessage("💥  Game Over – no attempts left.");
                setGameOver(true);
            } else {
                setMessage("❌  Wrong – try again!");
                setTimeout(() => setGuessBox(null), 1200);
            }
        }
    };

    return (
        <div className="layout">
            <GameHUD
                attempts={attempts}
                time={time}
                message={message}
                gameOver={gameOver}
            />
            <div className="center-stage">
                <ImageViewport
                    imageRef={imageRef}
                    onClick={handleImageClick}
                    box={guessBox}
                />
                {!gameOver && (
                    <GuessButton
                        disabled={!guessBox || guessBox.status !== "pending"}
                        onClick={handleGuess}
                    />
                )}
            </div>
        </div>
    );
}
