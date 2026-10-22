// This file handles document upload logic

const ChatSession = require("../models/ChatSession");
const fs = require("fs");
const Document = require("../models/Document");
const path = require("path");
const axios = require("axios");

// The URL where our Python AI service is running
const AI_SERVICE_URL = "http://127.0.0.1:8000";

// This function handles a file being uploaded into a chat
async function uploadDocument(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file was uploaded." });
        }

        // Find the chat this document belongs to, or create a new chat for it
        const sessionIdFromUser = req.body.sessionId;
        let session;

        if (sessionIdFromUser) {
            session = await ChatSession.findOne({
                _id: sessionIdFromUser,
                userId: req.user.userId
            });

            if (!session) {
                // The chat was not found, so remove the file we just saved
                fs.unlinkSync(req.file.path);
                return res.status(404).json({ message: "Chat session not found." });
            }
        } else {
            session = new ChatSession({ userId: req.user.userId });
            await session.save();
        }

        const fileExtension = path.extname(req.file.originalname).toLowerCase();

        const newDocument = new Document({
            ownerId: req.user.userId,
            sessionId: session._id,
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: fileExtension
        });

        await newDocument.save();

        res.status(201).json({
            message: "Document uploaded successfully. Processing has started.",
            sessionId: session._id,
            document: newDocument
        });

        processDocumentWithAI(newDocument);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while uploading the document." });
    }
}

// This function calls our Python AI service to chunk and embed the document
// It runs AFTER we've already responded to the user, so it doesn't slow down their upload
async function processDocumentWithAI(document) {
  try {
    const absolutePath = path.resolve(document.filePath);

    const response = await axios.post(AI_SERVICE_URL + "/ai/ingest", {
      file_path: absolutePath,
    });

    if (response.data.status === "success") {
      document.status = "indexed";
      await document.save();
      console.log("Document processed successfully:", document.fileName);
    } else {
      document.status = "failed";
      await document.save();
      console.log("Document processing failed:", response.data.error);
    }
  } catch (error) {
    document.status = "failed";
    await document.save();
    console.log("Could not reach AI service:", error.message);
  }
}

// This function returns all documents uploaded by the logged-in user
async function getUserDocuments(req, res) {
    try {
        const filter = { ownerId: req.user.userId };

        // If the URL has ?sessionId=..., show only the documents of that chat
        if (req.query.sessionId) {
            filter.sessionId = req.query.sessionId;
        }

        const documents = await Document.find(filter).sort({ uploadedAt: -1 });

        res.status(200).json({
            documents: documents
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while fetching your documents." });
    }
}

// This function deletes a document: from MongoDB, from disk, and from ChromaDB
async function deleteDocument(req, res) {
    try {
        const documentId = req.params.id;

        // Find the document, but only if it belongs to the logged-in user
        const document = await Document.findOne({
            _id: documentId,
            ownerId: req.user.userId
        });

        if (!document) {
            return res.status(404).json({ message: "Document not found." });
        }

        // Step 1: delete the actual file from disk
        const absolutePath = path.resolve(document.filePath);
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }

        // Step 2: ask the Python AI service to delete this document's chunks
        try {
            await axios.post(AI_SERVICE_URL + "/ai/delete", {
                document_id: absolutePath
            });
        } catch (aiError) {
            console.log("Warning: could not delete chunks from ChromaDB:", aiError.message);
            // We continue anyway - the document record and file are already gone,
            // so we don't want to block the user just because this step failed
        }

        // Step 3: delete the document record from MongoDB
        await Document.deleteOne({ _id: documentId });

        res.status(200).json({ message: "Document deleted successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while deleting the document." });
    }
}

// This function removes a document's file from disk and its chunks from ChromaDB.
// The MongoDB record is deleted by whoever calls this function.
async function removeDocumentData(document) {
    const absolutePath = path.resolve(document.filePath);

    if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
    }

    try {
        await axios.post(AI_SERVICE_URL + "/ai/delete", {
            document_id: absolutePath
        });
    } catch (aiError) {
        console.log("Warning: could not delete chunks from ChromaDB:", aiError.message);
    }
}

module.exports = { uploadDocument, getUserDocuments, deleteDocument, removeDocumentData };

