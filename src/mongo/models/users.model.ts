import { Schema, model } from "mongoose";

const UserSchema: Schema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const UserModel = model("User", UserSchema);

export { UserModel };