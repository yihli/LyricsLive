import express from 'express';
import { z } from 'zod';

import type { Request, Response } from 'express';
import type { LyricsRequest, LrcLibResult, TranslatedSyncedLyrics } from '../types';

import { getOriginalAndTranslatedLyrics, findSyncedLyrics } from '../utils/lyrics';

const router = express.Router();

router.post('/getlyrics', async (req: Request<object, unknown, LyricsRequest>, res: Response) => {
    if (!req.body) {
        res.status(400).send({ error: 'Missing track, artist, or both names' });
    }

    if (!req.body.trackName || !req.body.artistName) {
        res.status(400).send({ error: 'Missing track, artist, or both names' });
    }

    const lrcLibSearchUrl = (trackName: string, artistName: string): string => {
        return `https://lrclib.net/api/search?track_name=${trackName}&artist_name=${artistName}`;
    };

    const trackName = z.string().parse(req.body.trackName);
    const artistName = z.string().parse(req.body.artistName);
    const currentSongLyrics = await fetch(lrcLibSearchUrl(trackName, artistName), {
        method: 'GET'
    });
    const currentSongLyricsJson: LrcLibResult[] = await currentSongLyrics.json();

    const translatedLyrics: TranslatedSyncedLyrics[] = await getOriginalAndTranslatedLyrics(findSyncedLyrics(currentSongLyricsJson));

    res.send({ translatedLyrics });
});

export default router;