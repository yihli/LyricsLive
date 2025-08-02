import { createContext } from 'react';
import type { SpotifyProfile } from '../types';

export const UserContext = createContext<{
    user: SpotifyProfile | null,
    setUser: (u: SpotifyProfile | null) => void
}>({ user: null, setUser: () => {} });