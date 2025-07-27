import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import usersService from './services/usersService';
import lyricsService from './services/lyricsService';

import type { SpotifyProfile, CurrentSpotifySong } from './types';

import LyricsDisplay from './components/LyricsDisplay';
import SongDisplay from './components/SongDisplay';
import Navbar from './components/Navbar';
import Signature from './components/Signature';
import AccountForm from './components/AccountForm';


const App = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<SpotifyProfile | null>(null);
  const [progressTime, setProgressTime] = useState<number>(0);
  const [currentSong, setCurrentSong] = useState<CurrentSpotifySong | null>(null);

  const currentlyPlaying = useQuery({
    queryKey: ['currently-playing'],
    queryFn: async () => {
      if (loggedIn) {
        const timeOfRequest = Date.now();
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
    const window_ref = (window as any);
    if (window_ref.VANTA && window_ref.VANTA.BIRDS) {
      window_ref.VANTA.BIRDS({
        el: "#landing-main",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: 0xf5f3ef,
        color1: 0x0,
        color2: 0xff08,
        colorMode: "lerpGradient",
        wingSpan: 12.00,
        speedLimit: 1.00,
        separation: 58.00,
        cohesion: 32.00,
        quantity: 4.00
      });
    }
  }, []);

  // on first login, fetch immediately
  useEffect(() => {
    currentlyPlaying.refetch();
  }, [loggedIn]);

  // update progress time
  useEffect(() => {
    if (progressTime) {
      const interval = setInterval(() => {
        setProgressTime(progressTime + 250);
      }, 250);

      return () => clearInterval(interval); // cleanup
    }
  }, [progressTime]);

  // see if user logged in before
  useEffect(() => {
    const fun = async () => {
      try {
        if (!loggedIn) {
          const isLoggedIn: boolean = await usersService.isLoggedIn();
          setLoggedIn(isLoggedIn);
        } else {
          const profile: SpotifyProfile = await usersService.getUserProfile();
          console.log(profile);
          setUser(profile);
        }
      }
      catch (e) {
        // temp solution: log user out on error
        console.log('ran into an error:', e);
        setLoggedIn(false);
        setUser(null);
      }
    };
    fun();
  }, [loggedIn]);

  const loginSpotify = async () => {
    await usersService.login();
  };

  const logoutSpotify = async () => {
    await usersService.logout();
    setUser(null);
    setLoggedIn(false);
  };

  return (
    <div className='h-screen w-screen site-bg work-sans' id='landing-main'>
      <Navbar logoutSpotify={logoutSpotify} loginSpotify={loginSpotify} loggedIn={loggedIn} user={user ? user : undefined} />
      {user
        ? <div className='
              h-[calc(100vh-4.5rem)] flex flex-col 
              lg:flex-row lg:items-center'
        >
          <SongDisplay currentlyPlaying={currentlyPlaying} progressTime={progressTime} />
          <LyricsDisplay lyrics={currentSong?.lyrics} currentTimestamp={progressTime} />
        </div>

        : <div className='
          h-[calc(100vh-4.5rem)] 
          lg:flex lg:flex-col lg:justify-center lg:items-center lg:gap-10'>
          {/* <MainBodyCard loginSpotify={loginSpotify} />
          <FeatureList /> */}
          <AccountForm loginSpotify={loginSpotify} />
        </div>
      }
      <Signature />
    </div>
  );
}

export default App;
