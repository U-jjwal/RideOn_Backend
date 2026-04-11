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

app.use("/api/v1/user", userRouter);


export default app;