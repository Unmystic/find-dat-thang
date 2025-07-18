import React, { useState, useEffect } from "react";
import "./WelcomeScreen.css";

const WelcomeScreen = ({ onStartGame }) => {
    const [games, setGames] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch("/api/games");
                if (!response.ok)
                    throw new Error("Could not fetch games from the server.");
                const data = await response.json();
                setGames(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchGames();
    }, []);

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>Choose a Game</h1>
                {error && <p className="error-message">{error}</p>}
                <div className="game-list">
                    {games.length > 0 ? (
                        games.map((game) => (
                            <div
                                key={game.id}
                                className="game-card"
                                onClick={() => onStartGame(game)}
                            >
                                <img src={game.imageUrl} alt={game.title} />
                                <div className="game-card-title">{game.title}</div>
                            </div>
                        ))
                    ) : (
                        <p>Loading games...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
