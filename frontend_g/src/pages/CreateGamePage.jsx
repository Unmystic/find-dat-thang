import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./CreateGamePage.css";

const CreateGamePage = ({ onNavigate }) => {
    const [imageFile, setImageFile] = useState(null);
    const [previewURL, setPreviewURL] = useState("");
    const [title, setTitle] = useState("");
    const [targetName, setTargetName] = useState("");
    const [coords, setCoords] = useState(null);
    const { token } = useContext(AuthContext);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    const handleImageClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setCoords({ x, y });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile || !coords || !title || !targetName) {
            alert("Please fill all fields and select a target location.");
            return;
        }

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("title", title);
        formData.append("targetName", targetName);
        formData.append("x", coords.x);
        formData.append("y", coords.y);
        formData.append("radius", 7.5); // Default radius

        try {
            const response = await fetch("/api/games", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!response.ok) throw new Error("Failed to create game.");
            alert("Game created successfully!");
            onNavigate("welcome");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="create-game-container">
            <form onSubmit={handleSubmit} className="create-game-form">
                <h2>Create New Game</h2>
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
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                />
                <button type="submit">Create Game</button>
                <button type="button" onClick={() => onNavigate("welcome")}>
                    Cancel
                </button>
            </form>
            <div className="image-preview-area">
                <h3>Click on the image to set the target location</h3>
                {previewURL && (
                    <div className="preview-wrapper" onClick={handleImageClick}>
                        <img src={previewURL} alt="Preview" />
                        {coords && (
                            <div
                                className="target-marker"
                                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateGamePage;
