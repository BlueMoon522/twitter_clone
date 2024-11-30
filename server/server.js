import express from "express";
import authroutes from "./routes/routes.auth.js";
import dotenv from "dotenv";
import connectMongoDB from "./dbconnect/connect.js";

dotenv.config();
const app = express();

app.use("/api/auth", authroutes);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectMongoDB();
  console.log(`Server is running,${PORT}`);
});
