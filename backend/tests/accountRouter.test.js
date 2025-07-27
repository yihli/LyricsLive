import { describe, it, test, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import app from '../src/app';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import Account from '../src/models/account';
import mongoose from 'mongoose';

const api = supertest(app);

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Creating users', () => {
    beforeEach(async () => {
        await Account.deleteMany({});
    });

    it('starts off with empty account database', async () => {
        const allAccounts = await Account.find({});
        expect(allAccounts.length).toBe(0);
    });

    it('returns 201 on successful creation and password hashes correctly', async () => {
        const response = await api
            .post('/api/accounts/register')
            .send({
                username: 'user',
                email: 'email@email.com',
                password: "blehbleh"
            })
            .expect(201);

        const account = await Account.findOne({ username: 'user' });
        expect(account).toBeInstanceOf(Object);
        expect(account).toHaveProperty('username', 'user');
        expect(account).toHaveProperty('email', 'email@email.com');
        expect(account).toHaveProperty('hashedPassword');
        expect(response.body.message).toBe('account successfully created');

        const passwordHashMatch = await bcrypt.compare('blehbleh', account.hashedPassword);
        expect(passwordHashMatch).toBe(true);
    });

    describe('returns 401 on missing parameters and does not save to database', () => {
        const cases = [
            // missing one param
            [{ username: 'hello', email: 'hello' }],
            [{ username: 'hello', password: 'goofyahh' }],
            [{ email: 'hello', password: 'goofyahh' }],
            // nothing is sent
            [{}]
        ];

        test.each(cases)('%o', async (testCase) => {
            const response = await api
                .post('/api/accounts/register')
                .send(testCase)
                .expect(400);

            const accountsInDb = await Account.find({});
            expect(accountsInDb.length).toBe(0);
            expect(response.body.error).toBe('missing one or more parameters');
        });
    });

    it('returns 400 if username or email already exists', async () => {
        await api
            .post('/api/accounts/register')
            .send({
                username: 'user',
                email: 'email@email.com',
                password: "blehbleh"
            });

        const response1 = await api
            .post('/api/accounts/register')
            .send({
                username: 'user',
                email: 'another@gmail.com',
                password: "blehbleh"
            })
            .expect(400);

        const response2 = await api
            .post('/api/accounts/register')
            .send({
                username: 'user1',
                email: 'email@email.com',
                password: "blehbleh"
            })
            .expect(400);

        expect(response1.body.error).toBe('the username is already taken');
        expect(response2.body.error).toBe('the email is already used');

        const search1 = await Account.find({ email: 'another@gmail.com' });
        const search2 = await Account.find({ username: 'user1' });
        expect(search1.length).toBe(0);
        expect(search2.length).toBe(0);
    });
});

describe('logging in', () => {
    beforeAll(async () => {
        await Account.deleteMany({});
        await api
            .post('/api/accounts/register')
            .send({
                username: 'user',
                password: 'yeah',
                email: 'hello@gmail.com'
            });
    });

    it('returns an object with token on successful login', async () => {
        const response = await api
            .post('/api/accounts/login')
            .send({
                username: 'user',
                password: 'yeah'
            })
            .expect(200);


        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty('token');
    });

    describe('returns 400 with missing parameters', () => {
        const missingParametersCases = [
            [{ username: 'no' }],
            [{ password: 'no' }],
            [{}]
        ];

        test.each(missingParametersCases)('%o', async (input) => {
            const response = await api
                .post('/api/accounts/login')
                .send(input)
                .expect(400);
            expect(response.body).toHaveProperty('error', 'missing one or more parameters');
        });
    });

    it('returns 400 on nonexisting username or incorrect password', async () => {
        const response1 = await api
            .post('/api/accounts/login')
            .send({ username: 'bleh', password: 'yeah' })
            .expect(400);

        const response2 = await api
            .post('/api/accounts/login')
            .send({ username: 'user', password: 'no' })
            .expect(400);

        expect(response1.body).toHaveProperty('error', 'account with the username does not exist');
        expect(response2.body).toHaveProperty('error', 'password is incorrect');
    });
});

describe('updating users', () => {
    let testAccount = undefined;
    let token = '';

    beforeEach(async () => {
        await Account.deleteMany({});
        await api
            .post('/api/accounts/register')
            .send({
                username: 'user',
                password: 'yeah',
                email: 'hello@gmail.com'
            });
        testAccount = await Account.findOne({ username: 'user' });

        const response = await api
            .post('/api/accounts/login')
            .send({
                username: 'user',
                password: 'yeah',
            });
        console.log('accountRouter.test: updating users: beforeEach: login response:', response.body);
        token = response.body.token;
    });

    it('returns 400 if missing token', async () => {
        const response = await api
            .put(`/api/accounts/${testAccount._id}`)
            .send({
                username: 'user',
                password: 'yeah12',
                email: 'hello@gmail.com'
            })
            .expect(400);

        expect(response.body.error).toBe('the token is missing');
    });

    it('returns 401 if invalid token', async () => {
        console.log('token for 401 is', token)
        const response = await api
            .put(`/api/accounts/${testAccount._id}`)
            .set('Authorization', 'Bearer hello')
            .send({
                username: 'user',
                password: 'yeah12',
                email: 'hello@gmail.com'
            })
            .expect(401);

        expect(response.body.error).toBe('the token is invalid');
    });

    describe('returns 200 and updated account details on individual fields changes', () => {
        const updateAccountCases = [
            [
                {
                    username: 'hello1'
                },
                {
                    username: 'hello1',
                    email: 'hello@gmail.com'
                }
            ],
            [
                {
                    email: 'abcdef@gmail.com'
                },
                {
                    username: 'user',
                    email: 'abcdef@gmail.com'
                }
            ],
            [
                {
                    discordUserId: '1234'
                },
                {
                    username: 'user',
                    email: 'hello@gmail.com',
                    discordUserId: '1234'
                }
            ],
            [
                {
                },
                {
                    username: 'user',
                    email: 'hello@gmail.com'
                }
            ],

        ];

        it.each(updateAccountCases)("%o -> %o", async (input, expected) => {
            const response = await api
                .put(`/api/accounts/${testAccount._id}`)
                .set('Authorization', 'Bearer ' + token)
                .send(input)
                .expect(200);

            expect(response.body).toStrictEqual(expected);
        });
    });

    it('after updating password, new password recieves 200 and old password receives 400', async () => {
        const response = await api
            .put(`/api/accounts/${testAccount._id}`)
            .set('Authorization', 'Bearer ' + token)
            .send({
                password: 'omg so cool',
            })
            .expect(200);

        await api
            .post('/api/accounts/login')
            .send({
                username: 'user',
                password: 'omg so cool'
            })
            .expect(200);

        const wrongLoginResponse = await api
            .post('/api/accounts/login')
            .send({
                username: 'user',
                password: 'yeah'
            })
            .expect(400);

        expect(wrongLoginResponse.body.error).toBe('password is incorrect');
    });
});