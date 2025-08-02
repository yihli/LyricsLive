import { createContext } from 'react';
import type { SpotifyProfile } from '../types';

export const SpotifyUserContext = createContext<{
    user: SpotifyProfile | null,
    setUser: (u: SpotifyProfile | null) => void,

}>({ user: null, setUser: () => {} });