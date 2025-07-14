export default function ZoomControls({ imageRef }) {
  const zoom = (factor) => {
    const img = imageRef.current;
    if (!img) return;
    const newScale = (parseFloat(img.style.scale || 1) * factor).toFixed(2);
    img.style.scale = Math.max(1, newScale);
  };

  return (
    <div className="zoom-controls">
      <button onClick={() => zoom(1.2)}>🔍+</button>
      <button onClick={() => zoom(0.8)}>🔍-</button>
    </div>
  );
}
