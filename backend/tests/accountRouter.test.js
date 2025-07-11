import { describe, it, expect, beforeEach } from '@jest/globals';
import app from '../src/app';
import supertest from 'supertest';
import Account from '../src/models/account';

const api = supertest(app);

beforeEach(async () => {
    await Account.deleteMany({});
})

it('starts off with empty account database', async () => {
    const allAccounts = await Account.find({});
    expect(allAccounts.length).toBe(0);
})


describe('Creating users', () => {

    it('connects to mongoDB', async () => {

    })
})