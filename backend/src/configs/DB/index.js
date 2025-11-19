import mongoose from "mongoose";

const connectDB = async() => {
  //
  try {
    const mongoDbInstance =await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(
      "MongoDb connected Successfully!! host : ",
      mongoDbInstance.connection.host
    );
  } catch (error) {
    console.log("Error while Connecting to remote DataBase :: ", error);
    process.exit(1);
  }
};

export default connectDB;
