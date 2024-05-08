# Node.js Express Server with Authentication, Authorization and Logging

This repository contains a Node.js Express server with authentication functionality using JWT tokens and logging capabilities.

## Installation

Clone the repository:

```bash
git clone https://github.com/TechnoZech/RekonsileTestServer.git
```

## Install dependencies

```bash
cd RekonsileTestServer
npm install
```

## Usage
Start the server
```bash
npm start
```

## Set up environment variables

Create a .env file in the root directory and specify the required environment variables. Refer to the Environment Variables section for details.
```bash
PORT= Port number for the server (default: 3000).
MONGO_URI= MongoDB connection URI.
JWT_SECRET= Secret key for JWT token generation.
LOG_LEVEL= Log level for logging (error, warn, info, debug).
```
## Logging
The server uses a custom logging service to log incoming requests, responses, errors, uncaught exceptions, and unhandled rejections. Logging level and log file rotation can be configured via environment variables.

## Error Handling
The server handles errors gracefully, providing appropriate error messages and status codes for invalid requests, authentication failures, and internal errors.

## Endpoints
### Authentication


- **POST /auth/signup**: Register a new user. Requires email and password in the request body.
- **POST /auth/login**: Login with existing credentials. Requires email and password in the request body.
- **POST /auth/refresh**: Refresh access token using refresh token. Requires refreshToken in the request body.
Protected Route
- **GET /protected**: Example protected route. Requires valid access token in the Authorization header.
