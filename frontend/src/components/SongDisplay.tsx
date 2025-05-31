import type { UseQueryResult } from "@tanstack/react-query";
import type { CurrentSpotifySong } from "../types";
import prettyMs from "pretty-ms";

interface Props {
    currentlyPlaying: UseQueryResult<CurrentSpotifySong, Error>;
    progressTime: number;
}

const SongDisplay = ({ currentlyPlaying, progressTime }: Props) => {
    if (currentlyPlaying.isLoading) {
        return <div>loading...</div>
    } else if (currentlyPlaying.error) {
        return <div>no song is detected.</div>
    } else if (!currentlyPlaying.data) {
        return <div>error occurred.</div>
    }

    const artistName: string = currentlyPlaying.data.item.album.artists[0].name;
    const albumName: string = currentlyPlaying.data.item.album.name;
    const songName: string = currentlyPlaying.data.item.name;
    const songImageUrl: string = currentlyPlaying.data.item.album.images[0].url;
    const songDuration: number = currentlyPlaying.data.item.duration_ms;
    return (
        <div>
            <img src={songImageUrl}></img>
            <div className='text-xl font-bold'>{songName}</div>
            <div>{artistName}</div>
            <div>{albumName}</div>
            <div>{prettyMs(progressTime, { colonNotation: true, secondsDecimalDigits: 0 })}/{prettyMs(songDuration, { colonNotation: true, secondsDecimalDigits: 0 })}</div>
        </div>
    )
};

export default SongDisplay;