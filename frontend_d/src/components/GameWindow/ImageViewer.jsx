import React, { forwardRef } from "react";

const ImageViewer = forwardRef(({ imageUrl, scale, position, onLoad }, ref) => {
    return (
        <img
            ref={ref}
            src={imageUrl}
            alt="Find the hidden object"
            className="game-image"
            style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "center",
            }}
            onLoad={(e) => onLoad(e.target)}
        />
    );
});

export default ImageViewer;
