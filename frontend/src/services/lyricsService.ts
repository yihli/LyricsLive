import axios from 'axios';

const getLyrics = async (trackName: string, artistName: string) => {
    const body = { trackName, artistName };
    const { data } = await axios.post(`/api/songs/getlyrics`, body);
    return data;
}

export default {
    getLyrics
}