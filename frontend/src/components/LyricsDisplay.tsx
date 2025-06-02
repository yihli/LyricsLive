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

		<div className={`lg:h-full lg:flex-1 lg:overflow-hidden ${lyrics?'lg:bg-green-400':'lg:bg-gray-200'} lg:rounded-sm lg:tracking-tighter`}>
			{	lyrics 
			? lyrics.map(line =>
				(
					<div className={`lg:p-3 lg:bg-gray-200 lg:rounded-2 ${line.id === currentIndex ? 'lg:ml-4 lg:text-xl' : 'lg:text-xl'}`} ref={line.id === currentIndex ? currentLineRef : null}>
						<div className='lg:font-bold'>{line.translated}</div>
						<div>{line.original}</div>
					</div>))
			: <div className='lg:h-full lg:w-full lg:flex lg:justify-center lg:items-center lg:text-4xl'>There are no lyrics. Yet.</div>

			}
		</div>
	)
};

export default LyricsDisplay;