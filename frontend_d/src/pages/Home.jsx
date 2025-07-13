import React from "react";
import Button from "../components/UI/Button";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="home-page">
            <div className="hero">
                <h1>Welcome to "Find dat thang!"</h1>
                <p>Can you find the hidden object in the image?</p>
                <Link to="/game">
                    <Button variant="primary" size="large">
                        Play as Guest
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
