import { z } from 'zod';

const SpotifyProfileSchema = z.object({
  country: z.string(),
  display_name: z.string(),
  email: z.string(),
  explicit_content: z.object({
    filter_enabled: z.boolean(),
    filter_locked: z.boolean(),
  }),
  external_urls: z.object({
    spotify: z.string(),
  }),
  followers: z.object({
    href: z.unknown(),
    total: z.number(),
  }),
  href: z.string(),
  id: z.string(),
  images: z.array(
    z.object({
      height: z.number(),
      url: z.string(),
      width: z.number(),
    })
  ),
  product: z.string(),
  type: z.string(),
  uri: z.string(),
});

export type SpotifyProfile = z.infer<typeof SpotifyProfileSchema>;

// export interface SpotifyProfile {
//   country: string;
//   display_name: string;
//   email: string;
//   explicit_content: {
//     filter_enabled: boolean;
//     filter_locked: boolean;
//   };
//   external_urls: {
//     spotify: string;
//   };
//   followers: {
//     href: unknown;
//     total: number;
//   };
//   href: string;
//   id: string;
//   images: Array<{
//     height: number;
//     url: string;
//     width: number;
//   }>;
//   product: string;
//   type: string;
//   uri: string;
// }

export interface SyncedLyrics {
  id: number;
  time: number;
  original: string;
}

export interface TranslatedSyncedLyrics extends SyncedLyrics {
  translated: string;
  romanized?: string;
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

