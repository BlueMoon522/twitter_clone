import TwitterUser from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; //checking for token named jwt
    if (!token) {
      return res.status(401).json({ error: "No valid token found" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY); //decoding the token,verify is the method from package jsonwebtoken
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const user = await TwitterUser.findById(decoded.userId).select("-password"); //finding user using the id and deleting the password from the token
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Error" });
  }
};
