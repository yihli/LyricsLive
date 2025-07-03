import app from '../src/app';
import supertest from 'supertest';
import {describe, expect, it} from '@jest/globals';

const api = supertest(app);

describe('/getlyrics', () => {
    it('returns array of translated lines', async () => {
        const { body } = await api
            .post('/api/songs/getlyrics')
            .send({
                trackName: 'Illusion',
                artistName: 'aespa'
            })
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8');

        expect(body.translatedLyrics).toHaveLength(62);
        body.translatedLyrics.forEach(element => {
            expect(element).toHaveProperty('id');
            expect(element).toHaveProperty('time');
            expect(element).toHaveProperty('original');
            expect(element).toHaveProperty('translated');
        });
    });

    it('returns error if track name or artist name or both is missing', async () => {
        const noArtist = await api
            .post('/api/songs/getlyrics')
            .send({
                trackName: 'Illusion'
            })
            .expect(400);

        const noTrack = await api
            .post('/api/songs/getlyrics')
            .send({
                artistName: 'aespa'
            })
            .expect(400);

        const neither = await api
            .post('/api/songs/getlyrics')
            .expect(400);

        expect(noArtist.body).toHaveProperty('error');
        expect(noArtist.body).toEqual({
            error: 'Missing track, artist, or both names',
        });
        expect(noTrack.body).toEqual({
            error: 'Missing track, artist, or both names',
        });
        expect(neither.body).toEqual({
            error: 'Missing track, artist, or both names',
        });
    });
});