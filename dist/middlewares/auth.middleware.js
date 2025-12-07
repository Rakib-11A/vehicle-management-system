"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_util_1 = require("../utils/jwt.util");
const role_middleware_1 = require("./role.middleware");
const auth = (...roles) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
            }
            const decoded = jwt_util_1.JwtUtil.verifyToken(token);
            req.user = decoded;
            if (roles.length > 0) {
                const authorization = (0, role_middleware_1.authorize)(roles);
                return authorization(req, res, next);
            }
            next();
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }
    };
};
exports.default = auth;
//# sourceMappingURL=auth.middleware.js.map