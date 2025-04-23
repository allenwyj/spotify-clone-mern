import { usePlayerStore } from '@/stores/usePlayerStore';
import { useEffect, useRef } from 'react';

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { currentSong, isPlaying, playNext } = usePlayerStore();

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      playNext();
    };

    audio?.addEventListener('ended', handleEnded);

    return () => {
      audio?.removeEventListener('ended', handleEnded);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle song changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;

    // check if this is actually a new song
    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
    if (isSongChange) {
      audio.src = currentSong?.audioUrl;

      // reset the playback position
      audio.currentTime = 0;

      // update the previous song reference
      prevSongRef.current = currentSong?.audioUrl;

      // if prev song was playing, play the new song
      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);

  return <audio ref={audioRef} />;
};
export default AudioPlayer;
