import http from 'http';
import app from "./src/app.js";
import dotenv from "dotenv";
import connectDb from "./src/db/db.js";
import { initializeSocket } from "./socket.js";

dotenv.config();

const server = http.createServer(app);
initializeSocket(server);

connectDb()
.then(() => {
    server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})
}).catch((err) => {
    console.log("Error connecting to database: ", err);
});
