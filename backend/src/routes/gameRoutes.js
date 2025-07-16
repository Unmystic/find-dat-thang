// File: backend/src/routes/gameRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllGames,
  getGameById,
  getGameScores,
  submitGuess,
  addScore,
} = require("../controllers/gameController");

// GET /api/games - Get a list of all games
router.get("/", getAllGames);

// GET /api/games/:id - Get details for a single game
router.get("/:id", getGameById);

// GET /api/games/:id/scores - Get the leaderboard for a game
router.get("/:id/scores", getGameScores);

// POST /api/games/:id/guess - Submit a guess for a game
router.post("/:id/guess", submitGuess);

// POST /api/games/:id/scores - Add a new score to the leaderboard
router.post("/:id/scores", addScore);

module.exports = router;
