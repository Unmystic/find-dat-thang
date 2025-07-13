import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
} from "react";

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState({
        isPlaying: false,
        attempts: 3,
        time: 0,
        timerActive: false,
        message: null,
    });

    // Memoize startGame with useCallback
    const startGame = useCallback(() => {
        setGameState({
            isPlaying: true,
            attempts: 3,
            time: 0,
            timerActive: true,
            message: null,
        });
    }, []);

    // Memoize endGame with useCallback
    const endGame = useCallback((message) => {
        setGameState((prev) => ({
            ...prev,
            isPlaying: false,
            timerActive: false,
            message,
        }));
    }, []);

    // Memoize makeGuess with useCallback
    const makeGuess = useCallback((isCorrect) => {
        setGameState((prev) => {
            if (!isCorrect) {
                const newAttempts = prev.attempts - 1;
                if (newAttempts <= 0) {
                    return {
                        ...prev,
                        attempts: newAttempts,
                        timerActive: false,
                        isPlaying: false,
                        message: { type: "error", text: "Game Over! No attempts left." },
                    };
                } else {
                    return {
                        ...prev,
                        attempts: newAttempts,
                        time: prev.time + 10000, // Add 10 second penalty
                        message: { type: "warning", text: "Wrong guess! Try again." },
                    };
                }
            } else {
                return {
                    ...prev,
                    timerActive: false,
                    isPlaying: false,
                    message: { type: "success", text: "Congratulations! You found it!" },
                };
            }
        });
    }, []);

    const clearMessage = useCallback(() => {
        setGameState((prev) => ({ ...prev, message: null }));
    }, []);

    return (
        <GameContext.Provider
            value={{
                ...gameState,
                startGame,
                makeGuess,
                clearMessage,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};
