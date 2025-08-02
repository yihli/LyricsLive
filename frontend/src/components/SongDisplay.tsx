import type { UseQueryResult } from "@tanstack/react-query";
import type { CurrentSpotifySong } from "../types";
import prettyMs from "pretty-ms";

interface Props {
	currentlyPlaying: UseQueryResult<CurrentSpotifySong, Error>;
	progressTime: number;
}

const SongDisplay = ({ currentlyPlaying, progressTime }: Props) => {
	if (currentlyPlaying.isLoading) {
		return <div className='lg:h-full lg:w-[25rem] lg:tracking-tighter song-display-bg'>Searching for song...</div>
	} else if (currentlyPlaying.error) {
		return <div className='lg:h-full lg:w-[25rem] lg:tracking-tighter song-display-bg'>Error detecting song.</div>
	} else if (!currentlyPlaying.data) {
		return <div className='lg:h-full lg:w-[25rem] lg:tracking-tighter song-display-bg'>Error detecting song.</div>
	} else if (currentlyPlaying.data.isPlaying === false) {
		return <div className='lg:h-full lg:w-[25rem] lg:tracking-tighter song-display-bg'>No song detected. Hop on spotify already!</div>
	}
	const artistName: string = currentlyPlaying.data.item.album.artists[0].name;
	// const albumName: string = currentlyPlaying.data.item.album.name;
	const songName: string = currentlyPlaying.data.item.name;
	const songImageUrl: string = currentlyPlaying.data.item.album.images[0].url;
	const songDuration: number = currentlyPlaying.data.item.duration_ms;
	return (
		<div className='
			song-display-bg
			flex flex-row h-[7.5rem] gap-2 items-center z-1
			lg:flex lg:h-full lg:flex-col lg:w-[25rem] lg:items-center tracking-tighter lg:p-[3.5rem] lg:gap-none'
		>
			<img className='
				h-full w-auto
				lg:h-[18rem] lg:w-[18rem] lg:rounded-sm lg:mb-2' src={songImageUrl}></img>
			<div className='flex-1 lg:flex lg:flex-col lg:w-full'>
				<div className='lg:text-2xl font-bold'>{songName}</div>
				<div className='lg:text-xl'>{artistName}</div>

				<div className='lg:text-xl'>{prettyMs(progressTime, { colonNotation: true, secondsDecimalDigits: 0 })}/{prettyMs(songDuration, { colonNotation: true, secondsDecimalDigits: 0 })}</div>
			</div>
		</div>
	)
};

export default SongDisplay;