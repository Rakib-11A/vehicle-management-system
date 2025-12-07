"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./types/express");
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Health check
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Vehicle Bookin System API is running! Alhamdulillah......',
    });
});
// API Routes
app.use('/api/v1', routes_1.default);
// 404 Not Found handler (delegates to errorHandler)
app.use(error_middleware_1.notFound);
// Error handler
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map