import app from "./src/app.js";
import dotenv from "dotenv";
import connectDb from "./src/db/db.js";

dotenv.config();

connectDb()
.then(() => {
    app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})
}).catch((err) => {
    console.log("Error connecting to database: ", err);
});

