const express = require("express");
const mongoose = require("mongoose");
const LoggingService = require("./Middlewares/loggingService");
var cors = require("cors");


const app = express();
require("dotenv").config();

//! Cors
app.use(cors({ origin: process.env.CORS_URI, credentials: true }));

//! Initialize logging service
const loggingService = new LoggingService(process.env.LOG_LEVEL);

//! Database connection using Mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("db connected")
    loggingService.log('info', "db Connected!");
  })
  .catch((error) => {
    loggingService.logError(error);
  });


app.get("/", function (req, res) {
  res.send("server is working");
});

//! Middleware to parse JSON bodies
app.use(express.json());

//! Server configuration
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

//! Middleware to log incoming requests
app.use(loggingService.logRequest.bind(loggingService));

//! Requiring routes
const auth = require("./Routes/auth");
app.use(auth);

//! Middleware to log response
app.use((req, res, next) => {
  res.on('finish', () => {
    loggingService.logResponse(req, res);
  });
  next();
});

//! Add listeners for uncaught exceptions and unhandled rejections
loggingService.setupUncaughtExceptionHandler();
loggingService.setupUnhandledRejectionHandler();

//! Listening to port
app.listen(process.env.PORT, () => {
  loggingService.log('info', `server started on port ${process.env.PORT}`);
});
