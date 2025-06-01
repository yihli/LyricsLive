import spotifyLogo from '../assets/spotify-logo.png';

interface Props {
    loginSpotify: () => void;
}

const MainBodyCard = ({ loginSpotify }: Props) => {
    return (
        <div className='rounded-xl flex flex-col items-center justify-center bg-gray-200 w-3/5 mt-[4rem] py-7 gap-8'>
            {/* translated lyrics, live text */}
            <div className='tracking-tight work-sans text-[2.25rem] text-blue-600'>Translated <span className='tracking-tight text-gray-700 work-sans text-[2.25rem]'>Lyrics, Live</span></div>
            {/* description text */}
            <div className='w-[24rem] text-center'>Log in with Spotify to see your favorite non-English songs translated in real time</div>
           {/* spotify login button */}
           <div onClick={loginSpotify} className='h-[3rem] w-[10rem] bg-black flex flex-row justify-center items-center gap-2 rounded-2xl'>
                <img className='h-3/5' src={spotifyLogo}/>
                <div className='text-white'>Spotify login</div>
            </div>
        </div>
    );
};

export default MainBodyCard;