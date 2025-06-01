import type { TranslatedSyncedLyrics } from "../types";
import { useEffect, useRef } from 'react';

interface Props {
	lyrics: Array<TranslatedSyncedLyrics> | undefined;
	currentTimestamp: number;
}

const getLyricsIndex = (currentLyrics: Array<TranslatedSyncedLyrics>, currentTimestamp: number): number => {
	const length = currentLyrics.length;
	for (let i = 0; i < length - 1; i++) {
		if (currentLyrics[i].time <= currentTimestamp && currentTimestamp <= currentLyrics[i + 1].time) {
			return i;
		}
	}

	return -1;
}

const LyricsDisplay = ({ lyrics, currentTimestamp }: Props) => {

	const currentIndex = lyrics ? getLyricsIndex(lyrics, currentTimestamp) : 0;
	const currentLineRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (currentLineRef.current) {
			currentLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, [currentIndex]);


	return (

		<div className={`h-full flex-1 overflow-hidden ${lyrics?'bg-green-400':'bg-gray-200'} rounded-sm tracking-tighter`}>
			{	lyrics 
			? lyrics.map(line =>
				(
					<div className={`p-3 bg-gray-200 rounded-2 ${line.id === currentIndex ? 'ml-4 text-xl' : 'text-xl'}`} ref={line.id === currentIndex ? currentLineRef : null}>
						<div className='font-bold'>{line.translated}</div>
						<div>{line.original}</div>
					</div>))
			: <div className='h-full w-full flex justify-center items-center text-4xl'>There are no lyrics. Yet.</div>

			}
		</div>
	)
};

export default LyricsDisplay;