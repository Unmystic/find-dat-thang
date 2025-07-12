import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import TargetingBox from "../TargetingBox/TargetingBox";
import "./GameScreen.css";

const GameScreen = ({ imageUrl, target }) => {
    const [guess, setGuess] = useState(null); // { x, y }

    // This function will be called when the user clicks on the image.
    const handleImageClick = (e) => {
        // Get the click coordinates relative to the image element
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // We get the natural dimensions of the image to calculate relative coordinates
        const { naturalWidth, naturalHeight } = e.target;
        const relativeX = (x / rect.width) * 100;
        const relativeY = (y / rect.height) * 100;

        console.log(
            `Guess made at: ${relativeX.toFixed(2)}%, ${relativeY.toFixed(2)}%`,
        );

        setGuess({ x: relativeX, y: relativeY });
        // In the future, you would send these relative coordinates to the backend for validation.
    };

    return (
        <div className="game-container">
            <div className="game-header">
                <h2>
                    Find the: <strong>{target.name}</strong>
                </h2>
                {/* Timer will go here */}
            </div>
            <div className="image-viewport">
                <TransformWrapper
                    limitToBounds={true}
                    minScale={0.5}
                    initialScale={1}
                    initialPositionX={0}
                    initialPositionY={0}
                >
                    <TransformComponent
                        wrapperStyle={{ width: "100%", height: "100%" }}
                        contentStyle={{ width: "100%", height: "100%" }}
                    >
                        <div className="image-wrapper" onClick={handleImageClick}>
                            <img src={imageUrl} alt="Find the object" />
                            {guess && <TargetingBox position={guess} />}
                        </div>
                    </TransformComponent>
                </TransformWrapper>
            </div>
            <div className="controls-info">
                <p>🖱️ Use your mouse wheel to zoom in/out. Click and drag to pan.</p>
            </div>
        </div>
    );
};

export default GameScreen;
