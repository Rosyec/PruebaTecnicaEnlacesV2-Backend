"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const users_model_1 = require("../mongo/models/users.model");
const post_model_1 = require("../mongo/models/post.model");
const jwt_1 = require("../helpers/jwt");
const router = (0, express_1.Router)();
exports.router = router;
/**
 * * USERS
 */
router.get("/users/login", jwt_1.authMiddleware, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        login(req.body, resp);
    }
    catch (error) {
        console.error(error);
        resp
            .status(500)
            .json({ message: "Ha ocurrido un error al procesar la solicitud" });
    }
}));
function login(userLogin, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = userLogin;
        const user = yield users_model_1.UserModel.findOne({ email });
        if (!user) {
            return resp.status(400).json({ message: "Credenciales inválidas" });
        }
        if (user.password !== password) {
            return resp.status(400).json({ message: "Credenciales inválidas" });
        }
        const newUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            message: "Logeado correctamente",
        };
        resp.status(200).json(newUser);
    });
}
router.post("/users/register", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        register(req.body, resp);
    }
    catch (error) {
        console.error(error);
        resp
            .status(500)
            .json({ message: "Ha ocurrido un error al procesar la solicitud" });
    }
}));
function register(userRegister, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, name, password } = userRegister;
        if (!email && !name && !password) {
            return resp
                .status(403)
                .send('Se requieren los parametros en el body "name, email y password"');
        }
        const existingUser = yield users_model_1.UserModel.findOne({ email });
        if (existingUser) {
            return resp
                .status(400)
                .json({ message: "Este correo electrónico ya está en uso" });
        }
        const newToken = yield (0, jwt_1.generateJWT)(name, email);
        const user = new users_model_1.UserModel(userRegister);
        yield user.save();
        const newUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: newToken,
            message: "Registrado correctamente",
        };
        return resp.status(201).json(newUser);
    });
}
router.get("/users/:id", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        getUserById(req.params.id, resp);
    }
    catch (error) {
        console.log(error);
        resp
            .status(500)
            .json({ message: "Ha ocurrido un error al procesar la solicitud" });
    }
}));
function getUserById(id, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return resp.status(403).send('Se requiere el pathParam "id"');
        }
        const userById = yield users_model_1.UserModel.findById({ _id: id });
        resp.json(userById);
    });
}
/**
 * * POSTS
 */
router.get("/posts", (resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userPosts = yield post_model_1.PostModel.find();
        resp.json(userPosts);
    }
    catch (error) {
        console.log(error);
        resp
            .status(500)
            .json({ message: "Ha ocurrido un error al procesar la solicitud" });
    }
}));
router.get("/posts/:id", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        getPostById(req.params.id, resp);
    }
    catch (error) {
        console.log(error);
        resp
            .status(500)
            .json({ message: "Ha ocurrido un error al procesar la solicitud" });
    }
}));
function getPostById(id, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return resp.status(403).send('Se requiere el pathParam "id"');
        }
        const postById = yield post_model_1.PostModel.findById({ _id: id });
        resp.json(postById);
    });
}
router.post("/posts/:id", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        createPost(req.params.id, req.body, resp);
    }
    catch (err) {
        console.error(err);
        resp
            .status(500)
            .json({ message: "Ha ocurrido un error al procesar la solicitud" });
    }
}));
function createPost(id, post, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, content } = post;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return resp.status(403).send('Se requiere el pathParam "id"');
        }
        if (!title && !content) {
            return resp.status(403).send('Se requiere en el body "title y content"');
        }
        const newPost = new post_model_1.PostModel({ title, content, author: id });
        yield newPost.save();
        resp.status(201).json(newPost);
    });
}
router.put("/posts/:id", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        updatePost(req.params.id, req.body, resp);
    }
    catch (error) {
        console.error(error);
        resp
            .status(500)
            .json({ message: "Ha ocurrido un error al procesar la solicitud" });
    }
}));
function updatePost(id, post, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        const { content, title } = post;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return resp.status(403).send('Se requiere el pathParam "id"');
        }
        if (!title && !content) {
            return resp.status(403).send('Se requiere en el body "title y content"');
        }
        const updatePost = yield post_model_1.PostModel.findOne({ _id: id });
        if (!updatePost) {
            return resp.status(404).json({ message: "No se ha encontrado el post" });
        }
        updatePost.content = content;
        updatePost.title = title;
        yield updatePost.save();
        resp.status(200).json(updatePost);
    });
}
router.delete("/posts/:id", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        deletePost(req.params.id, resp);
    }
    catch (error) {
        console.error(error);
        resp
            .status(500)
            .json({ message: "Ha ocurrido un error al procesar la solicitud" });
    }
}));
function deletePost(id, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return resp.status(403).send('Se requiere el pathParam "id"');
        }
        const post = yield post_model_1.PostModel.findOne({ _id: id });
        if (!post) {
            return resp.status(404).json({ message: "No se ha encontrado el post" });
        }
        yield post.deleteOne();
        resp.json({ message: "El post ha sido eliminado correctamente" });
    });
}
