// This file defines what a "document" looks like in our database

const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["processing", "indexed", "failed"],
        default: "processing"
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatSession",
        required: true
    },
});

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;