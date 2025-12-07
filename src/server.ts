import app from "./app";
import { initDB } from "./config/database";
import { config } from "./config/env";

const startServer = async () => {
    try{
        // Initialize database
        await initDB();

        // Start sever
        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
            // console.log(`Environment: ${config.nodeEnv}`);
            // console.log(`API URL: http://localhost:${config.port}/api/v1`);
        });
    }catch(error){
        console.error('Failed to start server: ', error);
        process.exit(1);
    }
}

startServer();