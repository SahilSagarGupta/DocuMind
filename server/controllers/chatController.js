// This file handles chat logic: asking a question and saving the conversation
const axios = require("axios");
const ChatSession = require("../models/ChatSession");
const Message = require("../models/Message");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
const Document = require("../models/Document");
const path = require("path");
const { removeDocumentData } = require("./documentController");
// This function handles a user asking a question
// It creates a session if needed, calls the AI service, and saves both messages
// This function handles a user asking a question inside a chat
async function askQuestion(req, res) {
    try {
        const { question, sessionId } = req.body;

        if (!question) {
            return res.status(400).json({ message: "Please provide a question." });
        }

        // Step 1: find this user's existing chat, or create a new one
        let session;
        if (sessionId) {
            session = await ChatSession.findOne({
                _id: sessionId,
                userId: req.user.userId
            });

            if (!session) {
                return res.status(404).json({ message: "Chat session not found." });
            }
        } else {
            session = new ChatSession({ userId: req.user.userId });
            await session.save();
        }

        // Step 2: find the documents that belong to THIS chat only
        const chatDocuments = await Document.find({
            ownerId: req.user.userId,
            sessionId: session._id,
            status: "indexed"
        });

        const documentIds = chatDocuments.map(function (doc) {
            return path.resolve(doc.filePath);
        });

        // Step 3: save the user's question
        const userMessage = new Message({
            sessionId: session._id,
            role: "user",
            content: question
        });
        await userMessage.save();

        // Step 4: ask the Python AI service (it will search only these documents)
        const aiResponse = await axios.post(AI_SERVICE_URL + "/ai/query", {
            question: question,
            document_ids: documentIds
        });

        if (aiResponse.data.status !== "success") {
            return res.status(500).json({ message: "The AI service could not answer this question." });
        }

        const answerText = aiResponse.data.answer;
        const sourcePages = aiResponse.data.source_pages;
        const sourceSnippets = aiResponse.data.source_snippets;

        // Step 5: save the assistant's answer
        const assistantMessage = new Message({
            sessionId: session._id,
            role: "assistant",
            content: answerText,
            sourcePages: sourcePages,
            sourceSnippets: sourceSnippets
        });
        await assistantMessage.save();

        res.status(200).json({
            sessionId: session._id,
            answer: answerText,
            sourcePages: sourcePages,
            sourceSnippets: sourceSnippets
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while answering your question." });
    }
}
// This function returns all chat sessions belonging to the logged-in user
async function getUserSessions(req, res) {
    try {
        const sessions = await ChatSession.find({ userId: req.user.userId }).sort({ pinned: -1, createdAt: -1 });

        res.status(200).json({
            sessions: sessions
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while fetching your chats." });
    }
}

// This function returns the full message history for one chat session
async function getSessionMessages(req, res) {
    try {
        const sessionId = req.params.sessionId;

        // Confirm this session actually belongs to the logged-in user,
        // so users can't read each other's chat history
        const session = await ChatSession.findOne({
            _id: sessionId,
            userId: req.user.userId
        });

        if (!session) {
            return res.status(404).json({ message: "Chat session not found." });
        }

        const messages = await Message.find({ sessionId: sessionId }).sort({ createdAt: 1 });

        res.status(200).json({
            session: session,
            messages: messages
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while fetching chat history." });
    }
}

// This function renames a chat session
async function renameSession(req, res) {
    try {
        const sessionId = req.params.sessionId;
        const newTitle = req.body.title;

        if (!newTitle || newTitle.trim() === "") {
            return res.status(400).json({ message: "Please provide a new title." });
        }

        const session = await ChatSession.findOne({
            _id: sessionId,
            userId: req.user.userId
        });

        if (!session) {
            return res.status(404).json({ message: "Chat session not found." });
        }

        session.title = newTitle.trim();
        await session.save();

        res.status(200).json({ message: "Session renamed.", session: session });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while renaming the chat." });
    }
}


// This function deletes a chat session and all of its messages
async function deleteSession(req, res) {
    try {
        const sessionId = req.params.sessionId;

        const session = await ChatSession.findOne({
            _id: sessionId,
            userId: req.user.userId
        });

        if (!session) {
            return res.status(404).json({ message: "Chat session not found." });
        }

        // Delete every document uploaded inside this chat (file, chunks, and record)
        const sessionDocuments = await Document.find({
            sessionId: sessionId,
            ownerId: req.user.userId
        });

        for (let i = 0; i < sessionDocuments.length; i++) {
            await removeDocumentData(sessionDocuments[i]);
            await Document.deleteOne({ _id: sessionDocuments[i]._id });
        }

        // Delete every message that belongs to this session
        await Message.deleteMany({ sessionId: sessionId });

        // Then delete the session itself
        await ChatSession.deleteOne({ _id: sessionId });

        res.status(200).json({ message: "Chat deleted." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while deleting the chat." });
    }
}


// This function toggles a chat session between pinned and unpinned
async function togglePinSession(req, res) {
    try {
        const sessionId = req.params.sessionId;

        const session = await ChatSession.findOne({
            _id: sessionId,
            userId: req.user.userId
        });

        if (!session) {
            return res.status(404).json({ message: "Chat session not found." });
        }

        session.pinned = !session.pinned;
        await session.save();

        res.status(200).json({ message: "Pin status updated.", session: session });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while updating the pin." });
    }
}

module.exports = { askQuestion, getSessionMessages, getUserSessions, renameSession, deleteSession, togglePinSession };
