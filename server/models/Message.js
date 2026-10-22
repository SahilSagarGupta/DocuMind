// This file defines a single message inside a chat session

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatSession",
        required: true
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    sourcePages: {
        type: [Number],
        default: []
    },
    sourceSnippets: {
        type: [
            {
                page_number: Number,
                text: String
            }
        ],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;