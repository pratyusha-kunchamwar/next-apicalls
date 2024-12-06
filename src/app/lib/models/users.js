import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: "string", require: true, unique: true },
    username: { type: "string", require: true, unique: true },
    passWord: { type: "string", require: true },
  },
  {
    timestamps: false,
  }
);
const User = models.User || model("User", UserSchema);
export default User;