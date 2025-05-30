import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    spotifyId: {
        type: String,
        require: true,
        unique: true
    },
    hashedRefreshToken: {
        type: String,
        require: true,
    }
});

export default mongoose.model('User', schema);