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
            flex flex-row items-center justify-between bg-blue-500 h-[4.5rem] px-4
            lg:px-12'
        >
            <div className='
                work-sans text-[1.75rem] text-gray-300 tracking-tight '
            > LyricsLive </div>
            {
                loggedIn && user
                    ? <div className='
                        h-full flex flex-row items-center text-gray-200 text-[1.25rem] gap-2
                        lg:gap-4 '
                    >
                        <div>{user.display_name}</div>
                        <img className='h-[3rem] rounded-sm' src={user.images[0].url}></img>
                        <button onClick={logoutSpotify}>logout</button>
                    </div>
                    : <div></div>
            }
        </div>
    )
}

export default Navbar;
