import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Music, Gamepad2, Zap, Radio } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-cyan-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-cyan-900/30 bg-black/40 backdrop-blur-md px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-10 h-10 bg-black border border-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] group-hover:rotate-12 transition-all duration-300">
            <Zap size={24} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter italic leading-none text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Neon Snake</h1>
            <p className="text-[10px] text-cyan-600 uppercase font-bold tracking-[0.2em] mt-1 flex items-center gap-1">
              <Radio size={10} className="animate-pulse text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
              Live Broadcast / AI Synth
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono uppercase tracking-widest text-cyan-700">
          <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
            <Gamepad2 size={14} />
            Arcade
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
            <Music size={14} />
            Beats
          </a>
          <div className="h-4 w-[1px] bg-cyan-900/50" />
          <span className="text-cyan-500/50">v1.0.4-stable</span>
        </nav>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
        {/* Game Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center min-h-[600px] bg-cyan-950/5 rounded-3xl border border-cyan-500/10 p-8 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
          <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-500/30 rounded-full" />
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-500/30 rounded-full" />
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-cyan-500/30 rounded-full" />
          
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic text-cyan-400 mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">The Grid</h2>
            <p className="text-xs font-mono text-cyan-700 uppercase tracking-widest">Sector 7 / Neural Link Active</p>
          </div>

          <SnakeGame />
        </motion.section>

        {/* Sidebar Section */}
        <motion.aside 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-700">Now Playing</h3>
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-cyan-500/50 animate-[bounce_1s_infinite]" />
                <div className="w-1 h-3 bg-cyan-500/50 animate-[bounce_1.2s_infinite]" />
                <div className="w-1 h-3 bg-cyan-500/50 animate-[bounce_0.8s_infinite]" />
              </div>
            </div>
            <MusicPlayer />
          </div>

          {/* Stats/Info Card */}
          <div className="bg-cyan-950/20 border border-cyan-500/10 rounded-2xl p-6 space-y-4">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-cyan-700 border-b border-cyan-900/30 pb-2">System Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-cyan-500/70">Neural Link</span>
                <span className="text-xs font-mono text-cyan-400">STABLE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-cyan-500/70">Audio Buffer</span>
                <span className="text-xs font-mono text-cyan-400">OPTIMIZED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-cyan-500/70">Latency</span>
                <span className="text-xs font-mono text-cyan-400">12ms</span>
              </div>
            </div>
          </div>
        </motion.aside>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-900/30 bg-black/40 backdrop-blur-md px-8 py-6 text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-800">
          &copy; 2026 Neon Syndicate / AI Studio Build
        </p>
      </footer>
    </div>
  );
}
