import languageIcon from '../assets/language-icon.png';
import spotifyIcon from '../assets/spotify-logo-black.png';
import realTimeIcon from '../assets/real-time-icon.png';

const FeatureList = () => {
    return (
        <div className='
            flex justify-between items-start w-4/5 flex-col mt-5 gap-4
            lg:flex-row lg:items-center lg:w-3/5'
        >
            <div className='
                flex items-center text-lg gap-2 h-[5rem]
                lg:h-[8rem] lg:text-2xl'><img className='h-[5rem] lg:h-[7rem]' src={languageIcon}/>Real-time translation</div>
            <div className='
                flex items-center text-lg gap-2 h-[5rem] 
                lg:h-[8rem] lg:text-2xl'
            ><img className='h-[5rem] lg:h-[5.5rem]' src={spotifyIcon}/>Spotify integration</div>
            <div className='
                flex items-center text-lg gap-2 h-[5rem] 
                g:h-[8rem] lg:text-2xl'
            ><img className='h-[5rem] lg:h-[5.5rem]' src={realTimeIcon}/>Multiple language support</div>
        </div>  
    );
};

export default FeatureList;