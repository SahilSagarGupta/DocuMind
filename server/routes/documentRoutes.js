// This file defines the URLs (routes) related to documents

const express = require("express");
const router = express.Router();
const { uploadDocument, getUserDocuments, deleteDocument } = require("../controllers/documentController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// POST /api/documents
router.post("/", verifyToken, upload.single("file"), uploadDocument);

// GET /api/documents
router.get("/", verifyToken, getUserDocuments);

// DELETE /api/documents/:id
router.delete("/:id", verifyToken, deleteDocument);

module.exports = router;