import { useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Header from "./components/Header/Header";
import WelcomeScreen from "./pages/WelcomeScreen";
import GameScreen from "./components/GameScreen/GameScreen";
import EndGameScreen from "./components/EndGameScreen/EndGameScreen";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateGamePage from "./pages/CreateGamePage";
import "./App.css";

function App() {
    const [page, setPage] = useState("welcome");
    const [activeGame, setActiveGame] = useState(null);
    const [gameResult, setGameResult] = useState(null);
    const { user } = useContext(AuthContext);

    const handleNavigate = (targetPage) => setPage(targetPage);

    const handleStartGame = (game) => {
        setActiveGame(game);
        setPage("playing");
    };

    const handleGameFinish = (result) => {
        setGameResult(result);
        setPage("finished");
    };

    const renderPage = () => {
        // Protected Route Logic
        if (
            page === "create-game" &&
            (!user || !["ADMIN", "EDITOR"].includes(user.role))
        ) {
            // If not an authorized user, just show the welcome screen
            return (
                <WelcomeScreen
                    onNavigate={handleNavigate}
                    onStartGame={handleStartGame}
                />
            );
        }

        switch (page) {
            case "login":
                return <LoginPage onNavigate={handleNavigate} />;
            case "register":
                return <RegisterPage onNavigate={handleNavigate} />;
            case "playing":
                return <GameScreen game={activeGame} onGameFinish={handleGameFinish} />;
            case "finished":
                return (
                    <EndGameScreen
                        game={activeGame}
                        result={gameResult}
                        onPlayAgain={() => setPage("welcome")}
                    />
                );
            case "create-game":
                return <CreateGamePage onNavigate={handleNavigate} />;
            case "welcome":
            default:
                return (
                    <WelcomeScreen
                        onNavigate={handleNavigate}
                        onStartGame={handleStartGame}
                    />
                );
        }
    };

    return (
        <div className="App">
            <Header onNavigate={handleNavigate} />
            <main>{renderPage()}</main>
        </div>
    );
}

export default App;
