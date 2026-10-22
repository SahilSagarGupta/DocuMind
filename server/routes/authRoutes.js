// This file defines the URLs (routes) related to authentication

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// GET /api/auth/profile - a protected test route
// verifyToken runs FIRST, and only calls the next function if the token is valid
router.get("/profile", verifyToken, function (req, res) {
    res.status(200).json({
        message: "You are authenticated.",
        user: req.user
    });
});

module.exports = router;