import React, { useState, useEffect } from "react";
import "./EndGameScreen.css";

const EndGameScreen = ({ game, finalTime, onPlayAgain }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [playerName, setPlayerName] = useState("");
    const [scoreSubmitted, setScoreSubmitted] = useState(false);

    const wasWin = finalTime > 0; // Simple check if the game was won

    // Fetch leaderboard scores
    const fetchScores = async () => {
        try {
            const response = await fetch(`/api/games/${game.id}/scores`);
            const data = await response.json();
            setLeaderboard(data);
        } catch (error) {
            console.error("Failed to fetch scores:", error);
        }
    };

    useEffect(() => {
        fetchScores();
    }, [game.id]);

    const handleSubmitScore = async (e) => {
        e.preventDefault();
        if (!playerName.trim()) return;

        try {
            await fetch(`/api/games/${game.id}/scores`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ playerName, timeInSeconds: finalTime }),
            });
            setScoreSubmitted(true);
            fetchScores(); // Refresh the leaderboard
        } catch (error) {
            console.error("Failed to submit score:", error);
        }
    };

    const formatTime = (seconds) =>
        `${Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

    return (
        <div className="endgame-container">
            <div className="endgame-card">
                <h1>{wasWin ? "Congratulations!" : "Game Over"}</h1>
                {wasWin && (
                    <p className="final-time">Your time: {formatTime(finalTime)}</p>
                )}

                {wasWin && !scoreSubmitted && (
                    <form onSubmit={handleSubmitScore} className="score-form">
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            required
                        />
                        <button type="submit">Submit Score</button>
                    </form>
                )}

                <div className="leaderboard">
                    <h2>Leaderboard</h2>
                    <ol>
                        {leaderboard.map((score) => (
                            <li key={score.id}>
                                <span>{score.playerName}</span>
                                <span>{formatTime(score.timeInSeconds)}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                <button className="play-again-button" onClick={onPlayAgain}>
                    Play Again
                </button>
            </div>
        </div>
    );
};

export default EndGameScreen;
