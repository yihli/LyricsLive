export interface SpotifyProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: unknown;
    total: number;
  };
  href: string;
  id: string;
  images: Array<{
    height: number;
    url: string;
    width: number;
  }>;
  product: string;
  type: string;
  uri: string;
}

export interface SyncedLyrics {
  id: number;
  time: number;
  original: string;
}

export interface TranslatedSyncedLyrics extends SyncedLyrics {
  translated: string;
}

export interface CurrentSpotifySong {
  timestamp: number;
  context: {
    external_urls: {
      spotify: string;
    },
    href: string;
    type: string;
    uri: string;
  },
  progress_ms: number;
  item: {
    album: {
      album_type: string;
      artists: Array<{
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }>,
      available_markets: string[],
      external_urls: Array<{
        spotify: string;
      }>,
      href: string;
      id: string;
      images: Array<{
        height: number;
        url: string;
        width: string;
      }>,
      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
    },
    artists: Array<{
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }>,
    available_markets: string[],
    disc_number: number;
    duration_ms: 195520,
    explicit: boolean;
    external_ids: { isrc: string; };
    external_urls: {
      spotify: string;
    },
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
  },
  currently_playing_type: string;
  actions: {
    disallows: {
      resuming: boolean;
    }
  };
  is_playing: boolean;
  lyrics: Array<TranslatedSyncedLyrics>
  isPlaying: boolean;
}

