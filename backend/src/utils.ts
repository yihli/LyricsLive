import { translate } from 'google-translate-api-x';

export const findSyncedLyrics = (lrcList: {syncedLyrics: string}[]) => {
  for (let i = 0; i < lrcList.length; i++) {
    if (lrcList[i].syncedLyrics !== null) {
      return lrcList[i].syncedLyrics;
    }
  }

  return lrcList[0].syncedLyrics;
};

const extractTime = (text: string): number => {
  const match = text.match(/\[(\d+):(\d+)\.(\d+)\]/);
  if (!match) {
    throw new Error("Invalid LRC timestamp format");
  }

  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  const hundredths = parseInt(match[3], 10);

  return (minutes * 60 * 1000) + (seconds * 1000) + (hundredths * 10);
}

const extractLine = (text: string): string => {
  const match = text.match(/\](.*)/);
  if (match) {
    return match[1];
  }

  return '';
};

const getTranslatedLyrics = async (lyricsString: string) => {
  let splitLyrics = lyricsString.split('\n');
  splitLyrics = splitLyrics.map(lyric => extractLine(lyric));
  const stringToTranslate = splitLyrics.join('\n---');
  console.log(stringToTranslate);
  let {text} = await translate(stringToTranslate, { to: 'en' });
  return text.split('\n---');
};

export const getOriginalAndTranslatedLyrics = async (lyricsString: string) => {
  const parsed = lyricsString.split('\n');
  const translatedLyrics = await getTranslatedLyrics(lyricsString);


  console.log('parse lyrics:', parsed);
  let to_return = [];
  for (let i = 0; i < parsed.length; i++) {
    to_return[i] = {
      id: i, 
      time: extractTime(parsed[i]),
      original: extractLine(parsed[i]), 
      translated: translatedLyrics[i]
    };
  }

  return to_return;
};