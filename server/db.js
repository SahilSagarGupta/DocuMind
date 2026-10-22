// This file handles connecting our Node server to MongoDB

const mongoose = require("mongoose");

// This function tries to connect to MongoDB using the URI from .env
function connectDatabase() {
    const mongoUri = process.env.MONGO_URI;

    mongoose.connect(mongoUri)
        .then(function () {
            console.log("Connected to MongoDB successfully.");
        })
        .catch(function (error) {
            console.log("Failed to connect to MongoDB.");
            console.log(error);
        });
}

module.exports = connectDatabase;