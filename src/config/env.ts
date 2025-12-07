import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env')});

export const config = {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL as string,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwt: {
        secret: process.env.JWT_SECRET as string,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
};
