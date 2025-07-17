// File: backend/src/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const gameRoutes = require("./routes/gameRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ... imports
const passport = require("./config/passport"); // Use configured passport
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize()); // Initialize passport

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRoutes); // Add auth routes
app.use("/api/games", gameRoutes);

// Routes
app.use("/api/games", gameRoutes);

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
