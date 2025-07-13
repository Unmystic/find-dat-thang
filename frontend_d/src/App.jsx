import React from "react";
import { GameProvider } from "./contexts/GameContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";

function App() {
    return (
        <GameProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/game" element={<Game />} />
                </Routes>
            </Router>
        </GameProvider>
    );
}

export default App;
