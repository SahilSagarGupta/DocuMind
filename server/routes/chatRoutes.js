// This file defines the URLs (routes) related to chat

const express = require("express");
const router = express.Router();
const {
    askQuestion,
    getSessionMessages,
    getUserSessions,
    renameSession,
    deleteSession,
    togglePinSession
} = require("../controllers/chatController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/ask", verifyToken, askQuestion);
router.get("/sessions", verifyToken, getUserSessions);
router.get("/sessions/:sessionId/messages", verifyToken, getSessionMessages);

// PATCH /api/chat/sessions/:sessionId - rename
router.patch("/sessions/:sessionId", verifyToken, renameSession);

// DELETE /api/chat/sessions/:sessionId - delete
router.delete("/sessions/:sessionId", verifyToken, deleteSession);

// PATCH /api/chat/sessions/:sessionId/pin - toggle pin
router.patch("/sessions/:sessionId/pin", verifyToken, togglePinSession);

module.exports = router;