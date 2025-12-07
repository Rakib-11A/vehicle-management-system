import "./types/express";
import express, { Application, Request, Response } from "express";
import routes from "./routes";
import { notFound, errorHandler } from "./middlewares/error.middleware";
const app: Application = express();

app.use(express.json());

// Health check
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Vehicle Bookin System API is running! Alhamdulillah......',
    });
});

// API Routes
app.use('/api/v1', routes);


// 404 Not Found handler (delegates to errorHandler)
app.use(notFound);

// Error handler
app.use(errorHandler);
export default app;