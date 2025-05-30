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
}

export const parseLyrics = (lyricsString: string): Array<{time?: number, line?: string}> | null => {
  let parsed = lyricsString.split('\n');

  console.log('parse lyrics:', parsed);
  let i = -1;
  return parsed.map(line => { 
        i++;
        return { index: i, time: extractTime(line), line: extractLine(line) };
    });
};



