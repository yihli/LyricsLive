import axios from 'axios';
import { SpotifyProfileSchema, type SpotifyProfile } from '../types';

const baseUrl = '/api/spotify/isloggedin';

// check if the backend has a session saved. 
// if so, we can consider the user logged in and get their data.
const isLoggedIn = async (): Promise<boolean> => {
    // must allow credentials to match sessions 
    const returned = await axios.get(baseUrl, { withCredentials: true });
    if (returned.data.isLoggedIn === true) {
        return true;
    }

    return false;
}

const getUserProfile = async (): Promise<SpotifyProfile> => {
    const { data }  = await axios.get('/api/spotify/me', { withCredentials: true });
    return SpotifyProfileSchema.parse(data);
}

const getCurrentlyPlaying = async () => {
    const { data } = await axios.get('/api/spotify/currentlyplaying', { withCredentials: true });
    return data;
}

const login = async () => {
    window.location.href = '/api/spotify/login';
}

const logout = async () => {
    const { data } = await axios.post('/api/spotify/logout', null, { withCredentials: true });
    return data
}

export default {
    isLoggedIn,
    getUserProfile,
    logout,
    getCurrentlyPlaying,
    login
}