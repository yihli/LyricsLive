import app from '../src/app';
import supertest from 'supertest';
import { describe, expect, it } from '@jest/globals';

const api = supertest(app);

describe('/:id/currentlyplaying', () => {

});

describe('/currentlyplaying', () => {
    it('saves properly data to cache', async () => {
        await api
            .post('/api/discord/currentlyplaying')
            .expect(201);
    });
});
