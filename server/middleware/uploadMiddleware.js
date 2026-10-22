// This file configures multer to control how uploaded files are saved

const multer = require("multer");
const path = require("path");

// Tell multer where to save files and what to name them
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "uploads/");
    },
    filename: function (req, file, callback) {
        // Add a timestamp to the filename so two uploads never overwrite each other
        const uniqueName = Date.now() + "-" + file.originalname;
        callback(null, uniqueName);
    }
});

// Only allow certain file types to be uploaded
function fileFilter(req, file, callback) {
    const allowedTypes = [".pdf", ".docx", ".txt"];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(fileExtension)) {
        callback(null, true);
    } else {
        callback(new Error("Only PDF, DOCX, and TXT files are allowed."));
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;