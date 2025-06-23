import type { SpotifyProfile } from "../types";

interface Props {
    loginSpotify: () => void;
    logoutSpotify: () => void;
    loggedIn: boolean;
    user: SpotifyProfile | undefined;
}

const Navbar = ({ logoutSpotify, loggedIn, user }: Props) => {

    return (
        <div className='
            flex flex-row items-center justify-between navbar-bg h-[4.5rem] px-4
            lg:px-12'
        >
            <div className='
                work-sans text-[1.75rem] text-black tracking-tight '
            > LyricsLive </div>
            {
                loggedIn && user
                    ? <div className='
                        h-full flex flex-row items-center text-[1rem] gap-2
                        lg:gap-4 '
                    >
                        <div className='hidden lg:block'>{user.display_name}</div>
                        <img className='h-[2.5rem] rounded-4xl' src={`${user.images[0].url ? user.images[0].url : 'none'}`} alt='pfp'></img>
                        <button onClick={logoutSpotify}>logout</button>
                    </div>
                    : <div></div>
            }
        </div>
    )
}

export default Navbar;
