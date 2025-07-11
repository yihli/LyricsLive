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
        require: true
    }
});

// InferSchemaType generates TS type from mongoose schema
export type Account = InferSchemaType<typeof accountSchema>;

export default model<Account>('Account', accountSchema);