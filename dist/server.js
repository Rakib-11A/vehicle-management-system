"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const startServer = async () => {
    try {
        // Initialize database
        await (0, database_1.initDB)();
        // Start sever
        app_1.default.listen(env_1.config.port, () => {
            console.log(`Server running on port ${env_1.config.port}`);
            // console.log(`Environment: ${config.nodeEnv}`);
            // console.log(`API URL: http://localhost:${config.port}/api/v1`);
        });
    }
    catch (error) {
        console.error('Failed to start server: ', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map