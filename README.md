# RideOn — Backend 

Professional backend for the RideOn project. This repository contains a minimal, production-oriented Node.js / Express API for user authentication and profile handling, built with modern JavaScript (ES modules) and MongoDB.

---

## Table of contents

- Project overview
- Features
- Tech stack
- Project structure
- Getting started
	- Prerequisites
	- Environment variables
	- Install & run
- API reference (auth)
	- Register
	- Login
	- Logout
	- Profile
- Authentication details
- Development notes & tips
- Troubleshooting
- Next steps / roadmap
- Contributing
- License

---

## Project overview

This backend provides authentication and a basic user profile for the RideOn application. It supports:

- User registration with hashed passwords
- Login using email & password
- JWT-based authentication stored in an HTTP-only cookie
- Protected profile endpoint

The code aims to be simple and extensible: add ride matching, sockets, geolocation, payments, and more.

## Features

- Register new users with validation and password hashing (bcrypt).
- Log in and receive a signed JWT (cookie-based session).
- Middleware to protect routes and load the authenticated user.
- Mongoose models with sensible defaults and selected fields.

## Tech stack

- Node.js (ES modules)
- Express
- MongoDB + Mongoose
- bcrypt for password hashing
- jsonwebtoken for JWT
- cookie-parser for cookie handling

## Project structure

Key files and folders:

- `server.js` — app entrypoint; loads env and connects to DB.
- `src/app.js` — configures express, parses cookies and JSON, and registers routers.
- `src/db/db.js` — (database connection helper).
- `src/controllers/auth.controller.js` — register, login, logout, profile handlers.
- `src/middleware/auth.middleware.js` — authenticates requests using JWT from cookie.
- `src/models/user.model.js` — Mongoose schema for users.
- `src/routers/user.routes.js` — user auth routes.

## Getting started

### Prerequisites

- Node.js 16+ (or active LTS)
- npm (or yarn)
- MongoDB instance (local or hosted: Atlas)

### Environment variables

Create a `.env` file at the project root with the following minimum variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rideon
JWT_SECRET=your-strong-secret
```

Replace values with production-secure settings. Never commit secrets to source control.

### Install & run (development)

1. Install dependencies:

```bash
npm install
```

2. Start the server (example, using NODE):

```bash
# development (use nodemon if available)
node server.js
```

If you use `nodemon`, run `nodemon server.js` for auto-reload.

## API reference (base path: `/api/v1/user`)

All endpoints return JSON and use standard HTTP status codes.

### POST /register

- Description: Create a new user
- Request body (application/json):

```json
{
	"firstname": "John",
	"lastname": "Doe",
	"email": "john@example.com",
	"password": "s3cret"
}
```

- Success (201):

```json
{ "message": "User registered successfully" }
```

- Notes: Passwords are hashed using bcrypt. On success a JWT cookie named `token` is set.

### POST /login

- Description: Authenticate user and set JWT cookie
- Request body:

```json
{ "email": "john@example.com", "password": "s3cret" }
```

- Success (200):

```json
{ "message": "User logged in successfully" }
```

- Notes: The server returns a cookie `token` containing the signed JWT. The user document's password field is not returned (it uses `select: false`).

### POST /logout

- Protected endpoint (requires cookie token). Clears the `token` cookie.
- Success (200):

```json
{ "message": "User logged out successfully" }
```

### GET /profile

- Protected endpoint. Returns the authenticated user's document.
- Success (200):

```json
{ "_id": "...", "fullname": { "firstname": "John", "lastname": "Doe" }, "email": "john@example.com", "createdAt": "..." }
```

## Authentication details

- JWTs are signed with `process.env.JWT_SECRET` and stored in a cookie named `token`.
- The `authMiddleware` checks `req.cookies.token`, verifies the JWT, fetches the user with `User.findById()` and attaches `req.user`.
- If no token or an invalid token is provided, routes return HTTP 401 Unauthorized.

Security recommendations:

- Use `httpOnly`, `secure`, and `sameSite` attributes for the cookie in production.
- Store JWT_SECRET in a secure secret manager.
- Optionally add token expiration (recommended) and refresh tokens for long sessions.

## Development notes & tips

- The user password is stored hashed and is excluded by default from queries (`select: false`). When login needs to compare password, the controller uses `.select('+password')`.
- Add input validation (e.g., `express-validator` or Joi) for stricter field checks.
- Consider enabling CORS with a controlled origin in `app.js` if the frontend is served from another host.

## Troubleshooting

- Mongo connection issues: confirm `MONGODB_URI` and that MongoDB is running.
- JWT verification errors: ensure `JWT_SECRET` is identical between sign and verify and not empty.
- Cookie not set in client: check `SameSite` and `Secure` attributes; when testing on localhost, `secure` should be `false`.

## Next steps / roadmap

- Add validation and typed request/response shapes (TypeScript or JSDoc)
- Implement refresh tokens and token expiration
- Add email verification and password reset
- Integrate socket.io for real-time ride updates
- Add rides, drivers, and location tracking models
- Add unit & integration tests (Jest + supertest)

