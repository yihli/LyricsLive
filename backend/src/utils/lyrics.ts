import { translate } from 'google-translate-api-x';
import { LrcLibResult, TranslatedSyncedLyrics } from '../types';
const kroman = require('kroman');

export const findSyncedLyrics = (lrcList: LrcLibResult[]): string => {
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < lrcList.length; i++) {
    if (lrcList[i].syncedLyrics !== null) {
      return lrcList[i].syncedLyrics;
    }
  }

  return lrcList[0].syncedLyrics;
};

export const extractTime = (text: string): number => {
  const match = text.match(/\[(\d+):(\d+)\.(\d+)\]/);
  if (!match) {
    throw new Error("Invalid LRC timestamp format");
  }

  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  const hundredths = parseInt(match[3], 10);

  return (minutes * 60 * 1000) + (seconds * 1000) + (hundredths * 10);
};

export const extractLine = (text: string): string => {
  const match = text.match(/\](.*)/);
  if (match) {
    return match[1];
  }

  return '';
};

const romanizeLyricsKo = (untranslatedLyricsArray: string[]): string[] => {
  return untranslatedLyricsArray.map(line => kroman.parse(line));
};

const getTranslatedLyrics = async (lyricsString: string): Promise<{ translatedLyrics: string[], romanizedLyrics?: string[] }> => {
  let splitLyrics = lyricsString.split('\n');
  splitLyrics = splitLyrics.map(lyric => extractLine(lyric));
  const stringToTranslate = splitLyrics.join('\n---');
  const {text, from} = await translate(stringToTranslate, { to: 'en', autoCorrect: false });
  if (from.language.iso === 'ko') {
    return { translatedLyrics: text.split('\n---'), romanizedLyrics: romanizeLyricsKo(splitLyrics) };
  }
  return { translatedLyrics: text.split('\n---') };
};

export const getOriginalAndTranslatedLyrics = async (lyricsString: string): Promise<TranslatedSyncedLyrics[]> => {
  const parsed = lyricsString.split('\n');
  const translatedLyrics = await getTranslatedLyrics(lyricsString);

  const to_return = [];
  for (let i = 0; i < parsed.length; i++) {
    to_return[i] = {
      id: i, 
      time: extractTime(parsed[i]),
      original: extractLine(parsed[i]), 
      translated: translatedLyrics.translatedLyrics[i],
      romanized: translatedLyrics.romanizedLyrics ? translatedLyrics.romanizedLyrics[i] : undefined
    };
  }

  return to_return;
};