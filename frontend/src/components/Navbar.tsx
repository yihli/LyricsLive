import type { SpotifyProfile } from "../types";

interface Props {
    loginSpotify: () => void;
    logoutSpotify: () => void;
    loggedIn: boolean;
    user: SpotifyProfile | undefined;
}

const Navbar = ({ loginSpotify, logoutSpotify, loggedIn, user }: Props) => {

    return (
        <div className='flex flex-row items-center justify-between px-12 h-[4.5rem] bg-blue-500 '>
            <div className='p-0 tracking-tight text-gray-300 work-sans text-[1.75rem]'>LyricsLive</div>
            {
                loggedIn && user
                    ? <div className='h-full flex flex-row gap-4 items-center text-gray-200 text-[1.25rem]'>
                        <div>Hello, {user.display_name}!</div>
                        <img className='h-[3rem] rounded-sm' src={user.images[0].url}></img>
                        <button onClick={logoutSpotify}>logout</button>
                    </div>
                    : <div></div>
            }
        </div>
    )
}

export default Navbar;
