// File: backend/src/controllers/gameController.js
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const prisma = new PrismaClient();

// --- Multer Configuration ---
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/uploads/"); // Store files in backend/public/uploads
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});
exports.upload = multer({ storage: storage });

// GET /api/games
// Fetches all available games
const getAllGames = async (req, res) => {
    try {
        const games = await prisma.game.findMany({
            select: {
                id: true,
                title: true,
                imageUrl: true,
                // Add this to include the target's name
                target: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch games" });
    }
};

// ... other functions

module.exports = {
    getAllGames,
    // ... other exports
};

// GET /api/games/:id
// Fetches a single game by its ID, without revealing the target location
const getGameById = async (req, res) => {
    const { id } = req.params;
    try {
        const game = await prisma.game.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                imageUrl: true,
            },
        });
        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }
        res.json(game);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch game details" });
    }
};

// POST /api/games/:id/guess
// Checks if the user's guess is correct
const submitGuess = async (req, res) => {
    const { id } = req.params;
    const { x, y } = req.body; // User's guess coordinates (in %)

    if (typeof x !== "number" || typeof y !== "number") {
        return res.status(400).json({ error: "Invalid coordinates provided." });
    }

    try {
        const target = await prisma.target.findUnique({
            where: { gameId: id },
        });

        if (!target) {
            return res.status(404).json({ error: "Target for this game not found." });
        }

        // Calculate the distance between the guess and the target's center
        const distance = Math.sqrt(
            Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2),
        );

        // Check if the distance is within the target's acceptable radius
        const isCorrect = distance <= target.radius;

        res.json({ correct: isCorrect });
    } catch (error) {
        res.status(500).json({ error: "Error processing guess." });
    }
};

// GET /api/games/:id/scores
// Fetches the leaderboard for a game
const getGameScores = async (req, res) => {
    const { id } = req.params;
    try {
        const scores = await prisma.score.findMany({
            where: { gameId: id },
            orderBy: {
                timeInSeconds: "asc",
            },
            take: 10, // Get top 10 scores
        });
        res.json(scores);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch scores." });
    }
};

// POST /api/games/:id/scores
// Adds a new score to the leaderboard
const addScore = async (req, res) => {
    const { id } = req.params;
    const { playerName, timeInSeconds } = req.body;

    if (!playerName || typeof timeInSeconds !== "number") {
        return res
            .status(400)
            .json({ error: "Player name and time are required." });
    }

    try {
        const newScore = await prisma.score.create({
            data: {
                playerName,
                timeInSeconds,
                gameId: id,
            },
        });
        res.status(201).json(newScore);
    } catch (error) {
        res.status(500).json({ error: "Failed to save score." });
    }
};

// POST /api/games - Creates a new game
exports.createGame = async (req, res) => {
    const { title, targetName, x, y, radius } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`; // URL accessible by the frontend

    try {
        const newGame = await prisma.game.create({
            data: {
                title,
                imageUrl,
                target: {
                    create: {
                        name: targetName,
                        x: parseFloat(x),
                        y: parseFloat(y),
                        radius: parseFloat(radius),
                    },
                },
            },
        });
        res.status(201).json(newGame);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create game." });
    }
};

module.exports = {
    getAllGames,
    getGameById,
    submitGuess,
    getGameScores,
    addScore,
};
