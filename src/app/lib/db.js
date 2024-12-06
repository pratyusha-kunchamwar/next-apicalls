import mongoose from "mongoose";

const URL = process.env.MONGOOSE_URL;

const connect = async () => {
  const connectionState = mongoose.connect.readyState;
  if (connectionState == 1) {
    console.log("Allredy connected");
    return;
  }
  if (connectionState == 2) {
    console.log("Connecting ...");
    return;
  }
  try {
    mongoose.connect(URL, {
      dbName: "next14restapi",
      bufferCommands: true,
    });
    console.log("connected");
  } catch (error) {
      console.log("error");
      throw new error;
  }
};

export default connect;