import TwitterUser from "../models/user.model.js";
//get all the currentUser info
export const userProfiles = async (req, res) => {
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
      res.status(200).json({ message: "User followed" });
    }
    res.status(200).json;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error!" });
  }
};
export const updateProfile = async () => {};
export const suggested = async () => {};
