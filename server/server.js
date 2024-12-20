import express from "express";
import authroutes from "./routes/routes.auth.js";
import dotenv from "dotenv";
import connectMongoDB from "./dbconnect/connect.js";
import cookieParser from "cookie-parser";
import userroutes from "./routes/users.routes.js";
import { v2 as cloudinary } from "cloudinary";
import postroutes from "./routes/posts.routes.js";
import notificationroutes from "./routes/notifications.routes.js";
import path from "path";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const __dirname = path.resolve;
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true, //to send and receive cookie
//   })
// );
//dont have limit to high,it can be used for DoS attacks
app.use(express.json({ limit: "5mb" })); //middleware for using jsons
app.use(express.urlencoded({ extended: true })); //not necessary unless u intend to pass info thorugh urlencoded method
app.use(cookieParser()); //to check your cookies

app.use("/api/auth", authroutes);
app.use("/api/users", userroutes);
app.use("/api/post", postroutes);
app.use("/api/notifications", notificationroutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectMongoDB();
  console.log(`Server is running,${PORT}`);
});
