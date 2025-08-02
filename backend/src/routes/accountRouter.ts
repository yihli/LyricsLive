import express from 'express';
import bcrypt from 'bcrypt';
import Account, { UserAccount, PublicUserAccount, UpdateUserAccount } from '../models/account';
import {  LoginObject, NewAccountDetails, UpdateAccountDetails } from '../types';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import env from '../utils/env_setup';

const router = express.Router();

// to create an account in database
router.post('/register', async (req, res) => {
    const body: NewAccountDetails = req.body;

    if (!body.email || !body.password || !body.username) {
        res.status(400).send({ error: 'missing one or more parameters' });
        return;
    }

    const hashedPassword: string = await bcrypt.hash(body.password, 10);

    const newAccount = new Account({
        username: body.username,
        email: body.email,
        hashedPassword
    });

    try {
        await newAccount.save();
    } catch (e: unknown) {
        console.log(e);
        if (e instanceof mongoose.mongo.MongoServerError) {
            console.log(e.message);
            if ('code' in e && e.code === 11000) {
                if (e.errorResponse?.errmsg?.includes('email')) {
                    res.status(400).send({ error: 'the email is already used' });
                    return;
                } else if (e.errorResponse?.errmsg?.includes('username')) {
                    res.status(400).send({ error: 'the username is already taken' });
                    return;
                }
            }
        }
    }

    res.status(201).send({ message: 'account successfully created' });
    return;
});

// to verify login details and return valid jwt
router.post('/login', async (req, res) => {
    const body: LoginObject = req.body;

    if (!body.password || !body.username) {
        res.status(400).send({ error: 'missing one or more parameters' });
        return;
    }

    const foundAccount: UserAccount | null = await Account.findOne({ username: body.username });
    if (!foundAccount) {
        res.status(400).send({ error: 'account with the username does not exist' });
        return;
    }

    const passwordCorrect = await bcrypt.compare(body.password, foundAccount.hashedPassword);
    if (!passwordCorrect) {
        res.status(400).send({ error: 'password is incorrect' });
        return;
    }

    const tokenDetails = {
        username: foundAccount?.username,
        sub: foundAccount?._id
    };

    const token = await jwt.sign(tokenDetails, env.JWT_SECRET, { expiresIn: '3d' });
    res.status(200).send({ token });
});

// to update account details
// requires auth 
router.put('/:id', async (req: any, res, next) => {
    const token = req.token;
    const body: Partial<UpdateAccountDetails> = req.body;

    if (!token) {
        res.status(400).send({ error: 'the token is missing' });
        return;
    }

    // dont include password because that's a separate check
    const possibleFields: string[] = [
        'username',
        'email',
        'discordUserId'
    ];

    if (!token) {
        res.status(400).send({ error: 'the token is missing' });
        return;
    }

    // populate with the given fields in the request body
    const toSendToDB: Partial<UpdateUserAccount> = {};
    if (body.password) {
        toSendToDB.hashedPassword = await bcrypt.hash(body.password, 10);
    }
    for (const field of possibleFields) {
        if (body[field as keyof UpdateAccountDetails]) {
            toSendToDB[field as keyof UpdateUserAccount] = body[field as keyof UpdateAccountDetails];
        }
    }
    console.log('put /account/id token:', token);

    try {
        // update in DB
        const updatedAccount: UserAccount | null = await Account.findByIdAndUpdate(
            token.sub,
            toSendToDB,
            { new: true }
        );
        if (!updatedAccount) {
            throw new Error('error finding by id and updating');
        }

        // return the updated account details
        const toReturn: PublicUserAccount = {
            username: updatedAccount.username,
            email: updatedAccount.email,
            discordUserId: updatedAccount.discordUserId,
        };
        res.status(200).send(toReturn);
    } catch (err) {
        next(err);
    }
});

export default router;