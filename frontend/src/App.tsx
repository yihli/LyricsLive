import './styles.css'
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import usersService from './services/usersService';
import prettyMs from 'pretty-ms';
import lyricsService from './services/lyricsService';

import type { SpotifyProfile, CurrentSpotifySong } from './types';

import LyricsDisplay from './components/LyricsDisplay';
import SongDisplay from './components/SongDisplay';

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<SpotifyProfile | null>(null);
  const [progressTime, setProgressTime] = useState<number>(0);
  const [currentSong, setCurrentSong] = useState<CurrentSpotifySong | null>(null);

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
            <SongDisplay currentlyPlaying={currentlyPlaying} progressTime={progressTime} />
            <LyricsDisplay lyrics={currentSong?.lyrics} currentTimestamp={progressTime} />
          </div>
        </div>
        : <button type="submit" onClick={loginSpotify}>login with spotify</button>
      }

    </div>
  );
}

export default App;
