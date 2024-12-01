import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import TwitterUser from "../models/user.model.js";

//signup route
export const signup = async (req, res) => {
  try {
    console.log("here1");
    const { fullname, username, email, password } = req.body;
    const existingUser = await TwitterUser.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username taken" });
    }
    const existingEmail = await TwitterUser.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email taken" });
    }
    console.log("Here");
    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    const newUser = new TwitterUser({
      fullname,
      username,
      email,
      password: hashedPassword,
    });
    console.log(newUser);
    if (newUser) {
      //generating token
      console.log("Now setting cookie and generating ofcourse");
      generateTokenAndSetCookie(newUser._id, res);
      console.log("after the function");
      console.log(newUser);
      await newUser.save();
      console.log("User saved");
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
      console.log("After");
    } else {
      res.status(400).json({
        error: "Invalid User Data",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await TwitterUser.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ error: " Invalid User" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid password" });
    }
    //generating token
    generateTokenAndSetCookie(user._id, res);
    console.log("after the function");
    res.status(201).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const authedUser = async (req, res) => {
  try {
    console.log(req.body);
    const user = await TwitterUser.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
