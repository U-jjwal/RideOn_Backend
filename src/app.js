import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Hello World");
});

import userRouter from "./routers/user.routes.js";
import captainRouter from "./routers/captain.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/captain", captainRouter)

export default app;