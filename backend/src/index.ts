import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import cors from 'cors';
import { z } from 'zod';
import 'dotenv/config';

// import { parseLyrics } from './utils';
import Encryption from './encryption';

const MONGODB_URI: string = z.string().parse(process.env.MONGODB_URI);
const CLIENT_ID: string = z.string().parse(process.env.CLIENT_ID);
const CLIENT_SECRET: string = z.string().parse(process.env.CLIENT_SECRET);
const SESSION_KEY: string = z.string().parse(process.env.SESSION_KEY);
const PORT: number = Number(z.string().parse(process.env.PORT));

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Extend express-session types to include 'user' property
declare module 'express-session' {
    interface SessionData {
        user?: { encryptedRefreshToken: string, access_token: string };
    }
}

interface SpotifyCallbackQuery {
    error?: string;
    code: string;
}

const app = express();

// must allow credentials to match sessions in the front and backend.
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// Session middleware
app.use(session({
    secret: SESSION_KEY,
    resave: false,             // don't save session if unmodified
    saveUninitialized: false,  // only save sessions if something is stored
    cookie: {
        httpOnly: true,          // prevent client-side JS access
        secure: false,           // set to true in production (requires HTTPS)
        sameSite: 'strict',      // CSRF protection
        maxAge: 1000 * 60 * 60 * 72  // 3 days
    }
}));

app.get('/', (_, res) => {
    res.send('hello world!');
});

app.post('/api/logout', (req, res) => {
    console.log('/api/logout: ', req.session.user);
    if (!req.session.user) {
        throw new Error('/api/logout: no session found.')
    } else {
        req.session.destroy(() => {
            console.log('session destroyed.')
        })
        res.status(200).send('Successfully logged out');
    }
})

// if a session exists, the user has logged in before and the refresh token exists.
app.get('/api/login', async (req, res) => {
    if (req.session.user) {
        res.json({ isLoggedIn: true });

    } else {
        res.json({ isLoggedIn: false })
    }
});

app.post('/api/getlyrics', async (req, res) => {
    const lrcLibSearchUrl = (trackName: string, artistName: string): string => {
        return `https://lrclib.net/api/search?track_name=${trackName}&artist_name=${artistName}`;
    };
    const { trackName, artistName } = req.body
    if (!trackName || !artistName) {
        throw new Error ('Missing track name or artist name.')
    }

    const currentSongLyrics = await fetch(lrcLibSearchUrl(trackName, artistName), {
        method: 'GET'
    });
    const currentSongLyricsJson = await currentSongLyrics.json();
    console.log('current song lyrics:', currentSongLyricsJson[0]);
    res.send(currentSongLyricsJson);
});

app.get('/api/currentlyplaying', async (req, res) => {
    const currentPlayingUrl: string = 'https://api.spotify.com/v1/me/player/currently-playing';

    if (!req.session.user) {
        throw new Error('/api/currentlyplaying: Missing session. Is user logged in?')
    }

    // get user details 
    const currentSongResponse = await fetch(currentPlayingUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.session.user.access_token
        }
    });

    try {
        const currentSongJson = await currentSongResponse.json();
        
        console.log(currentSongJson)

        // REFACTOR INTO THE GETLYRICS ENDPOINT
        // const trackName = currentSongJson.item.name;
        // const artistName = currentSongJson.item.album.artists[0].name;
        // const currentSongLyrics = await fetch(lrcLibSearchUrl(trackName, artistName), {
        //     method: 'GET'
        // });
        // const currentSongLyricsJson = await currentSongLyrics.json();
        // console.log('current song lyrics:', currentSongLyricsJson[0])


        // res.send({ isPlaying: true, lyrics: parseLyrics(currentSongLyricsJson[0].syncedLyrics), ...currentSongJson });

        res.send({ isPlaying: true, ...currentSongJson });
    } catch (e) {
        res.send({ isPlaying: false })
    }
})

app.get('/api/me', async (req, res) => {
    const userDetailsUrl: string = 'https://api.spotify.com/v1/me';
    const accessToken: string = z.string().parse(req.session.user?.access_token);

    if (!accessToken) {
        throw new Error('/api/me: Missing access token. Is user logged in?')
    }

    // get user details 
    const userDetailsResponse = await fetch(userDetailsUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    const userDetailsJson = await userDetailsResponse.json();

    console.log('/api/me called.')
    res.send(userDetailsJson);
});

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
        redirect_uri: 'http://localhost:3000/callback',
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

    const authCodeJson = await authCodeResponse.json();
    console.log('/callback acess and refresh token response:', authCodeJson);

    // saved the encrypted refreshtoken in a session cookie.
    const encryptedRefreshToken = Encryption.encrypt(authCodeJson.refresh_token);
    req.session.user = { encryptedRefreshToken: encryptedRefreshToken, access_token: authCodeJson.access_token };

    console.log('req.session.user sucessfully saved: ', req.session.user.encryptedRefreshToken);
    console.log('req.session.user.access_token saved:', req.session.user.access_token);

    res.redirect('http://localhost:5173/');
});


app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).send({ error: error.message });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});