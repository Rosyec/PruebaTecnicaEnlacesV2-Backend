import { Schema, model } from "mongoose";

const Post: Schema = new Schema({
  tipo_usuario: Number,
  identificacion: Number,
  email: String,
  contrasena: String,
  telefono: String,
});

const postModel = model("post", Post);

export { postModel };