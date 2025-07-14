import { useCallback, useState, useRef, useEffect } from "react";

export default function usePanZoom() {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const [bounds, setBounds] = useState({ minX: 0, maxX: 0, minY: 0, maxY: 0 });

    const updateBounds = useCallback(
        (imgWidth, imgHeight) => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const scaledWidth = imgWidth * scale;
            const scaledHeight = imgHeight * scale;

            const minX = Math.min(0, containerWidth - scaledWidth);
            const maxX = Math.max(0, containerWidth - scaledWidth);
            const minY = Math.min(0, containerHeight - scaledHeight);
            const maxY = Math.max(0, containerHeight - scaledHeight);

            setBounds({ minX, maxX, minY, maxY });

            // Clamp position to new bounds
            setPosition((prev) => ({
                x: Math.min(maxX, Math.max(minX, prev.x)),
                y: Math.min(maxY, Math.max(minY, prev.y)),
            }));
        },
        [scale],
    );

    const centerImage = useCallback(
        (imgWidth, imgHeight) => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const scaleX = containerWidth / imgWidth;
            const scaleY = containerHeight / imgHeight;
            const newScale = Math.min(scaleX, scaleY, 1);

            const newX = (containerWidth - imgWidth * newScale) / 2;
            const newY = (containerHeight - imgHeight * newScale) / 2;

            setScale(newScale);
            setPosition({ x: newX, y: newY });
            updateBounds(imgWidth, imgHeight);
        },
        [updateBounds],
    );

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

    const handleMouseMove = useCallback(
        (e) => {
            if (!isDragging.current) return;

            const newX = e.clientX - dragStart.current.x;
            const newY = e.clientY - dragStart.current.y;

            // Clamp position to bounds
            setPosition({
                x: Math.min(bounds.maxX, Math.max(bounds.minX, newX)),
                y: Math.min(bounds.maxY, Math.max(bounds.minY, newY)),
            });
        },
        [bounds],
    );

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

        setScale((prev) => {
            const newScale = Math.max(0.5, Math.min(3, prev + delta * zoomIntensity));
            return newScale;
        });
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            e.preventDefault();
            const zoomIntensity = 0.1;
            const delta = e.deltaY > 0 ? -1 : 1;
            setScale((prev) =>
                Math.max(0.5, Math.min(3, prev + delta * zoomIntensity)),
            );
        };

        container.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            container.removeEventListener("wheel", handleWheel);
        };
    }, []);

    // Remove wheel handler from returned handlers
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
        },
        centerImage,
        updateBounds,
    };
}
