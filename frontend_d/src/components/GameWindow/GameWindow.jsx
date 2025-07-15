import React, { useState, useEffect, useCallback, useRef } from "react";
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
        imgRef,
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

    const positionRef = useRef(position);
    const scaleRef = useRef(scale);

    useEffect(() => {
        positionRef.current = position;
        scaleRef.current = scale;
    }, [position, scale]);

    const handleImageLoad = useCallback(
        (img) => {
            setIsLoading(false);
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;
            setImageDimensions({ width: imgWidth, height: imgHeight });
            centerImage();
        },
        [centerImage],
    );

    useEffect(() => {
        updateBounds();
        const handleResize = () => updateBounds();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [updateBounds]);

    const handleImageClick = useCallback(
        (e) => {
            if (!isPlaying || attemptsLeft <= 0 || !imgRef.current) return;
            console.log("Image clicked"); // Debugging

            const rect = containerRef.current.getBoundingClientRect();
            const img = imgRef.current;

            // Get current position and scale from refs
            const currentPosition = positionRef.current;
            const currentScale = scaleRef.current;

            // Calculate coordinates relative to container
            const containerX = e.clientX - rect.left;
            const containerY = e.clientY - rect.top;

            // Convert to image coordinates
            const x = (containerX - currentPosition.x) / currentScale;
            const y = (containerY - currentPosition.y) / currentScale;

            // Check if click is within image bounds
            if (x < 0 || y < 0 || x >= img.naturalWidth || y >= img.naturalHeight) {
                return;
            }

            // Create a box that scales with zoom level
            const boxSize = 300 * (1 / Math.max(currentScale, 0.5));
            const box = {
                x: x - boxSize / 2,
                y: y - boxSize / 2,
                width: boxSize,
                height: boxSize,
            };
            console.log("Setting target box:", box); // Debugging
            setTargetBox(box);
        },
        [isPlaying, attemptsLeft, imgRef],
    );

    const handleSubmitGuess = () => {
        if (targetBox) {
            console.log("Submitting guess:", targetBox); // Debugging
            onGuess(targetBox);
            setTargetBox(null);
        }
    };

    // Reset when image changes
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
                style={{ cursor: handlers.onMouseDown ? "grabbing" : "pointer" }}
            >
                <ImageViewer
                    ref={imgRef}
                    imageUrl={imageUrl}
                    scale={scale}
                    position={position}
                    onLoad={handleImageLoad}
                />

                {targetBox && (
                    <GuessBox
                        box={targetBox}
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
