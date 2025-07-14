import { useState } from "react";
import GamePage from "./pages/GamePage";

export default function App() {
  // Later we will toggle between Guest / Login / Game
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <main className="app">
      {!gameStarted ? (
        <section className="welcome">
          <h1>Find dat thang!</h1>
          <button onClick={() => setGameStarted(true)}>Play as Guest</button>
        </section>
      ) : (
        <GamePage />
      )}
    </main>
  );
}
