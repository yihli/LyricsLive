import express,{ Request, Response } from 'express'
import { z } from 'zod';

import { CLIENT_ID, CALLBACK_URL } from '../utils/env_setup';

import type { CurrentSpotifySong, SpotifyProfile } from '../types';
const router = express.Router();

router.get('/login', (_req: Request, res: Response) => {
    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=user-read-private%20user-read-email%20user-read-currently-playing&redirect_uri=${CALLBACK_URL}`)
})

router.post('/logout', (req: Request, res: Response) => {
    if (!req.session.user) {
        throw new Error('/api/logout: no session found.')
    } else {
        req.session.destroy(() => {
            console.log('Session destroyed.')
        })
        res.status(200).send({ message: 'Successfully logged out' });
    }
})

// if a session exists, the user has logged in before and the refresh token exists.
router.get('/isloggedin', async (req: Request, res: Response) => {
    if (req.session.user) {
        res.json({ isLoggedIn: true });

    } else {
        res.json({ isLoggedIn: false })
    }
});

router.get('/currentlyplaying', async (req: Request, res: Response) => {
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
        const currentSongJson: CurrentSpotifySong = await currentSongResponse.json();
        res.send({ ...currentSongJson, isPlaying: true });
    } catch (e) {
        res.send({ isPlaying: false })
    }
})

router.get('/me', async (req: Request, res: Response) => {
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

    const userDetailsJson: SpotifyProfile = await userDetailsResponse.json();
    res.send(userDetailsJson);
});

export default router;