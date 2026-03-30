import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2 } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Synth-01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/300/300'
  },
  {
    id: '2',
    title: 'Cyber Drift',
    artist: 'AI Synth-02',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/300/300'
  },
  {
    id: '3',
    title: 'Digital Rain',
    artist: 'AI Synth-03',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/300/300'
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.2)] w-full max-w-md">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-cyan-500/50 group">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay" />
        </div>
        <div className="flex-1">
          <h3 className="text-cyan-400 font-bold text-lg tracking-tight truncate">{currentTrack.title}</h3>
          <p className="text-cyan-600/70 text-sm font-medium uppercase tracking-widest">{currentTrack.artist}</p>
          <div className="flex items-center gap-2 mt-2 text-cyan-500/50">
            <Music size={14} />
            <span className="text-[10px] font-mono uppercase tracking-tighter">AI Generated Audio</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="relative h-1 bg-cyan-950 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={handlePrev}
            className="text-cyan-600 hover:text-cyan-400 transition-colors p-2"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center text-black hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] active:scale-95"
          >
            {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-cyan-600 hover:text-cyan-400 transition-colors p-2"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-cyan-700 uppercase tracking-widest pt-2 border-t border-cyan-900/30">
          <div className="flex items-center gap-1">
            <Volume2 size={12} />
            <span>Stereo</span>
          </div>
          <span>44.1kHz / 24-bit</span>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
};
