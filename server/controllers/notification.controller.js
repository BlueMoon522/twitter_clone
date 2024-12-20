//needs to be tested!!Untested
import Notification from "../models/notifications.model.js";
//receive notifications
export const getNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({
      to: userId,
    }).populate({
      path: "from",
      select: "username profileImg",
    });
    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal error" });
  }
};
//this deletes all notifications
//add one to delete single notifications TODO
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal error" });
  }
};
