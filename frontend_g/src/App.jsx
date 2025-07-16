import { useState, useEffect } from "react";
import "./App.css";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import GameScreen from "./components/GameScreen/GameScreen";
import EndGameScreen from "./components/EndGameScreen/EndGameScreen";

function App() {
    const [gameState, setGameState] = useState("welcome"); // 'welcome', 'playing', 'finished'
    const [allGames, setAllGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [finalScore, setFinalScore] = useState(0);

    // Fetch all games from the backend on initial load
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch("/api/games");
                if (!response.ok) throw new Error("Network response was not ok");
                const games = await response.json();
                setAllGames(games);
            } catch (error) {
                console.error("Failed to fetch games:", error);
                // Handle error state in a real app, e.g., show an error message
            }
        };
        fetchGames();
    }, []);

    const handleStartGame = () => {
        if (allGames.length > 0) {
            // Randomly select a game from the fetched list
            const randomIndex = Math.floor(Math.random() * allGames.length);
            setSelectedGame(allGames[randomIndex]);
            setGameState("playing");
        }
    };

    const handleGameFinish = (score) => {
        setFinalScore(score);
        setGameState("finished");
    };

    const handlePlayAgain = () => {
        setSelectedGame(null);
        setFinalScore(0);
        setGameState("welcome");
    };

    const renderContent = () => {
        switch (gameState) {
            case "playing":
                return (
                    <GameScreen game={selectedGame} onGameFinish={handleGameFinish} />
                );
            case "finished":
                return (
                    <EndGameScreen
                        game={selectedGame}
                        finalTime={finalScore}
                        onPlayAgain={handlePlayAgain}
                    />
                );
            case "welcome":
            default:
                return <WelcomeScreen onStartGame={handleStartGame} />;
        }
    };

    return <div className="App">{renderContent()}</div>;
}

export default App;
