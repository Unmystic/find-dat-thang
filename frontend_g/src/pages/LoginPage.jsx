import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./AuthForms.css"; // Shared CSS for login/register

const LoginPage = ({ onNavigate }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) throw new Error("Login failed");
            const data = await response.json();
            login(data.token);
            onNavigate("welcome"); // Navigate to welcome screen on success
        } catch (err) {
            setError(err.message || "Invalid credentials");
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
                <p>
                    Need an account?{" "}
                    <button
                        type="button"
                        onClick={() => onNavigate("register")}
                        className="link-button"
                    >
                        Register
                    </button>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
