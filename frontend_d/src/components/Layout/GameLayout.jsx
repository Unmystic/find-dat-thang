import React from "react";
import Header from "./Header";
import Message from "../UI/Message";

const GameLayout = ({ children, message }) => {
    return (
        <div className="game-layout">
            <Header />
            {message && <Message type={message.type} text={message.text} />}
            <main>{children}</main>
        </div>
    );
};

export default GameLayout;
