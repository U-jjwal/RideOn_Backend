# 🚖 RideOn Backend API

A scalable and secure backend API for a ride-booking platform, built with **Node.js, Express.js, MongoDB, and JWT Authentication**.  
This project supports two main roles:

- **Users (Passengers)** – Register, login, manage profile
- **Captains (Drivers)** – Register with vehicle details, login, manage profile

Designed with modular architecture for easy scaling into a complete Uber/Ola-style ride-sharing system.

---

# 📌 Project Overview

RideOn Backend provides authentication and profile management APIs for:

### 👤 Users
- Register account
- Login securely
- Logout
- View profile

### 🚘 Captains
- Register with vehicle info
- Login securely
- Logout
- View captain profile

---

# 🏗️ Project Architecture

```bash
RideOn-Backend/
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── captain.controller.js
│   │
│   ├── middleware/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── captain.model.js
│   │
│   ├── routers/
│   │   ├── user.routes.js
│   │   └── captain.routes.js
│   │
│   ├── db/
│   │   └── db.js
│   │
│   └── app.js
│
├── server.js
├── .env
├── package.json
└── README.md
⚙️ Tech Stack
Technology	Purpose
Node.js	Runtime environment
Express.js	Web framework
MongoDB	Database
Mongoose	ODM
JWT	Authentication
bcrypt	Password hashing
cookie-parser	Cookie management
dotenv	Environment config
🔐 Authentication System

Authentication is implemented using:

JWT Token Based Login
JWT token generated on successful login/register
Token stored in HTTP cookies
Password Security

Passwords are encrypted using bcrypt before storage.

Example from auth flow:
Passwords are hashed before saving users and captains into MongoDB.

🧩 Core Modules Explanation
1. User Module
Features:

✅ Register User
✅ Login User
✅ Logout User
✅ Get User Profile

API Routes:
Method	Endpoint	Description
POST	/api/v1/user/register	Register new user
POST	/api/v1/user/login	Login user
POST	/api/v1/user/logout	Logout user
GET	/api/v1/user/profile	Get user profile

Defined in routing layer here:

2. Captain Module
Features:

✅ Register Captain
✅ Login Captain
✅ Logout Captain
✅ Get Captain Profile

API Routes:
Method	Endpoint	Description
POST	/api/v1/captain/register	Register captain
POST	/api/v1/captain/login	Login captain
POST	/api/v1/captain/logout	Logout captain
GET	/api/v1/captain/profile	Get captain profile

Defined here:

🗄️ Database Models
User Schema

Includes:

firstname
lastname
email
password
socketId

User schema structure defined in:

Captain Schema

Includes:

firstname
lastname
email
password
vehicle info:
color
plate
capacity
vehicleType
status
live location

Captain schema defined in:

🚘 Vehicle System

Each captain must provide:

{
  "color": "White",
  "plate": "MP04AB1234",
  "capacity": 4,
  "vehicleType": "car"
}

Supported vehicle types:

car
motorcycle
auto
🛡️ Middleware Protection

Protected routes use authentication middleware:

User Middleware:
Verifies JWT token
Fetches authenticated user
Captain Middleware:
Verifies JWT token
Checks captain role

Implemented in:

🌐 API Flow Example
User Registration Flow
Client Request
   ↓
Route Handler
   ↓
Controller Validation
   ↓
Hash Password
   ↓
Save User to DB
   ↓
Generate JWT
   ↓
Send Cookie + Response
Captain Login Flow
Captain Login Request
   ↓
Validate Credentials
   ↓
Compare Password Hash
   ↓
Generate JWT Token
   ↓
Store Cookie
   ↓
Return Success Response

Captain login logic handled in:

🔌 Database Connection

MongoDB connection uses mongoose:

mongoose.connect(process.env.MONGO_URI)

Database connector file:

🚀 Server Startup

Application boot sequence:

Load environment variables
Connect MongoDB
Start Express server

Server bootstrap file:

🌍 Main Application Entry

Express app configuration includes:

JSON parser
URL encoded parser
Cookie parser
Route mounting

App setup defined in:

🔑 Environment Variables

Create .env file:

PORT=5000
MONGO_URI=mongodb://localhost:27017/RideOn
JWT_SECRET=your_secret_key
📦 Installation Guide
1 Clone Repository
git clone https://github.com/yourusername/RideOn-backend.git
cd RideOn-backend
2 Install Dependencies
npm install
3 Configure Environment

Create .env

4 Start Server
npm run dev
🧪 Sample API Testing
Register User
POST /api/v1/user/register
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "123456"
}
Register Captain
POST /api/v1/captain/register
{
  "firstname": "Mike",
  "lastname": "Smith",
  "email": "mike@example.com",
  "password": "123456",
  "vehicle": {
    "color": "Black",
    "plate": "MP09XY4567",
    "capacity": 4,
    "vehicleType": "car"
  }
}
🔮 Future Enhancements
Planned Features:
Ride booking system
Real-time captain tracking
Socket.IO live communication
Fare estimation engine
Payment gateway integration
Trip history
OTP verification
Admin dashboard
📈 Scalability Design

This backend is built modularly for future expansion:

Easy microservice migration
Real-time websocket integration ready
Scalable route separation
Role-based authentication ready
👨‍💻 Author

Developed as a scalable ride-booking backend architecture project.