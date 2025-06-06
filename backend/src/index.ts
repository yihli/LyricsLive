import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
// import mongoose from 'mongoose';
import cors from 'cors';

import songRouter from './routes/songRouter';
import userRouter from './routes/userRouter';

import Encryption from './utils/encryption';

import { CLIENT_ID, CLIENT_SECRET, SESSION_KEY, PORT, NODE_ENV, CALLBACK_URL } from './utils/env_setup';

import type { SpotifyCallbackQuery, AuthCodeResponse } from './types';

/*
TODO:
    - even without synced lyrics, show only the regular lyrics.
*/

console.log(NODE_ENV);

// Extend express-session types to include 'user' property
declare module 'express-session' {
    interface SessionData {
        user?: { encryptedRefreshToken: string, access_token: string, timeSaved: number };
    }
}

const app = express();

if (NODE_ENV === 'PRODUCTION') {
    app.use(express.static('dist'));
}

// must allow credentials to match sessions in the front and backend.
app.use(cors(
    // {
    // origin: 'http://localhost:5173',
    // credentials: true
    // }
));

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

app.use(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.session.user) {
        return next();
    }
    const timeSinceLastToken: number = req.session.user?.timeSaved
        ? Date.now() - req.session.user?.timeSaved
        : Number.MAX_SAFE_INTEGER
    if (timeSinceLastToken > 1000 * 60 * 30) {
        console.log('updating refresh token');
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
        console.log('Access token refreshed')
    }
    next()
})

app.use('/api/songs', songRouter);

app.use('/api/user', userRouter);

// Spotify returns back here after asking user to allow/deny permissions.
app.get('/callback', async (req: Request<any, any, any, SpotifyCallbackQuery>, res: Response) => {
    // after user logs in, receive an authentication code
    const query: SpotifyCallbackQuery = req.query;

    if (query.error || !query.code) {
        res.send('Error/missing code.');
    }

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
    // saved the encrypted refreshtoken in a session cookie.
    const encryptedRefreshToken = Encryption.encrypt(authCodeJson.refresh_token);
    req.session.user = { encryptedRefreshToken: encryptedRefreshToken, access_token: authCodeJson.access_token, timeSaved: Date.now() };
    res.redirect(NODE_ENV === 'PRODUCTION' ? '/' : 'http://localhost:5173/');
});

app.get('/api/error', (_req, _res) => {
    throw new Error('testing access token refresh.')
})

app.use(async (error: any, _req: Request, res: Response, _next: NextFunction) => {
    console.log(error);
    res.status(500).send({ error });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});