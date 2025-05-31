import type { TranslatedSyncedLyrics } from "../types";

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

	return (
		<div>
			{
				lyrics.map(line => {
					if (line.id === getLyricsIndex(lyrics, currentTimestamp)) {
						return (
							<div style={{ border: '1px solid black' }}>
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