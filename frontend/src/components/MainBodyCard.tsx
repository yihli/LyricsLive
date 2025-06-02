import spotifyLogo from '../assets/spotify-logo.png';

interface Props {
    loginSpotify: () => void;
}

const MainBodyCard = ({ loginSpotify }: Props) => {
    return (
        <div className='
        w-6/7 bg-gray-200 flex flex-col items-center justify-center rounded-xl 
        mt-[2rem] py-7 gap-5 
        lg:w-3/5 lg:mt-[4rem] lg:gap-8'
        >
            {/* translated lyrics, live text */}
            <div className='
                tracking-tight work-sans text-blue-600 text-[1.75rem]
                lg:text-[2.25rem]'
            >{`Translated `}
                <span className='
                    tracking-tight text-gray-700 work-sans 
                    lg:text-[2.25rem]'
                >Lyrics, Live</span>
            </div>
            {/* description text */}
            <div className='
                w-[18rem] text-center
                lg:w-[24rem]'
            >Log in with Spotify to see your favorite non-English songs translated in real time</div>
           {/* spotify login button */}
            <div onClick={loginSpotify} className='
                h-[3rem] w-[10rem] bg-black flex flex-row justify-center items-center gap-2 rounded-xl
                lg:rounded-2xl'
            >
                <img className='h-3/5' src={spotifyLogo}/>
                <div className='text-white'>Spotify login</div>
            </div>
        </div>
    );
};

export default MainBodyCard;