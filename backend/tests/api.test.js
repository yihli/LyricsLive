import app from '../src/app';
import discordBot from '../src/discord/bot';
import supertest from 'supertest';

import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import { DISCORD_TOKEN } from '../src/utils/env_setup';

const api = supertest(app);

describe('on startup', () => {
    it('successfully connects to the discord bot', async () => {
        let success = false;

        discordBot.once('ready', () => {
            success = true;
        });

        await discordBot.login(DISCORD_TOKEN);

        expect(success).toBe(true);

        await discordBot.destroy();
    })
})