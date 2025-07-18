import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./CreateGamePage.css";

const CreateGamePage = ({ onNavigate }) => {
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [title, setTitle] = useState("");
  const [targetName, setTargetName] = useState("");
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setCoords(null);
    }
  };

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !coords || !title || !targetName) {
      setError("Please fill all fields and select a target location.");
      return;
    }
    setError("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("targetName", targetName);
    formData.append("x", coords.x);
    formData.append("y", coords.y);
    formData.append("radius", 7.5);

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create game.");
      }
      alert("Game created successfully!");
      onNavigate("welcome");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-game-container">
      <form onSubmit={handleSubmit} className="create-game-form">
        <h2>Create New Game</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Game Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Target Name (e.g., Polar Bear)"
          value={targetName}
          onChange={(e) => setTargetName(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/jpeg, image/png, image/webp"
          onChange={handleFileChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Game"}
        </button>
        <button type="button" onClick={() => onNavigate("welcome")}>
          Cancel
        </button>
      </form>
      <div className="image-preview-area">
        <h3>Click on the image to set the target location</h3>
        {previewURL ? (
          <div className="preview-wrapper" onClick={handleImageClick}>
            <img src={previewURL} alt="Preview" />
            {coords && (
              <div
                className="target-marker"
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              />
            )}
          </div>
        ) : (
          <p>Upload an image to see a preview.</p>
        )}
      </div>
    </div>
  );
};

export default CreateGamePage;
