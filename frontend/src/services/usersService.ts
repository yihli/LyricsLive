import axios from 'axios';

const baseUrl = '/api/login';

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

const getUserProfile = async () => {
    const { data }  = await axios.get('/api/me', { withCredentials: true });
    return data;
}

const getCurrentlyPlaying = async () => {
    const { data } = await axios.get('/api/currentlyplaying', { withCredentials: true });
    return data;
}

const logout = async () => {
    const { data } = await axios.post('/api/logout', null, { withCredentials: true });
    return data
}

export default {
    isLoggedIn,
    getUserProfile,
    logout,
    getCurrentlyPlaying
}