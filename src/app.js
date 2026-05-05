import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Hello World");
});

import userRouter from "./routers/user.routes.js";
import captainRouter from "./routers/captain.routes.js";
import mapsRoutes from "./routers/maps.routes.js"
import rideRoutes from "./routers/ride.routes.js"

app.use("/api/v1/user", userRouter);
app.use("/api/v1/captain", captainRouter)
app.use('/api/v1/maps', mapsRoutes)
app.use('/api/v1/rides', rideRoutes)

export default app;