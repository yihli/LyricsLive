import { z } from 'zod';
import 'dotenv/config';

let CLIENT_ID: string = '';
let CLIENT_SECRET: string = '';
let SESSION_KEY: string = '';
let PORT: number = 0;
let NODE_ENV: string = '';
let CALLBACK_URL: string = '';
let REDIS_URL: string = '';
let DISCORD_TOKEN: string = '';
let MONGODB_URI: string = '';
let JWT_SECRET = '';

try {
    CLIENT_ID = z.string().parse(process.env.CLIENT_ID);
    CLIENT_SECRET = z.string().parse(process.env.CLIENT_SECRET);
    SESSION_KEY = z.string().parse(process.env.SESSION_KEY);
    PORT = Number(z.string().parse(process.env.PORT));
    NODE_ENV = z.string().parse(process.env.NODE_ENV);
    CALLBACK_URL = NODE_ENV === 'PRODUCTION' ? z.string().parse(process.env.PRODUCTION_CALLBACK) : z.string().parse(process.env.DEVELOPMENT_CALLBACK);
    REDIS_URL = z.string().parse(process.env.REDIS_URL);
    DISCORD_TOKEN = z.string().parse(process.env.DISCORD_TOKEN);
    MONGODB_URI = z.string().parse(process.env.MONGODB_URI);
    JWT_SECRET = z.string().parse(process.env.JWT_SECRET);
} catch {
    console.log('zod error');
}

export default {
    CLIENT_ID,
    CLIENT_SECRET,
    SESSION_KEY,
    PORT,
    NODE_ENV,
    CALLBACK_URL,
    REDIS_URL,
    DISCORD_TOKEN,
    MONGODB_URI,
    JWT_SECRET
};