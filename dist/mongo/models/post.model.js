"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postModel = void 0;
const mongoose_1 = require("mongoose");
const Post = new mongoose_1.Schema({
    tipo_usuario: Number,
    identificacion: Number,
    email: String,
    contrasena: String,
    telefono: String,
});
const postModel = (0, mongoose_1.model)("post", Post);
exports.postModel = postModel;
