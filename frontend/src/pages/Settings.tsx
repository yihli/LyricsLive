import Navbar from "../components/Navbar";
import { useSpotifyUser } from "../contexts/SpotifyUserContext";

const accountSettingsFields = [
    {
        name: 'username',
        value: '',
        changeFn: () => { }
    },
    {
        name: 'email',
        value: '',
        changeFn: () => { }
    },
    {
        name: 'password',
        value: '',
        changeFn: () => { }
    },
        { 
        name: 'discord id',
        value: '',
        changeFn: () => {}
    },

]

const Settings = () => {
    const spotifyUserContext = useSpotifyUser();
    return (
        <div>
            <Navbar />
            <div className='
              h-[calc(100vh-4.5rem)] flex flex-col bg-gray-500'
            >
                <div className='header w-screen h-[9rem] bg-gray-400 flex justify-center items-center text-[2rem]'>{spotifyUserContext.user?.display_name}'s account</div>
                <div className='accountfieldsholder w-full'>
                    {accountSettingsFields.map(field => 
                        <div key={field.name} 
                        className='w-full h-[4rem] flex items-center'>hello</div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default Settings;