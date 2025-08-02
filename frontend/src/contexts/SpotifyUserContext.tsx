import { createContext, useState, useContext } from 'react';
import type { SpotifyProfile } from '../types';
import usersService from '../services/usersService';

export const SpotifyUserContext = createContext<{
    user: SpotifyProfile | null,
    setUser: (u: SpotifyProfile | null) => void,
    login: () => Promise<void>,
    logout: () => Promise<void>
} | null>(null);

export const useSpotifyUser = () => {
    const ctx = useContext(SpotifyUserContext);
    if (!ctx) {
        throw new Error('error with spotify user context');
    }
    return ctx;
}

export const SpotifyUserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<SpotifyProfile | null>(null);

    const login = async () => {
        await usersService.login();
    };

    const logout = async () => {
        await usersService.logout();
        setUser(null);
    };

    return (
        <SpotifyUserContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </SpotifyUserContext.Provider>
    )
}

