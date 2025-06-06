import {z} from 'zod';
import 'dotenv/config';

export const CLIENT_ID: string = z.string().parse(process.env.CLIENT_ID);
export const CLIENT_SECRET: string = z.string().parse(process.env.CLIENT_SECRET);
export const SESSION_KEY: string = z.string().parse(process.env.SESSION_KEY);
export const PORT: number = Number(z.string().parse(process.env.PORT));
export const NODE_ENV: string = z.string().parse(process.env.NODE_ENV);
export const CALLBACK_URL: string = NODE_ENV === 'PRODUCTION' ? z.string().parse(process.env.PRODUCTION_CALLBACK) : z.string().parse(process.env.DEVELOPMENT_CALLBACK);