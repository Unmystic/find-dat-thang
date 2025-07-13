import React, { useEffect, useRef } from "react";

const ImageViewer = ({ imageUrl, scale, position, onLoad }) => {
    const imgRef = useRef(null);

    useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete) {
            // If image is already loaded (cached), trigger onLoad immediately
            onLoad();
        }
    }, [imageUrl, onLoad]);

    return (
        <img
            ref={imgRef}
            src={imageUrl}
            alt="Find the hidden object"
            className="game-image"
            style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "top left",
            }}
            onLoad={onLoad}
        />
    );
};

export default ImageViewer;
