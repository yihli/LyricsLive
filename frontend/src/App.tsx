import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import usersService from './services/usersService';
import prettyMs from 'pretty-ms';
import lyricsService from './services/lyricsService';

interface SpotifyProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: unknown;
    total: number;
  };
  href: string;
  id: string;
  images: Array<{
    height: number;
    url: string;
    width: number;
  }>;
  product: string;
  type: string;
  uri: string;
}

interface SyncedLyrics {
  id: number;
  time: number;
  original: string;
}

interface TranslatedSyncedLyrics extends SyncedLyrics {
  translated: string;
}

interface CurrentSpotifySong {
  timestamp: number;
  context: {
    external_urls: {
      spotify: string;
    },
    href: string;
    type: string;
    uri: string;
  },
  progress_ms: number;
  item: {
    album: {
      album_type: string;
      artists: Array<{
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }>,
      available_markets: string[],
      external_urls: Array<{
        spotify: string;
      }>,
      href: string;
      id: string;
      images: Array<{
        height: number;
        url: string;
        width: string;
      }>,
      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
    },
    artists: Array<{
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }>,
    available_markets: string[],
    disc_number: number;
    duration_ms: 195520,
    explicit: boolean;
    external_ids: { isrc: string; };
    external_urls: {
      spotify: string;
    },
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
  },
  currently_playing_type: string;
  actions: {
    disallows: {
      resuming: boolean;
    }
  };
  is_playing: boolean;
  lyrics: Array<TranslatedSyncedLyrics>
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

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<SpotifyProfile | null>(null);
  const [progressTime, setProgressTime] = useState<number>(0);
  const [currentSong, setCurrentSong] = useState<CurrentSpotifySong | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);

  const currentlyPlaying = useQuery({
    queryKey: ['currently-playing'],
    queryFn: async () => {
      if (loggedIn) {
        const timeOfRequest = Date.now()
        const data = await usersService.getCurrentlyPlaying();
        if (currentSong === null || data.item.id !== currentSong.item.id) {
          try {
            const { translatedLyrics } = await lyricsService.getLyrics(data.item.name, data.item.artists[0].name);
            setCurrentSong({ ...data, lyrics: translatedLyrics });
          } catch (e) {
            setCurrentSong(null);
          }
        }
        const timeReturned = Date.now();
        const elapsed = timeReturned - timeOfRequest;
        setProgressTime(data.progress_ms + elapsed);
        return data;
      }
    },
    refetchInterval: 1000 * 5,
  });

  useEffect(() => {
    currentlyPlaying.refetch();
  }, [loggedIn]);

  useEffect(() => {
    if (progressTime) {
      const interval = setInterval(() => {
        setProgressTime(progressTime + 250);
        if (currentSong) {
          setCurrentLineIndex(getLyricsIndex(currentSong.lyrics, progressTime))
        }
      }, 250);

      return () => clearInterval(interval); // cleanup
    }
  }, [progressTime]);

  useEffect(() => {
    const fun = async () => {
      if (!loggedIn) {
        const isLoggedIn = await usersService.isLoggedIn();
        setLoggedIn(isLoggedIn);
      } else {
        const profile = await usersService.getUserProfile();
        setUser(profile);
      }
    }
    fun();
  }, [loggedIn]);

  const loginSpotify = () => {
    window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=f0bcfe3d707f4dcbb65099dd8eb719bc&scope=user-read-private%20user-read-email%20user-read-currently-playing&redirect_uri=http://localhost:3000/callback`;
  }

  const logoutSpotify = async () => {
    await usersService.logout();
    setUser(null);
    setLoggedIn(false);
  }

  let playing = <div></div>;
  if (currentlyPlaying.isLoading) {
    playing = <div>loading...</div>
  } else if (currentlyPlaying.error) {
    playing = <div>no song is detected.</div>
  } else if (currentlyPlaying.data) {
    if (!currentlyPlaying.data.isPlaying) {
      playing = <div> no song is playing. </div>
    } else {
      playing = <div>
        current playing: {currentlyPlaying.data.item.name} by {currentlyPlaying.data.item.album.artists[0].name}
        <div>time: {prettyMs(progressTime, { colonNotation: true, secondsDecimalDigits: 0 })}/{prettyMs(currentlyPlaying.data.item.duration_ms, { colonNotation: true, secondsDecimalDigits: 0 })}</div>
      </div>
    }
  }

  return (
    <div>
      {user
        ? <div>
          welcome {user.display_name} <button type='button' onClick={logoutSpotify}>logout</button>
          <div>
            {
              playing
            }
            {currentSong
              ? currentSong?.lyrics.map(line => {
                if (line.id === currentLineIndex) {
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

              : <div>no lyrics found for this song</div>

            }
          </div>
        </div>
        : <button type="submit" onClick={loginSpotify}>login with spotify</button>
      }

    </div>
  );
}

export default App;
