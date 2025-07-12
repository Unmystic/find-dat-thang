import React from "react";
import "./WelcomeScreen.css";

const WelcomeScreen = ({ onStartGame }) => {
    return (
        <div className="welcome-container">
            <h1 className="title">Find dat thang!</h1>
            <p className="subtitle">Find the hidden object as fast as you can.</p>
            <button className="start-button" onClick={onStartGame}>
                Play as Guest
            </button>
        </div>
    );
};

export default WelcomeScreen;
