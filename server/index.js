// This is the main entry point for our Node/Express backend

require("dotenv").config();
const documentRoutes = require("./routes/documentRoutes");

const express = require("express");
const cors = require("cors");
const connectDatabase = require("./db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const port = process.env.PORT || 5000;

// This lets Express understand JSON data sent in requests
app.use(express.json());
app.use(cors());

// Connect to MongoDB when the server starts
connectDatabase();

app.get("/health", function (req, res) {
    res.json({ status: "ok", service: "documind-node-server" });
});

// Any URL starting with /api/auth will be handled by authRoutes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/documents", documentRoutes);

app.listen(port, function () {
    console.log("Node server is running on http://localhost:" + port);
});
