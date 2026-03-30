import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction, Difficulty } from '../types';
import { Trophy, RefreshCw, Play, Pause, Settings2 } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';

const DIFFICULTY_SETTINGS: Record<Difficulty, { speed: number; wrap: boolean; label: string }> = {
  EASY: { speed: 200, wrap: true, label: 'Easy' },
  MEDIUM: { speed: 120, wrap: false, label: 'Medium' },
  HARD: { speed: 70, wrap: false, label: 'Hard' },
};

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');

  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood(INITIAL_SNAKE);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      const settings = DIFFICULTY_SETTINGS[difficulty];

      // Handle wall collision or wrapping
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        if (settings.wrap) {
          if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
          else if (newHead.x >= GRID_SIZE) newHead.x = 0;
          if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
          else if (newHead.y >= GRID_SIZE) newHead.y = 0;
        } else {
          setIsGameOver(true);
          return prevSnake;
        }
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isGameOver && !isPaused) {
      const interval = setInterval(moveSnake, DIFFICULTY_SETTINGS[difficulty].speed);
      return () => clearInterval(interval);
    }
  }, [moveSnake, isGameOver, isPaused, difficulty]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] px-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-black border border-cyan-500 rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            <Trophy size={18} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" fill="currentColor" />
          </div>
          <div>
            <p className="text-[10px] text-cyan-700 uppercase font-bold tracking-widest">Score</p>
            <p className="text-4xl font-mono text-cyan-400 leading-none drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] glitch-text">{score}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <p className="text-[8px] text-cyan-700 uppercase font-bold tracking-widest mb-1">Difficulty</p>
            <div className="flex gap-1">
              {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-2 py-0.5 text-[8px] font-bold rounded border transition-all ${
                    difficulty === d
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] scale-105'
                      : 'bg-black/40 text-cyan-700 border-cyan-900 hover:border-cyan-700 hover:text-cyan-500'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-right">
          <div>
            <p className="text-[10px] text-cyan-700 uppercase font-bold tracking-widest">High Score</p>
            <p className="text-4xl font-mono text-cyan-400 leading-none drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] glitch-text">{highScore}</p>
          </div>
        </div>
      </div>

      <div className="relative group">
        {/* Neon Border Glow */}
        <div className="absolute -inset-1 bg-cyan-500/20 rounded-xl blur-lg group-hover:bg-cyan-500/30 transition-all duration-500" />
        
        <div 
          className="relative grid bg-black/80 border-2 border-cyan-500/50 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.3)]"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: '400px',
            height: '400px'
          }}
        >
          {/* Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-5">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-cyan-500" />
            ))}
          </div>

          {/* Snake */}
          {snake.map((segment, i) => (
            <div
              key={i}
              className={`absolute rounded-sm transition-all duration-150 ${
                i === 0 
                  ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-10' 
                  : 'bg-cyan-600/80'
              }`}
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(segment.x * 100) / GRID_SIZE}%`,
                top: `${(segment.y * 100) / GRID_SIZE}%`,
              }}
            />
          ))}

          {/* Food */}
          <div
            className="absolute bg-rose-500 rounded-full shadow-[0_0_15px_#f43f5e] animate-pulse"
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(food.x * 100) / GRID_SIZE}%`,
              top: `${(food.y * 100) / GRID_SIZE}%`,
            }}
          />

          {/* Overlays */}
          {(isGameOver || isPaused) && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="text-center space-y-4 p-8 rounded-2xl border border-cyan-500/30 bg-black/40">
                {isGameOver ? (
                  <>
                    <h2 className="text-3xl font-black text-rose-500 uppercase tracking-tighter italic">Game Over</h2>
                    <p className="text-cyan-400/70 font-mono text-sm">Final Score: {score}</p>
                    <button 
                      onClick={resetGame}
                      className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95"
                    >
                      <RefreshCw size={20} />
                      RETRY
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-black text-cyan-400 uppercase tracking-tighter italic">Paused</h2>
                    <p className="text-cyan-400/50 font-mono text-xs">Press Space to Resume</p>
                    <button 
                      onClick={() => setIsPaused(false)}
                      className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95"
                    >
                      <Play size={20} fill="black" />
                      RESUME
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 text-[10px] font-mono text-cyan-700 uppercase tracking-widest">
        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-cyan-950 rounded border border-cyan-900">Arrows</kbd> to Move</span>
        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-cyan-950 rounded border border-cyan-900">Space</kbd> to Pause</span>
      </div>
    </div>
  );
};
