import languageIcon from '../assets/language-icon.png';
import spotifyIcon from '../assets/spotify-logo-black.png';
import realTimeIcon from '../assets/real-time-icon.png';

const FeatureList = () => {
    return (
        <div className='flex flex-row justify-between items-center w-3/5'>
            <div className='h-[8rem] flex items-center text-2xl gap-2'><img className='h-[7rem]' src={languageIcon}/>Real-time translation</div>
            <div className='h-[8rem] flex items-center text-2xl gap-2'><img className='h-[5.5rem]' src={spotifyIcon}/>Spotify integration</div>
            <div className='h-[8rem] flex items-center text-2xl gap-2'><img className='h-[5.5rem]' src={realTimeIcon}/>Multiple language support</div>
        </div>  
    );
};

export default FeatureList;