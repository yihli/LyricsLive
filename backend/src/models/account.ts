import { Schema, model, InferSchemaType } from 'mongoose';

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
    }
});

// InferSchemaType generates TS type from mongoose schema
export interface UserAccount {
    email: string;
    username: string;
    hashedPassword: string;
    _id: string;
};

export default model<UserAccount>('Account', accountSchema);