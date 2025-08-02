import PfpDropdown from "./PFPDropdown.tsx";
import type { SpotifyProfile } from "../types";
import { useSpotifyUser } from "../contexts/SpotifyUserContext.tsx";

interface Props {
    loginSpotify: () => void;
    logoutSpotify: () => void;
    loggedIn: boolean;
    user: SpotifyProfile | undefined;
}

const Navbar = ({ logoutSpotify, loggedIn, user }: Props) => {
    const spotifyUserContext = useSpotifyUser();
    if (!spotifyUserContext.user) {
        return <div>no user found.</div>;
    }

    return (
        <div className='
            flex flex-row items-center justify-between navbar-bg h-[4.5rem] px-4 z-[999]
            lg:px-12'
        >
            <div className='
                work-sans text-[1.75rem] text-black tracking-tight '
            > LyricsLive </div>
            {
                spotifyUserContext.user
                    ? <div className='
                        h-full flex flex-row items-center  text-[1rem] z-[999]
                        lg:gap-4 '
                    >
                        <div className='hidden lg:block'>{spotifyUserContext.user.display_name}</div>
                        <PfpDropdown pfpUrl={`${spotifyUserContext.user.images[0].url ? spotifyUserContext.user.images[0].url : 'none'}`} logoutSpotify={logoutSpotify} />
                        {/* <button onClick={logoutSpotify}>logout</button> */}
                    </div>
                    : <div></div>
            }

        </div>
    )
}

export default Navbar;
