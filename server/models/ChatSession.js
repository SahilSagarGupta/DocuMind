// This file defines a chat session - a conversation thread for a user

const mongoose = require("mongoose");

const chatSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        default: "New Chat"
    },
    pinned: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);

module.exports = ChatSession;