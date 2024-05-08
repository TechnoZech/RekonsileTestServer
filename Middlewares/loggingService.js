const fs = require('fs');
const path = require('path');

class LoggingService {
  constructor(logLevel) {
    this.logLevel = logLevel || 'info'; // Default log level
    this.logFileStream = fs.createWriteStream(path.join(__dirname, 'app.log'), { flags: 'a' });
  }

  log(level, message) {
    const logLevels = ['error', 'warn', 'info', 'debug'];
    if (logLevels.indexOf(level) <= logLevels.indexOf(this.logLevel)) {
      const logMessage = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
      console.log(logMessage);
      this.logFileStream.write(logMessage + '\n');
    }
  }

  logError(err) {
    this.log('error', err.stack || err.message || err);
  }

  logRequest(req, res, next) {
    const { method, url, query, body } = req;
    this.log('info', `${method} ${url}`);
    this.log('debug', 'Query Parameters:', query);
    this.log('debug', 'Request Body:', body);
    next();
  }

  logResponse(req, res) {
    const { statusCode } = res;
    this.log('info', `Response Status Code: ${statusCode}`);
  }

  setupUncaughtExceptionHandler() {
    process.on('uncaughtException', (err) => {
      this.logError(err);
      process.exit(1);
    });
  }

  setupUnhandledRejectionHandler() {
    process.on('unhandledRejection', (reason, promise) => {
      this.logError(new Error(`Unhandled Promise Rejection at: ${promise}. Reason: ${reason}`));
    });
  }

  setLogLevel(logLevel) {
    this.logLevel = logLevel;
  }

  setLogFileStream(logFileStream) {
    this.logFileStream = logFileStream;
  }
}

module.exports = LoggingService;
