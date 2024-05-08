const express = require("express");
const router = express.Router();
const User = require("../Models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../Middlewares/verifyJWT");

require("dotenv").config();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Example protected route
router.get("/protected", verifyToken, (req, res) => {
	res.status(200).json({ message: "Protected route accessed successfully" });
});

// Signup route
router.post("/auth/signup", async (req, res) => {
	const { email, password } = req.body;
	if (
		!email ||
		!password ||
		typeof email !== "string" ||
		typeof password !== "string"
	) {
		return res.status(400).json({ message: "Invalid email or password" });
	}
	// Check if user already exists
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return res.status(400).json({ message: "User already exists" });
	}
	// Hash password
	const hashedPassword = await bcrypt.hash(password, 10);
	// Create new user
	const newUser = new User({ email, password: hashedPassword });
	await newUser.save();
	res.status(201).json({ message: "User created successfully" });
});

// Login route
router.post("/auth/login", async (req, res) => {
	const { email, password } = req.body;
	if (
		!email ||
		!password ||
		typeof email !== "string" ||
		typeof password !== "string"
	) {
		return res.status(400).json({ message: "Invalid email or password" });
	}
	// Find user in database
	const user = await User.findOne({ email });
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(403).json({ message: "Invalid email or password" });
	}
	// Generate JWT tokens
	const accessToken = jwt.sign({ userId: user._id, email }, JWT_SECRET, {
		expiresIn: "15m",
	});
	const refreshToken = jwt.sign({ userId: user._id, email }, JWT_SECRET, {
		expiresIn: "7d",
	});
	res.status(200).json({ accessToken, refreshToken });
});

// Refresh route
router.post("/auth/refresh", (req, res) => {
	const { refreshToken } = req.body;
	if (!refreshToken) {
		return res.status(401).json({ message: "Refresh token is missing" });
	}
	jwt.verify(refreshToken, JWT_SECRET, async (err, user) => {
		if (err)
			return res
				.status(403)
				.json({ message: "Invalid or expired refresh token" });
		const accessToken = jwt.sign(
			{ userId: user.userId, email: user.email },
			JWT_SECRET,
			{ expiresIn: "15m" }
		);
		const newRefreshToken = jwt.sign(
			{ userId: user.userId, email: user.email },
			JWT_SECRET,
			{ expiresIn: "7d" }
		);
		res.status(200).json({ accessToken, refreshToken: newRefreshToken });
	});
});


module.exports = router;