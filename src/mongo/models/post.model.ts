import mongoose, { Schema, model } from "mongoose";

const Post: Schema = new Schema({
    title: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const PostModel = model("post", Post);

export { PostModel };