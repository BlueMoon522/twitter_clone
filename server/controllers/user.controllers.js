import Notification from "../models/notifications.model.js";
import bcrypt from "bcrypt";
import TwitterUser from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
//get all the currentUser info
export const userProfiles = async (req, res) => {
  console.log("In user profile function");
  const { username } = req.params;
  try {
    const user = await TwitterUser.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
};
//Follow and unfollow other users
export const followAndUnfollow = async (req, res) => {
  console.log("In follow unfollow function");
  try {
    const { id } = req.params;
    const userToModify = await TwitterUser.findById(id);
    const currentUser = await TwitterUser.findById(req.user._id);
    //req.user._id is in format of object so change it to string
    //checking if the current userId and the sent userId are same ,so that they may not follow themselves
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot follow or unfollow self" });
    }
    //If another user is not found or the currentUser is not found then sending error
    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }
    //checking if the passed userId already exists in the following section
    const isFollowing = currentUser.following.includes(id);
    console.log(isFollowing);
    if (isFollowing) {
      //unfollow if followed
      //using pull method to remove the id from the current user and the other user
      //if already followed ,unfollow the user,i.e delete the userId from the current user following section
      await TwitterUser.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      await TwitterUser.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      res.status(200).json({ message: "User unfollowed" });
    } else {
      //using push method to add data to the current user
      //pushing the data to another user that is being followed as being follower by current user
      await TwitterUser.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      //pushing the the other user as following in Db
      await TwitterUser.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });

      //sending the notification to the currentUser
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });
      //saving the notification in the database
      await newNotification.save();
      //sending the message as a response
      res.status(200).json({ message: "User followed" });
    }
    res.status(200).json;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error!" });
  }
};
//get suggested users
//can be better
export const suggested = async (req, res) => {
  console.log("In suggested function");
  try {
    const userId = req.user._id;
    const userFollowed = await TwitterUser.findById(userId).select("following");

    //TODO: Look into aggregate function
    const users = await TwitterUser.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    //filtering the users by checking if the users are followed or not followed already
    const filteredUsers = users.filter(
      (user) => !userFollowed.following.includes(user._id)
    );
    //setting the suggestedUsers to be between 0-4
    const suggestedUsers = filteredUsers.slice(0, 4);

    //setting password null for all the suggestedUsers
    suggestedUsers.forEach((user) => (user.password = null));

    //send the json of suggested users list
    //if u want to use map send if like this dont send it like ({suggestedUsers}) or u will get an error
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const updateProfile = async (req, res) => {
  console.log("In updateUser function");
  let { fullname, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;
  try {
    //finding user by id
    let user = await TwitterUser.findById(userId);
    if (!user) return res.status(404).json({ message: "user not found" });
    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res
        .status(400)
        .json({ message: "Insert both fields current and new password" });
    }
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is wrong" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        //deleting the old profile image
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        //deleting the old cover image
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();
    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ServerSide error" });
  }
};
