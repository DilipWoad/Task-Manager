import mongoose from "mongoose";
import { MONGO_URI } from "../../config.js";

const connectDB = async():Promise<void> => {
  //
  try {
    const mongoDbInstance =await mongoose.connect(MONGO_URI);
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
