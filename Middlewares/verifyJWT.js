require("dotenv").config();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) return res.sendStatus(401); // Unauthorized
	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) return res.sendStatus(403); // Forbidden
		req.user = user;
		next();
	});
};


module.exports = verifyToken;