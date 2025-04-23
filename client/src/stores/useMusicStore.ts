import { axiosInstance } from '@/lib/axios';
import { Album, Song, Stats } from '@/types';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

interface MusicStore {
  albums: Album[];
  songs: Song[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (albumId: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (songId: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  fetchAlbums: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/albums');
      set({ albums: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (albumId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get(`/albums/${albumId}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/songs/featured');
      set({ featuredSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYouSongs: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/songs/made-for-you');
      set({ madeForYouSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/songs/trending');
      set({ trendingSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/songs');
      set({ songs: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/stats');
      set({ stats: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSong: async (songId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${songId}`);
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== songId),
      }));
      toast.success('Song deleted successfully');
    } catch (error: any) {
      console.log('error', error);
      toast.error('Failed to delete song');
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (albumId: string) => {
    set({ isLoading: true, error: null });
    console.log('state.songs', get().songs);
    try {
      await axiosInstance.delete(`/admin/albums/${albumId}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== albumId),
        songs: state.songs.map((song) =>
          song.albumId === albumId ? { ...song, album: null } : song
        ),
      }));
      toast.success('Album deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete album ' + error.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
