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
const users_model_1 = require("../mongo/models/users.model");
const router = (0, express_1.Router)();
exports.router = router;
/**
 * * USERS
 */
router.get("/users/login", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield users_model_1.UserModel.findOne({ email });
        if (!user) {
            return resp.status(400).json({ message: "Credenciales inválidas" });
        }
        if (user.password !== password) {
            return resp.status(400).json({ message: "Credenciales inválidas" });
        }
        resp.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        resp
            .status(500)
            .json({ message: "Ha ocurrido un error al procesar la solicitud" });
    }
}));
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
function register(user, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, name, password } = user;
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
        const newUser = new users_model_1.UserModel(user);
        yield newUser.save();
        return resp.status(201).json(newUser);
    });
}
/**
 * * POSTS
 */
router.get("/post", (req, resp) => __awaiter(void 0, void 0, void 0, function* () { }));
router.post("/post", (req, resp) => __awaiter(void 0, void 0, void 0, function* () { }));
router.put("/post", (req, resp) => __awaiter(void 0, void 0, void 0, function* () { }));
router.delete("/post", (req, resp) => __awaiter(void 0, void 0, void 0, function* () { }));
