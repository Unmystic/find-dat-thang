import React, { useState, useEffect, useCallback } from "react";
import ImageViewer from "./ImageViewer";
import GuessBox from "./GuessBox";
import usePanZoom from "../../hooks/usePanZoom";
import Button from "../UI/Button";

const GameWindow = ({ imageUrl, onGuess, attemptsLeft, isPlaying }) => {
    const {
        scale,
        position,
        setPosition,
        setScale,
        containerRef,
        handlers,
        centerImage,
        updateBounds,
    } = usePanZoom();

    const [targetBox, setTargetBox] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageDimensions, setImageDimensions] = useState({
        width: 0,
        height: 0,
    });

    const handleImageLoad = useCallback(
        (img) => {
            setIsLoading(false);
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;
            setImageDimensions({ width: imgWidth, height: imgHeight });

            // Center and fit image
            centerImage(imgWidth, imgHeight);
        },
        [centerImage],
    );

    useEffect(() => {
        if (imageDimensions.width && imageDimensions.height) {
            updateBounds(imageDimensions.width, imageDimensions.height);
        }

        const handleResize = () => {
            if (imageDimensions.width && imageDimensions.height) {
                updateBounds(imageDimensions.width, imageDimensions.height);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [imageDimensions, updateBounds]);

    const handleImageClick = useCallback(
        (e) => {
            if (!isPlaying || attemptsLeft <= 0 || imageDimensions.width === 0)
                return;

            const rect = containerRef.current.getBoundingClientRect();

            // Correct coordinate calculation:
            const containerX = e.clientX - rect.left;
            const containerY = e.clientY - rect.top;

            // Convert to image coordinates:
            const x = (containerX - position.x) / scale;
            const y = (containerY - position.y) / scale;

            // Check if click is within image bounds
            if (
                x < 0 ||
                y < 0 ||
                x >= imageDimensions.width ||
                y >= imageDimensions.height
            ) {
                return;
            }

            // Create a box that scales with zoom level (300px at 1x zoom)
            const boxSize = 300 * (1 / Math.max(scale, 0.5));
            const box = {
                x: x - boxSize / 2,
                y: y - boxSize / 2,
                width: boxSize,
                height: boxSize,
            };
            setTargetBox(box);
        },
        [isPlaying, attemptsLeft, position, scale, imageDimensions],
    );

    const handleSubmitGuess = () => {
        if (targetBox) {
            onGuess(targetBox);
            setTargetBox(null);
        }
    };

    // Reset position and scale when image changes
    useEffect(() => {
        setPosition({ x: 0, y: 0 });
        setScale(1);
        setTargetBox(null);
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
                style={{ cursor: handlers.onMouseDown ? "grabbing" : "default" }}
            >
                <ImageViewer
                    imageUrl={imageUrl}
                    scale={scale}
                    position={position}
                    onLoad={handleImageLoad}
                />

                {targetBox && (
                    <GuessBox
                        box={{ ...targetBox, status: "pending" }}
                        scale={scale}
                        position={position}
                        status="pending"
                    />
                )}
            </div>

            <div className="guess-controls">
                <Button
                    onClick={handleSubmitGuess}
                    disabled={!targetBox || !isPlaying || attemptsLeft <= 0}
                >
                    Make Guess
                </Button>
            </div>
        </div>
    );
};

export default GameWindow;
