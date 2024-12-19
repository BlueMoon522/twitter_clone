import Notification from "../models/notifications.model.js";
import Post from "../models/posts.model.js";
import TwitterUser from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

//create a post
export const createPost = async (req, res) => {
  try {
    //getting image or text from the user
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    //checking if user exists
    const user = await TwitterUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!text && !img) {
      return res.status(400).json({ error: "Post must have something in it" });
    }
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      //sending the img as string i.e url to the database
      img = uploadedResponse.secure_url;
      console.log("yes image");
      console.log(img);
      console.log("Here is image image");
    } else {
      console.log("no image");
    }

    const newPost = Post({
      user: userId,
      img,
      text,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete route
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.staus(404).json({ error: "Post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Not authorized" });
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deletion successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//likePost
export const likePost = async (req, res) => {
  try {
    console.log("in like unlike function");
    const userId = req.user._id;
    const { id: postId } = req.params;
    const post = await Post.findById(postId); // searching for the post
    if (!post) {
      return res.status(404).json({ error: "Not found post" });
    }
    const userLikedPost = post.likes.includes(userId); //checking if the likes section already consists of the uId
    if (userLikedPost) {
      //unlike if it is already liked
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await TwitterUser.updateOne(
        { _id: userId },
        { $pull: { likedPost: postId } }
      );
      res.status(200).json({ message: "Post unliked" });
    } else {
      //like if uid ,doesnot exists
      console.log("here");
      post.likes.push(userId);
      await TwitterUser.updateOne(
        { _id: userId },
        { $push: { likedPost: postId } }
      );
      await post.save();
      console.log("did it");
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();
      res.status(200).json({ message: "Post liked successful" });
    }
  } catch (error) {}
};

//commentPost
export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    if (!text) {
      return res.status(400).json({ error: "Text field is not empty" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
//get all posts
//learn more about populate
export const getPosts = async (req, res) => {
  try {
    console.log("funciton executed");
    const posts = await Post.find()
      .sort({
        //will sort based on created time
        createdAt: -1,
      })
      .populate({
        //posts also now have all the posters info excluding password

        path: "user",
        select: "-password",
      })
      .populate({
        //populate the comments part with the same info as well
        path: "comments.user",
        select: "-password",
      });
    console.log(posts);
    if (posts.length === 0) {
      console.log("no posts");
      return res.status(200).json([]);
    }
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const getLiked = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await TwitterUser.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const likedPosts = await Post.find({
      _id: { $in: user.likedPost },
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "user",
        select: "-password",
      });
    res.status(200).json(likedPosts);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server Error" });
  }
};

export const followPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await TwitterUser.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const following = user.following;
    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments",
        select: "-password",
      });
    res.status(200).json(feedPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const allPost = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await TwitterUser.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const feedPosts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments",
        select: "-password",
      });
    res.status(200).json(feedPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
