import type { Artist } from "~/types/artist";

export const useIdYoutubeVideo = () =>
  useState<string>('idYoutubeVideo', () => 'vi36cbHrB9w')
export const useMusicNamePlaying = () =>
  useState<string>('musicNamePlaying', () => 'Music Name')
export const useAuthorNamePlaying = () =>
  useState<string>('authorNamePlaying', () => 'Author Name')
export const useIsPlayingVideo = () => useState<boolean>('isPlayingVideo', () => false)
export const useIsLogin = () => useState<boolean>('isLogin', () => false);
export const useIsAdmin = () => useState<boolean>('isAdmin', () => false);
export const useArtistList = () => useState<Artist[]>('artistList', () => []);