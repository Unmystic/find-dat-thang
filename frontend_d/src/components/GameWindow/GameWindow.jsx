import React, { useState, useEffect, useCallback } from "react";
import ImageViewer from "./ImageViewer";
import GuessBox from "./GuessBox";
import usePanZoom from "../../hooks/usePanZoom";

const GameWindow = ({ imageUrl, onGuess, attemptsLeft }) => {
    const { scale, position, setPosition, setScale, containerRef, handlers } =
        usePanZoom();

    const [guessBox, setGuessBox] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Memoize the load handler
    const handleImageLoad = useCallback(() => {
        setIsLoading(false);
    }, []);

    const handleImageClick = (e) => {
        if (attemptsLeft <= 0) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - position.x) / scale;
        const y = (e.clientY - rect.top - position.y) / scale;

        const box = {
            x: x - 50,
            y: y - 50,
            width: 100,
            height: 100,
            status: "pending",
        };
        setGuessBox(box);
        onGuess(box);
    };

    // Reset position and scale when image changes
    useEffect(() => {
        setPosition({ x: 0, y: 0 });
        setScale(1);
        setGuessBox(null);
        setIsLoading(true);
    }, [imageUrl, setPosition, setScale]);

    return (
        <div className="game-window">
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Loading image...</p>
                </div>
            )}

            <div
                ref={containerRef}
                className="image-container"
                onClick={handleImageClick}
                {...handlers}
                style={{ cursor: handlers.onMouseDown ? "grab" : "default" }}
            >
                <ImageViewer
                    imageUrl={imageUrl}
                    scale={scale}
                    position={position}
                    onLoad={handleImageLoad}
                />

                <GuessBox box={guessBox} scale={scale} position={position} />
            </div>
        </div>
    );
};

export default GameWindow;
