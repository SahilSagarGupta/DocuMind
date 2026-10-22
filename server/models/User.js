// This file defines what a "user" looks like in our database
// Every user saved to MongoDB must follow this structure

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["employee", "admin", "superadmin"],
        default: "employee"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Turn the schema into a model we can use to save/find users
const User = mongoose.model("User", userSchema);

module.exports = User;