import { Song } from '@/types';
import { create } from 'zustand';
import { useChatStore } from './useChatStore';

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;

  // actions
  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },
  // use to play songs from the first or the picked song from a list of songs
  playAlbum: (songs: Song[], startIndex: number = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];
    const socket = useChatStore.getState().socket;

    if (socket.auth) {
      socket.emit('update_activity', {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },
  // use to play a song from the home page / playing a single song
  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const songIndex = get().queue.findIndex((s) => s._id === song._id);

    const socket = useChatStore.getState().socket;

    if (socket.auth) {
      socket.emit('update_activity', {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    // TODO: may have bug, since queue is not updated
    set({
      currentSong: song,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
      isPlaying: true,
    });
  },
  togglePlay: () => {
    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket;

    if (socket.auth) {
      socket.emit('update_activity', {
        userId: socket.auth.userId,
        activity: `Playing ${currentSong?.title} by ${currentSong?.artist}`,
      });
    }
    set({
      isPlaying: !get().isPlaying,
    });
  },
  playNext: () => {
    const { currentIndex, queue } = get();
    const nextIndex = currentIndex + 1;
    const socket = useChatStore.getState().socket;

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];

      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
        });
      }
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity: 'Idle',
        });
      }
      set({ isPlaying: false });
    }
  },
  playPrevious: () => {
    const { currentIndex, queue } = get();
    const previousIndex = currentIndex - 1;
    const socket = useChatStore.getState().socket;

    if (previousIndex >= 0) {
      const previousSong = queue[previousIndex];

      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity: `Playing ${previousSong.title} by ${previousSong.artist}`,
        });
      }
      set({
        currentSong: previousSong,
        currentIndex: previousIndex,
        isPlaying: true,
      });
    } else {
      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity: 'Idle',
        });
      }
      set({ isPlaying: false });
    }
  },
}));
