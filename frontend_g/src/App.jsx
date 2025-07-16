import { useState } from "react";
import "./App.css";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import GameScreen from "./components/GameScreen/GameScreen";

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);

  const startGame = () => {
    setIsGameStarted(true);
  };

  return (
    <div className="App">
      {!isGameStarted ? (
        <WelcomeScreen onStartGame={startGame} />
      ) : (
        <GameScreen
          imageUrl="/images/1_polar-bear2.jpeg"
          target={{ name: "Polar Bear" }}
        />
      )}
    </div>
  );
}

export default App;
