import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import usersService from './services/usersService';
import lyricsService from './services/lyricsService';

import type { SpotifyProfile, CurrentSpotifySong } from './types';

import LyricsDisplay from './components/LyricsDisplay';
import SongDisplay from './components/SongDisplay';
import Navbar from './components/Navbar';
import MainBodyCard from './components/MainBodyCard';
import FeatureList from './components/FeatureList';
import Signature from './components/Signature';

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

  const loginSpotify = async () => {
    await usersService.login();
  }

  const logoutSpotify = async () => {
    await usersService.logout();
    setUser(null);
    setLoggedIn(false);
  }

  return (
    <div className='h-screen w-screen bg-blue-200 open-sans'>
      <Navbar logoutSpotify={logoutSpotify} loginSpotify={loginSpotify} loggedIn={loggedIn} user={user ? user : undefined}/> 
      {user
        ?  <div className='h-[calc(100vh-4.5rem)] flex flex-col md:flex-row md:gap-12 p-12 md:items-center'>
              <SongDisplay currentlyPlaying={currentlyPlaying} progressTime={progressTime} />
              <LyricsDisplay lyrics={currentSong?.lyrics} currentTimestamp={progressTime} />
            </div> 
        
        : <div className='flex flex-col justify-center items-center gap-10'>
            <MainBodyCard loginSpotify={loginSpotify}/>
            <FeatureList />
          </div>
      }
      <Signature />
    </div>
  );
}

export default App;
