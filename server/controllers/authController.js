// This file handles user registration and login logic

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// This function handles a new user signing up
async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;

        // Basic check: make sure all fields were sent
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email, and password." });
        }

        // Check if a user with this email already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "A user with this email already exists." });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
}

// This function handles a user logging in
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Basic check: make sure both fields were sent
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password." });
        }

        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Compare the given password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // If we reach here, the login is correct - create a JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful.",
            token: token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
}

module.exports = { registerUser, loginUser };