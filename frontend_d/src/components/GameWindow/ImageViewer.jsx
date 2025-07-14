import React, { useEffect, useRef } from "react";

const ImageViewer = ({ imageUrl, scale, position, onLoad }) => {
    const imgRef = useRef(null);

    useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete) {
            onLoad(img);
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
            onLoad={(e) => onLoad(e.target)}
        />
    );
};

export default ImageViewer;
