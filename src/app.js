import express from "express";


const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello World");
});

import userRouter from "./routers/user.routes.js";

app.use("/api/v1/users", userRouter);


export default app;