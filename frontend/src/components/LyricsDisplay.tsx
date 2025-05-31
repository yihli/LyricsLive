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

	if (lyrics === undefined) {
		return <div> could not find lyrics. </div>
	}

	const currentIndex = getLyricsIndex(lyrics, currentTimestamp);
	const currentLineRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (currentLineRef.current) {
			currentLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, [currentIndex]);


	return (
		<div className='h-full overflow-auto'>
			{
				lyrics.map(line => {
					if (line.id === currentIndex) {
						return (
							<div style={{ border: '1px solid black' }} ref={currentLineRef}>
								<div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{line.translated}</div>
								<div>{line.original}</div>
							</div>)
					}
					return (
						<div>
							<div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{line.translated}</div>
							<div>{line.original}</div>
						</div>)
				})
			}
		</div>
	)
};

export default LyricsDisplay;