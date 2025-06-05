import express from 'express';
import { z } from 'zod';

import type { Request, Response } from 'express';
import type { LyricsRequest, LrcLibResult, TranslatedSyncedLyrics } from '../types';

import { getOriginalAndTranslatedLyrics, findSyncedLyrics } from '../utils/lyrics';


const router = express.Router();

router.post('/getlyrics', async (req: Request<any, any, LyricsRequest>, res: Response) => {
    const lrcLibSearchUrl = (trackName: string, artistName: string): string => {
        return `https://lrclib.net/api/search?track_name=${trackName}&artist_name=${artistName}`;
    };

    const trackName = z.string().parse(req.body.trackName);
    const artistName = z.string().parse(req.body.artistName);
    if (!trackName || !artistName) {
        throw new Error('Missing track name or artist name.')
    }

    const currentSongLyrics = await fetch(lrcLibSearchUrl(trackName, artistName), {
        method: 'GET'
    });
    const currentSongLyricsJson: Array<LrcLibResult> = await currentSongLyrics.json();

    const translatedLyrics: Array<TranslatedSyncedLyrics> = await getOriginalAndTranslatedLyrics(findSyncedLyrics(currentSongLyricsJson));

    res.send({ translatedLyrics });
});

export default router;