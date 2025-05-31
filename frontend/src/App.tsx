import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import usersService from './services/usersService';
import prettyMs from 'pretty-ms';
import lyricsService from './services/lyricsService';

const getLyricsIndex = (currentLyrics: Object[], currentTimestamp: number): number => {
  const length = currentLyrics.length;
  for (let i = 0; i < length - 1; i++) {
    if (currentLyrics[i].time <= currentTimestamp && currentTimestamp <= currentLyrics[i + 1].time) {
      return i;
    }
  }

  return -1;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [progressTime, setProgressTime] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const currentlyPlaying = useQuery({
    queryKey: ['currently-playing'],
    queryFn: async () => {
      if (loggedIn) {
        const timeOfRequest = Date.now()
        const data = await usersService.getCurrentlyPlaying();
        // Compute time elapsed since the data was fetched
        console.log('data from query:', data);

        if (currentSong === null || data.item.id !== currentSong.item.id) {
          const { translatedLyrics } = await lyricsService.getLyrics(data.item.name, data.item.artists[0].name);
          console.log(translatedLyrics);
          setCurrentSong({ ...data, lyrics: translatedLyrics });
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
        console.log('is logged in:', isLoggedIn)
        setLoggedIn(isLoggedIn);
      } else {
        const profile = await usersService.getUserProfile();
        console.log(profile);
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
    // console.log(currentlyPlaying.data)
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
            {
              currentSong?.lyrics.map(line => {
                if (line.id === currentLineIndex) {
                  return (
                    <div style={{ border:'1px solid black' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.25rem'  }}>{line.translated}</div>
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
        </div>
        : <button type="submit" onClick={loginSpotify}>login with spotify</button>
      }

    </div>
  );
}

export default App;
