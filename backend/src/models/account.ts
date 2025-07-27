import { Schema, model } from 'mongoose';

// define mongoose schema
const accountSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true
    },
    discordUserId: {
        type: String
    }
});

// InferSchemaType generates TS type from mongoose schema
export interface UserAccount {
    email: string;
    username: string;
    hashedPassword: string;
    _id: string;
    discordUserId: string;
};

export type PublicUserAccount = Omit<UserAccount, 'hashedPassword' | '_id'>;
export type UpdateUserAccount = Omit<UserAccount, '_id'>;

export default model<UserAccount>('Account', accountSchema);