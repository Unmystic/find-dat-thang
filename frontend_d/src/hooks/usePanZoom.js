import { useCallback, useState, useRef } from "react";

export default function usePanZoom() {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const handleMouseDown = useCallback(
        (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            isDragging.current = true;
            dragStart.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            };
            document.body.style.cursor = "grabbing";
        },
        [position],
    );

    const handleMouseMove = useCallback((e) => {
        if (!isDragging.current) return;

        setPosition({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y,
        });
    }, []);

    const handleMouseUp = useCallback(() => {
        if (isDragging.current) {
            isDragging.current = false;
            document.body.style.cursor = "default";
        }
    }, []);

    const handleZoom = useCallback((e) => {
        e.preventDefault();
        const zoomIntensity = 0.1;
        const delta = e.deltaY > 0 ? -1 : 1;
        setScale((prev) =>
            Math.max(0.5, Math.min(3, prev + delta * zoomIntensity)),
        );
    }, []);

    return {
        scale,
        position,
        setPosition,
        setScale,
        containerRef,
        handlers: {
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
            onMouseLeave: handleMouseUp,
            onWheel: handleZoom,
        },
    };
}
