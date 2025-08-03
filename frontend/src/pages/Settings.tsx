import Navbar from "../components/Navbar";
import { useSpotifyUser } from "../contexts/SpotifyUserContext";

import usernameLogo from '../assets/username-logo.png';
import passwordLogo from '../assets/password-logo.png';
import discordLogo from '../assets/discord-icon.png';
import emailLogo from '../assets/email-logo.png';
import { useState } from "react";

const Settings = () => {
    const currentSetting = useState<string>('all')
    const spotifyUserContext = useSpotifyUser();

    const accountSettingsFields = [
        {
            name: 'username',
            value: 'placeholder',
            icon: usernameLogo,
            changeFn: () => { }
        },
        {
            name: 'email',
            value: 'placeholder',
            icon: emailLogo,
            changeFn: () => { }
        },
        {
            name: 'password',
            value: '********',
            icon: passwordLogo,
            changeFn: () => { }
        },
        {
            name: 'discord id',
            value: 'placeholder',
            icon: discordLogo,
            changeFn: () => { }
        },

    ];

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
                            className='w-full h-[5.5rem] flex items-center p-4'>
                            <img className='fieldicon h-full ml-5' src={field.icon}></img>
                            <div className='fieldnamevalueholder ml-5'>
                                <div className='name flex items-center'>{field.name}</div>
                                <div className='value items-center text-[0.85rem]'>{field.value}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default Settings;