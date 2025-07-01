import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
// import mongoose from 'mongoose';
import cors from 'cors';

import songRouter from './routes/songRouter';
import userRouter from './routes/spotifyUserRouter';

import Encryption from './utils/encryption';

import { CLIENT_ID, CLIENT_SECRET, SESSION_KEY, NODE_ENV, CALLBACK_URL } from './utils/env_setup';

import type { SpotifyCallbackQuery, AuthCodeResponse } from './types';

// Extend express-session types to include 'user' property
declare module 'express-session' {
    interface SessionData {
        user?: { encryptedRefreshToken: string, access_token: string, timeSaved: number };
    }
}

/*
TODO:
    - even without synced lyrics, show only the regular lyrics.
*/

const app = express();

if (NODE_ENV === 'PRODUCTION') {
    app.use(express.static('dist'));
}
console.log(NODE_ENV);

// must allow credentials to match sessions in the front and backend.
app.use(cors());

app.use(express.json());

app.set('trust proxy', 1);

// Session middleware
app.use(session({
    secret: SESSION_KEY,
    resave: false,             // don't save session if unmodified
    saveUninitialized: false,  // only save sessions if something is stored
    cookie: {
        httpOnly: true,          // prevent client-side JS access
        secure: NODE_ENV === 'PRODUCTION' ? true : false,       // set to true in production (requires HTTPS)
        sameSite: 'strict',      // CSRF protection
        maxAge: 1000 * 60 * 60 * 72  // 3 days
    }
}));

app.use('/api/songs', songRouter);

app.use('/api/spotify', userRouter);

app.use(async (req: Request, _res: Response, next: NextFunction) => {
    console.log('Checking if access token needs to be refreshed...')
    if (!req.session.user) {
        console.log('Access token not found, skipping refresh...')
        return next();
    }
    const timeSinceLastToken: number = req.session.user?.timeSaved
        ? Date.now() - req.session.user?.timeSaved
        : Number.MAX_SAFE_INTEGER
    if (timeSinceLastToken > 1000 * 60 * 30) {
        console.log('Access token expired, refreshing...');
        const authCodeResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: Encryption.decrypt(req.session.user.encryptedRefreshToken)
            }),
        });

        const authCodeJson: AuthCodeResponse = await authCodeResponse.json();
        req.session.user = { ...req.session.user, access_token: authCodeJson.access_token, timeSaved: Date.now() };
        console.log('Access token refreshed,')
    }
    next()
})

// Spotify returns back here after asking user to allow/deny permissions.
app.get('/callback', async (req: Request<any, any, any, SpotifyCallbackQuery>, res: Response) => {
    console.log('Spotify returned to the callback function...')
    // after user logs in, receive an authentication code
    const query: SpotifyCallbackQuery = req.query;

    console.log('Checking for error or missing code...')
    if (query.error || !query.code) {
        console.log('Missing code or encountered error.')
        res.send('Error/missing code.');
    }

    console.log('Using code to get access and refresh token...')
    // use the authentication code to get an access token and refresh token
    const params = new URLSearchParams({
        code: query.code,
        redirect_uri: CALLBACK_URL,
        grant_type: 'authorization_code',
    });

    const authCodeResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
        },
        body: params.toString(),
    });

    const authCodeJson: AuthCodeResponse = await authCodeResponse.json();

    console.log('Got access token, and refresh token...')
    // saved the encrypted refreshtoken in a session cookie.
    const encryptedRefreshToken = Encryption.encrypt(authCodeJson.refresh_token);
    req.session.user = { encryptedRefreshToken: encryptedRefreshToken, access_token: authCodeJson.access_token, timeSaved: Date.now() };
    console.log('Saved tokens as sessions. Redirecting...')
    res.redirect(NODE_ENV === 'PRODUCTION' ? '/' : 'http://localhost:5173/');
});

app.get('/api/error', (_req, _res) => {
    throw new Error('testing access token refresh.')
})

app.use(async (error: any, _req: Request, res: Response, _next: NextFunction) => {
    console.log(error);
    res.status(500).send({ error });
});

export default app;