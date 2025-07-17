// File: backend/src/routes/gameRoutes.js

const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
    upload,
    createGame,
    ...gameController
} = require("../controllers/gameController");

// Middleware to check for specific roles
const checkRole = (roles) => (req, res, next) => {
    if (roles.includes(req.user.role)) {
        return next();
    }
    return res.status(403).json({ error: "Forbidden: Insufficient role" });
};

// Public Routes
router.get("/", gameController.getAllGames);
router.get("/:id", gameController.getGameById);
router.get("/:id/scores", gameController.getGameScores);
router.post("/:id/guess", gameController.submitGuess);

// Protected Routes
router.post(
    "/:id/scores",
    passport.authenticate("jwt", { session: false }),
    gameController.addScore,
);

// Admin/Editor Route for creating games
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    checkRole(["ADMIN", "EDITOR"]),
    upload.single("image"), // Multer middleware for file upload
    createGame,
);

module.exports = router;
