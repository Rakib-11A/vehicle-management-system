"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtil = void 0;
const env_1 = require("../config/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtUtil {
    static generateToken(payload) {
        const secret = env_1.config.jwt.secret;
        const options = {
            expiresIn: env_1.config.jwt.expiresIn || '7d'
        };
        return jsonwebtoken_1.default.sign(payload, secret, options);
    }
    static verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, env_1.config.jwt.secret);
    }
}
exports.JwtUtil = JwtUtil;
//# sourceMappingURL=jwt.util.js.map