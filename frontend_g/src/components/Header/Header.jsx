import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Header.css";

const Header = ({ onNavigate }) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="app-header">
            <div className="header-title" onClick={() => onNavigate("welcome")}>
                Find Dat Thang!
            </div>
            <nav className="header-nav">
                {user ? (
                    <>
                        <span className="user-greeting">Welcome, {user.name}!</span>
                        {["ADMIN", "EDITOR"].includes(user.role) && (
                            <button
                                onClick={() => onNavigate("create-game")}
                                className="nav-button"
                            >
                                Create Game
                            </button>
                        )}
                        <button onClick={logout} className="nav-button">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => onNavigate("login")} className="nav-button">
                            Login
                        </button>
                        <button
                            onClick={() => onNavigate("register")}
                            className="nav-button"
                        >
                            Register
                        </button>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
