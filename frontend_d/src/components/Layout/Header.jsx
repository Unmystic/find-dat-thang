import React from "react";
import { Link } from "react-router-dom";
import Button from "../UI/Button";

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <Link to="/">
                    <h1>Find dat thang!</h1>
                </Link>
            </div>
            <div className="game-info">
                <Link to="/">
                    <Button variant="secondary" size="small">
                        Main Menu
                    </Button>
                </Link>
            </div>
        </header>
    );
};

export default Header;
