"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT = (email) => {
    const payload = { email };
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '12h'
        }, (error, token) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.generateJWT = generateJWT;
const authMiddleware = (req, resp, next) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            return resp.status(401).json({ message: 'No se ha proporcionado un token de autenticación' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT_SEED);
        next();
    }
    catch (error) {
        console.error(error);
        resp.status(401).json({ message: 'Token de autenticación inválido' });
    }
};
exports.authMiddleware = authMiddleware;
