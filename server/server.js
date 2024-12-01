import express from "express";
import authroutes from "./routes/routes.auth.js";
import dotenv from "dotenv";
import connectMongoDB from "./dbconnect/connect.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json()); //middleware for using jsons
app.use(express.urlencoded({ extended: true })); //not necessary unless u intend to pass info thorugh urlencoded method
app.use(cookieParser()); //to check your cookies

app.use("/api/auth", authroutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectMongoDB();
  console.log(`Server is running,${PORT}`);
});
