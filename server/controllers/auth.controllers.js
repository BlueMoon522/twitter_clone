import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import TwitterUser from "../models/user.model.js";

//signup route
export const signup = async (req, res) => {
  console.log("In signup function");
  try {
    const { fullname, username, email, password } = req.body; //req.body is the one we send as request.Then addding all of the parameters to the request.
    const existingUser = await TwitterUser.findOne({ username }); //finding the username from above passed "username", and searching based on username
    if (existingUser) {
      return res.status(400).json({ error: "Username taken" });
    }
    const existingEmail = await TwitterUser.findOne({ email }); //checking for email using same method as above
    if (existingEmail) {
      return res.status(400).json({ error: "Email taken" });
    }

    //hashing password
    //encryption of the password using bcrypt required salt,so generating salt of length 10,increasing it more will create more secure password but also take more time to encrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //creating a newUser using the TwitterUser Model
    const newUser = new TwitterUser({
      fullname,
      username,
      email,
      password: hashedPassword,
    });
    //if creating as newUser is a success
    if (newUser) {
      //generating token
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save(); //save the newUser to the DB using the save(). method
      //sending all of the following info as json as a Response(not necessary)
      console.log("====================================");
      console.log("Sending status 201 next");
      console.log("====================================");
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
    } else {
      res.status(400).json({
        error: "Invalid User Data",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

//Login route
export const login = async (req, res) => {
  console.log("In login function");
  try {
    //taking the username and password that is  passed as a request
    const { username, password } = req.body;
    const user = await TwitterUser.findOne({ username: username }); //searching for username
    if (!user) {
      return res.status(400).json({ error: " Invalid User" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password); //compare is a function provided by bcrypt,helps in comparing the currently passed password to the already encrypted password
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid password" });
    }
    //generating token on successful login
    generateTokenAndSetCookie(user._id, res);
    //passing data as response(not necessary)
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
  console.log("In logout function");
  try {
    //setting cookie jwt to maxage of 0 on press and value to null
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const authedUser = async (req, res) => {
  console.log("In authUser function");
  try {
    //finding user according to their id and removing the password from the json
    const user = await TwitterUser.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
