import app from '../src/app';
import discordBot from '../src/discord/bot';
import supertest from 'supertest';

import { afterAll, describe, expect, it } from '@jest/globals';

import { DISCORD_TOKEN } from '../src/utils/env_setup';

describe('startup', () => {
    afterEach(async () => {
        await discordBot.destroy();
    });

    it('successfully connects to the discord bot', async () => {
        let success = false;

        await discordBot.login(DISCORD_TOKEN);
        // promise to prevent race conditions
        await new Promise((resolve) => {
            discordBot.once('ready', () => {
                success = true;
                console.log('success');
                resolve();
            });
        });

        expect(success).toBe(true);
    });
});