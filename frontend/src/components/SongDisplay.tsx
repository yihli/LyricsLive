import type { UseQueryResult } from "@tanstack/react-query";
import type { CurrentSpotifySong } from "../types";
import prettyMs from "pretty-ms";

interface Props {
    currentlyPlaying: UseQueryResult<CurrentSpotifySong, Error>;
    progressTime: number;
}

const SongDisplay = ({ currentlyPlaying, progressTime }: Props) => {
    if (currentlyPlaying.isLoading) {
        return <div className='lg:h-full lg:w-[20rem] lg:tracking-tighter'>Searching for song...</div>
    } else if (currentlyPlaying.error) {
        return <div className='lg:h-full lg:w-[20rem] lg:tracking-tighter'>Error detecting song.</div>
    } else if (!currentlyPlaying.data) {
        return <div className='lg:h-full lg:w-[20rem] lg:tracking-tighter'>Error detecting song.</div>
    } else if (currentlyPlaying.data.isPlaying === false) {
        return <div className='lg:h-full lg:w-[20rem] lg:tracking-tighter'>No song detected. Hop on spotify already!</div>
    }
    const artistName: string = currentlyPlaying.data.item.album.artists[0].name;
    const albumName: string = currentlyPlaying.data.item.album.name;
    const songName: string = currentlyPlaying.data.item.name;
    const songImageUrl: string = currentlyPlaying.data.item.album.images[0].url;
    const songDuration: number = currentlyPlaying.data.item.duration_ms;
    return (
        <div className='
            h-[6rem] flex flex-row w-3/4 tracking-tighter gap-3
            lg:h-full lg:flex-col lg:w-[20rem] tracking-tighter lg:border-1 lg:p-3 lg:gap-none'
        >
            <img className='h-[6rem] lg:h-[20rem] lg:rounded-sm lg:mb-2' src={songImageUrl}></img>
            <div className='lg:flex lg:flex-col '>
                <div className='text-3xl font-bold'>{songName}</div>
                <div className='text-2xl'>{artistName}</div>
                <div className='hidden lg:block lg:text-2xl'>{albumName}</div>
                <div className='text-2xl'>{prettyMs(progressTime, { colonNotation: true, secondsDecimalDigits: 0 })}/{prettyMs(songDuration, { colonNotation: true, secondsDecimalDigits: 0 })}</div>
            </div>
        </div>
    )
};

export default SongDisplay;