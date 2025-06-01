import type { UseQueryResult } from "@tanstack/react-query";
import type { CurrentSpotifySong } from "../types";
import prettyMs from "pretty-ms";

interface Props {
    currentlyPlaying: UseQueryResult<CurrentSpotifySong, Error>;
    progressTime: number;
}

const SongDisplay = ({ currentlyPlaying, progressTime }: Props) => {
    if (currentlyPlaying.isLoading) {
        return <div className='h-full w-[20rem] tracking-tighter'>Searching for song...</div>
    } else if (currentlyPlaying.error) {
        return <div className='h-full w-[20rem] tracking-tighter'>No song detected.</div>
    } else if (!currentlyPlaying.data) {
        return <div className='h-full w-[20rem] tracking-tighter'>No song detected.</div>
    } else if (currentlyPlaying.data.isPlaying === false) {
        return <div className='h-full w-[20rem] tracking-tighter'>No song detected.</div>
    }
    const artistName: string = currentlyPlaying.data.item.album.artists[0].name;
    const albumName: string = currentlyPlaying.data.item.album.name;
    const songName: string = currentlyPlaying.data.item.name;
    const songImageUrl: string = currentlyPlaying.data.item.album.images[0].url;
    const songDuration: number = currentlyPlaying.data.item.duration_ms;
    return (
        <div className='h-full w-[20rem] tracking-tighter'>
            <img className='rounded-sm mb-2' src={songImageUrl}></img>
            <div className='flex flex-col '>
                <div className='text-3xl font-bold'>{songName}</div>
                <div className='text-2xl'>{artistName}</div>
                <div className='text-2xl'>[{albumName}]</div>
                <div className='text-2xl'>{prettyMs(progressTime, { colonNotation: true, secondsDecimalDigits: 0 })}/{prettyMs(songDuration, { colonNotation: true, secondsDecimalDigits: 0 })}</div>
            </div>
        </div>
    )
};

export default SongDisplay;