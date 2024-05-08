const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");

// ! initializing packages
const app = express();
require("dotenv").config();

// ! database connection using Mongoose
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("db Connected!");
	})
	.catch((error) => {
		console.log(error);
	});

// ! Cors
app.use(cors({ origin: process.env.CORS_URI, credentials: true }));

app.get("/", function (req, res) {
	res.send("server is working");
});

// ! server configuration
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// ! requiring routes
const auth = require("./Routes/auth");
app.use(auth);

// ! listening to port
// const port = process.env.PORT;
app.listen(process.env.PORT, () => {
	console.log(`server started on port ${process.env.PORT}`);
});
