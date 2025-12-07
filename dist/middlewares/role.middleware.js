"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (roles) => {
    return (req, res, next) => {
        if (roles.length > 0 && !roles.includes(req.user?.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
            });
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=role.middleware.js.map