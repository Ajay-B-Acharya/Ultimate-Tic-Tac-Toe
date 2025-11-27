import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, GameConfig, Move } from '../types';
import { MiniBoard } from './MiniBoard';
import { RefreshCwIcon, XIcon, OIcon, HomeIcon, HistoryIcon } from './Icons';
import { playMoveSound, playGameWinSound } from '../logic/sound';
import { fetchGameState, makeMove, getAIMove, resetGameAPI, saveGameResult } from '../services/api';

interface GameProps {
  config: GameConfig;
  onHome: () => void;
  onViewHistory: () => void;
}

interface GameState {
  boards: number[][];
  boardWinners: number[];
  currentPlayer: number;
  winner: number;
  nextMeta: number | null;
  isDraw: boolean;
  legalMoves: [number, number][];
}

export const Game: React.FC<GameProps> = ({ config, onHome, onViewHistory }) => {
  const [game, setGame] = useState<GameState | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [lastMove, setLastMove] = useState<Move | null>(null);

  // Ref to prevent saving the same game result multiple times if re-renders occur
  const hasSavedResult = useRef(false);

  // Initial fetch
  useEffect(() => {
    resetGameAPI().then(setGame);
  }, []);

  const resetGame = async () => {
    const newGame = await resetGameAPI();
    setGame(newGame);
    setLastMove(null);
    setIsAiThinking(false);
    hasSavedResult.current = false;
  };

  const handleCellClick = useCallback(async (boardIdx: number, cellIdx: number) => {
    if (!game || game.winner || game.isDraw) return;
    if (config.mode === 'PvAI' && game.currentPlayer === Player.O && isAiThinking) return;

    // Optimistic check (optional, but good for UI responsiveness)
    const isLegal = game.legalMoves.some(m => m[0] === boardIdx && m[1] === cellIdx);
    if (!isLegal) return;

    // Make move
    const newGameState = await makeMove(boardIdx, cellIdx);
    setGame(newGameState);
    setLastMove([boardIdx, cellIdx]);
    playMoveSound();

  }, [game, config.mode, isAiThinking]);

  // AI Effect
  useEffect(() => {
    if (!game) return;

    if (config.mode === 'PvAI' && game.currentPlayer === Player.O && !game.winner && !game.isDraw) {
      setIsAiThinking(true);

      const timer = setTimeout(async () => {
        const response = await getAIMove(config);
        if (response.move) {
          setGame(response.gameState);
          setLastMove(response.move);
          playMoveSound();
        }
        setIsAiThinking(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [game, config]);

  // Win/Draw Detection & Score Saving
  useEffect(() => {
    if (!game) return;

    if ((game.winner || game.isDraw) && !hasSavedResult.current) {
      if (game.winner) {
        playGameWinSound();
      }
      hasSavedResult.current = true;

      // Determine winner string
      let winnerName: 'Player 1' | 'Player 2' | 'AI' | 'Draw' = 'Draw';
      if (game.winner === Player.X) {
        winnerName = 'Player 1';
      } else if (game.winner === Player.O) {
        winnerName = config.mode === 'PvAI' ? 'AI' : 'Player 2';
      } else if (game.isDraw) {
        winnerName = 'Draw';
      }

      // We don't need to save explicitly here if the backend handles it, 
      // BUT the prompt said "POST /game/history: Save a new game result".
      // The backend doesn't auto-save on win in the game engine, so we do it here.
      saveGameResult({
        mode: config.mode,
        difficulty: config.mode === 'PvAI' ? config.difficulty : undefined,
        winner: winnerName
      });
    }
  }, [game?.winner, game?.isDraw, config]);

  if (!game) return <div className="text-white">Loading...</div>;

  const activeBoards = new Set<number>();
  if (!game.winner && !game.isDraw) {
    if (game.nextMeta === null) {
      game.boards.forEach((b, idx) => {
        // Check if board is full or won
        const isFull = b.every(c => c !== Player.EMPTY);
        const isWon = game.boardWinners[idx] !== Player.EMPTY;
        if (!isWon && !isFull) activeBoards.add(idx);
      });
    } else {
      const targetIdx = game.nextMeta;
      const targetBoard = game.boards[targetIdx];
      const isTargetFull = targetBoard.every(c => c !== Player.EMPTY);
      const isTargetWon = game.boardWinners[targetIdx] !== Player.EMPTY;

      if (!isTargetWon && !isTargetFull) {
        activeBoards.add(targetIdx);
      } else {
        game.boards.forEach((b, idx) => {
          const isFull = b.every(c => c !== Player.EMPTY);
          const isWon = game.boardWinners[idx] !== Player.EMPTY;
          if (!isWon && !isFull) activeBoards.add(idx);
        });
      }
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-lg animate-in fade-in duration-500">

      {/* Header */}
      <header className="w-full mb-6 flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent tracking-tight">
          Ultimate Tic Tac Toe
        </h1>

        {/* Status Bar */}
        <div className="flex items-center gap-6 bg-slate-900/80 p-3 rounded-full border border-slate-800 px-8 shadow-xl backdrop-blur-md">
          <div className={`flex items-center gap-2 ${game.currentPlayer === Player.X ? 'opacity-100 scale-105' : 'opacity-40 grayscale'} transition-all`}>
            <XIcon className="text-blue-500 w-6 h-6" />
            <span className="font-bold text-blue-100">Player 1</span>
          </div>

          <div className="h-6 w-[1px] bg-slate-700"></div>

          <div className={`flex items-center gap-2 ${game.currentPlayer === Player.O ? 'opacity-100 scale-105' : 'opacity-40 grayscale'} transition-all`}>
            <OIcon className="text-red-500 w-6 h-6" />
            <span className="font-bold text-red-100">
              {config.mode === 'PvAI' ? (isAiThinking ? 'AI Thinking...' : 'AI Bot') : 'Player 2'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Game Board */}
      <main className="w-[min(90vw,500px,60vh)] aspect-square relative mb-8">
        <div className="w-full h-full grid grid-cols-3 gap-2 md:gap-3 p-2 md:p-3 bg-slate-900/50 rounded-xl border border-slate-800 shadow-2xl">
          {game.boards.map((miniBoardCells, idx) => (
            <MiniBoard
              key={idx}
              cells={miniBoardCells}
              winner={game.boardWinners[idx]}
              boardIndex={idx}
              isActive={activeBoards.has(idx) && !game.winner && !game.isDraw}
              isValidTarget={game.nextMeta === idx}
              onCellClick={handleCellClick}
              lastMove={lastMove}
            />
          ))}
        </div>

        {/* Game Over Overlay */}
        {(game.winner || game.isDraw) && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-xl animate-in fade-in duration-500">
            <div className="text-5xl md:text-7xl font-bold mb-4 flex items-center gap-4 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
              {game.winner === Player.X && <span className="text-blue-500">Blue Wins!</span>}
              {game.winner === Player.O && <span className="text-red-500">Red Wins!</span>}
              {game.isDraw && <span className="text-slate-300">Game Draw!</span>}
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
              >
                <RefreshCwIcon className="w-5 h-5" /> Play Again
              </button>
              <button
                onClick={onViewHistory}
                className="px-6 py-3 bg-slate-800 text-white rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg border border-slate-700"
              >
                <HistoryIcon className="w-5 h-5" /> History
              </button>
              <button
                onClick={onHome}
                className="px-6 py-3 bg-slate-800 text-white rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg border border-slate-700"
              >
                <HomeIcon className="w-5 h-5" /> Home
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Controls */}
      <div className="flex gap-4 w-full px-4">
        <button
          onClick={resetGame}
          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCwIcon className="w-4 h-4" /> Restart
        </button>
        <button
          onClick={onHome}
          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <HomeIcon className="w-4 h-4" /> Quit to Home
        </button>
      </div>

    </div>
  );
};