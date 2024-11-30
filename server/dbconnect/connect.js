import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    //function to connect to mongoDB mongoose.connect(MONGO_URI)
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to database:${con.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
export default connectMongoDB;
