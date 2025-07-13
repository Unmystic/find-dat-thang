import React, { useEffect, useState } from "react";

const Message = ({ type, text, duration = 3000 }) => {
    const [visible, setVisible] = useState(!!text);

    useEffect(() => {
        setVisible(!!text);

        if (text && duration) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [text, duration]);

    if (!visible) return null;

    return <div className={`message ${type}`}>{text}</div>;
};

export default Message;
