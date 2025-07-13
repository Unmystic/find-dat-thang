import React from "react";

const Button = ({
    onClick,
    children,
    disabled = false,
    variant = "primary",
    size = "medium",
    fullWidth = false,
}) => {
    return (
        <button
            className={`button ${variant} ${size} ${fullWidth ? "full-width" : ""}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
