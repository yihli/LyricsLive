import axios from 'axios';

const searchByTrackAndArtist = async (trackName: string, artistName: string) => {
    const { data } = await axios.get(`https://lrclib.net/api/search?track_name=${trackName}&artist_name=${artistName}`);
    return data;
}

export default {
    searchByTrackAndArtist
}