import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    //add userName unique check
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    //add unique email check
    email: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TwitterUser", //reference to userModel
        default: [], //zero followers at beginning
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TwitterUser", //reference to userModel
        default: [], //zero followers at beginning
      },
    ],
    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    //add minimum password to be 8
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const TwitterUser = mongoose.model("TwitterUser", userSchema);

export default TwitterUser;
