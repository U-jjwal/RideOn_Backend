# RideOn — Backend

Lightweight backend for the RideOn app (Node.js, Express, MongoDB, Socket.IO).

## Quick summary
- Purpose: ride booking, captain discovery, real-time notifications.
- Stack: Node 18+, Express 5, Mongoose, Socket.IO, JWT authentication.
- Main server entry: [`server.js`](Backend/server.js) — uses [`initializeSocket`](Backend/socket.js).

## Setup (local)
1. Copy env:
   - Edit `/Backend/.env` (see keys used: `PORT`, `MONGO_URI`, `JWT_SECRET`, `GOOGLE_MAPS_API`).
2. Install & run:
   ```sh
   cd Backend
   npm install
   npm run start
   ```
3. Server runs at PORT in `.env`. App mounts routes in [`src/app.js`](Backend/src/app.js).

## Important scripts / files
- Server bootstrap: [`server.js`](Backend/server.js)  
- Socket initialization & helper: [`socket.js`](Backend/socket.js) — exports [`initializeSocket`](Backend/socket.js) and [`sendMessageToSocketId`](Backend/socket.js).
- DB connector: [`src/db/db.js`](Backend/src/db/db.js)
- Auth controllers: [`src/controllers/auth.controller.js`](Backend/src/controllers/auth.controller.js)
- Captain controllers: [`src/controllers/captain.controller.js`](Backend/src/controllers/captain.controller.js)
- Ride controllers: [`src/controllers/ride.controller.js`](Backend/src/controllers/ride.controller.js) — uses service functions in [`src/services/ride.service.js`](Backend/src/services/ride.service.js) (`createRide`, `confirmRide`, `startRide`, `endRide`).
- Maps / Google APIs: [`src/services/maps.service.js`](Backend/src/services/maps.service.js) (`getAddressCoordinate`, `getDistancetime`, `getAutoCompleteSuggestions`, `getCaptainsInTheRadius`).

## API overview (important endpoints)
- User
  - POST /api/v1/user/register — [`registerUser`](Backend/src/controllers/auth.controller.js)
  - POST /api/v1/user/login — [`loginUser`](Backend/src/controllers/auth.controller.js)
  - GET /api/v1/user/profile — [`userProfile`](Backend/src/controllers/auth.controller.js)
- Captain
  - POST /api/v1/captain/register — [`registerCaptain`](Backend/src/controllers/captain.controller.js)
  - POST /api/v1/captain/login — [`loginCaptain`](Backend/src/controllers/captain.controller.js)
  - GET /api/v1/captain/profile — [`getCaptainProfile`](Backend/src/controllers/captain.controller.js)
- Rides
  - POST /api/v1/rides/create — [`createride`](Backend/src/controllers/ride.controller.js)
  - GET /api/v1/rides/get-fare — [`getFare`](Backend/src/controllers/ride.controller.js)
  - POST /api/v1/rides/confirm — [`confirmride`](Backend/src/controllers/ride.controller.js)
  - GET /api/v1/rides/start-ride — [`startRide`](Backend/src/controllers/ride.controller.js)
  - POST /api/v1/rides/end-ride — [`endRide`](Backend/src/controllers/ride.controller.js)

## Socket / realtime flow
- Client connects to server Socket.IO (configured in [`socket.js`](Backend/socket.js)).
- Client should emit `join` with { userId, userType } — server updates `socketId` on DB models [`User`](Backend/src/models/user.model.js) or [`Captain`](Backend/src/models/captain.model.js).
- When a ride is created, backend finds nearby captains via [`getCaptainsInTheRadius`](Backend/src/services/maps.service.js) and uses [`sendMessageToSocketId`](Backend/socket.js) to notify captains.
- When captain confirms, backend reads populated ride (`Ride` model) and uses [`sendMessageToSocketId`](Backend/socket.js) to notify the user.

## Models
- User: [`Backend/src/models/user.model.js`](Backend/src/models/user.model.js) (includes `socketId`)
- Captain: [`Backend/src/models/captain.model.js`](Backend/src/models/captain.model.js) (includes `socketId`, `vehicle`, `location`)
- Ride: [`Backend/src/models/ride.model.js`](Backend/src/models/ride.model.js)

## Common troubleshooting
- Missing user `socketId`: ensure client emits `join` after authentication and socket connect; server logs appear in [`socket.js`](Backend/socket.js).
- 500 on `/rides/confirm`: check that [`src/services/ride.service.js`](Backend/src/services/ride.service.js) returns populated ride and that controller checks `ride.user.socketId` before sending socket message.
- Google Maps: ensure `GOOGLE_MAPS_API` exists in backend `.env` for services in [`src/services/maps.service.js`](Backend/src/services/maps.service.js).

## Notes
- Authentication middleware: [`src/middleware/auth.middleware.js`](Backend/src/middleware/auth.middleware.js).
- The backend is intentionally modular — add tests and improve error handling for production.