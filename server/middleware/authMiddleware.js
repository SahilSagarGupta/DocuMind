// This middleware checks if a request has a valid JWT token
// If valid, it lets the request continue
// If not, it blocks the request with an error

const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    // The token is expected in the request header, like:
    // Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided. Please log in." });
    }

    // The header looks like "Bearer eyJhbGciOi..."
    // We split it and take just the token part
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided. Please log in." });
    }

    try {
        // Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user info to the request,
        // so later controller functions can use it (e.g. req.user.userId)
        req.user = decoded;

        // Let the request continue to the actual route handler
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
    }
}

module.exports = verifyToken;