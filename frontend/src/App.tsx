import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import usersService from './services/usersService';
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
        setProgressTime(data.progress_ms + (elapsed));
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
  return (
    <div className='h-screen w-screen bg-blue-200 open-sans'>
      <div className='flex flex-row items-center pl-12 h-[4.5rem] bg-blue-500 '>
        <div className='p-0 tracking-tight text-gray-300 work-sans text-[2.5rem]'>LyricsLive</div>
      </div>
      {user
        ?  <div className='h-[calc(100vh-4.5rem)] flex flex-col md:flex-row md:gap-12 p-12 md:items-center'>
              <SongDisplay currentlyPlaying={currentlyPlaying} progressTime={progressTime} />
              <LyricsDisplay lyrics={currentSong?.lyrics} currentTimestamp={progressTime} />
            </div> 
        
        : <button type="submit" onClick={loginSpotify}>login with spotify</button>
      }

    </div>
  );
}

export default App;
