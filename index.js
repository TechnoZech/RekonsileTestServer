const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const LoggingService = require("./middlewares/loggingService");

// Initialize logging service
const loggingService = new LoggingService(process.env.LOG_LEVEL);

const app = express();
require("dotenv").config();

// Database connection using Mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    loggingService.log('info', "db Connected!");
  })
  .catch((error) => {
    loggingService.logError(error);
  });

// Cors
app.use(cors({ origin: process.env.CORS_URI, credentials: true }));

app.get("/", function (req, res) {
  res.send("server is working");
});

// Server configuration
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Middleware to log incoming requests
app.use(loggingService.logRequest.bind(loggingService));

// Requiring routes
const auth = require("./routes/auth");
app.use(auth);

// Middleware to log response
app.use((req, res, next) => {
  res.on('finish', () => {
    loggingService.logResponse(req, res);
  });
  next();
});

// Add listeners for uncaught exceptions and unhandled rejections
loggingService.setupUncaughtExceptionHandler();
loggingService.setupUnhandledRejectionHandler();

// Listening to port
app.listen(process.env.PORT, () => {
  loggingService.log('info', `server started on port ${process.env.PORT}`);
});
