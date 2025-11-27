import React, { useEffect, useState } from 'react';
import { fetchGameHistory, clearGameHistory } from '../services/api';
import { GameResult, Difficulty } from '../types';
import { ArrowLeftIcon, TrashIcon, UserIcon, BrainIcon } from './Icons';

interface ScoreHistoryProps {
  onBack: () => void;
}

export const ScoreHistory: React.FC<ScoreHistoryProps> = ({ onBack }) => {
  const [history, setHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    fetchGameHistory().then(setHistory);
  }, []);

  const handleClear = async () => {
    if (confirm('Are you sure you want to clear your game history?')) {
      await clearGameHistory();
      setHistory([]);
    }
  };

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ts));
  };

  const getDifficultyLabel = (d?: Difficulty) => {
    switch (d) {
      case Difficulty.EASY: return 'Easy';
      case Difficulty.MEDIUM: return 'Medium';
      case Difficulty.HARD: return 'Hard';
      default: return '-';
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg animate-in slide-in-from-right-8 fade-in duration-500 h-full max-h-[90vh]">
      <div className="w-full flex justify-between px-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back
        </button>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
          >
            <TrashIcon className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      <h2 className="text-3xl font-bold text-white mb-6">Game History</h2>

      <div className="w-full flex-1 overflow-y-auto px-4 pb-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {history.length === 0 ? (
          <div className="text-center text-slate-500 py-12 bg-slate-900/50 rounded-xl border border-slate-800">
            No games played yet.
          </div>
        ) : (
          history.map((game) => (
            <div
              key={game.id}
              className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center justify-between hover:bg-slate-800 transition-colors"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  {game.mode === 'PvAI' ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      <BrainIcon className="w-3 h-3" /> AI ({getDifficultyLabel(game.difficulty)})
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                      <UserIcon className="w-3 h-3" /> PvP
                    </div>
                  )}
                  <span className="text-xs text-slate-500">{formatDate(game.timestamp)}</span>
                </div>
                <div className="font-semibold text-slate-200">
                  Result: <span className={
                    game.winner === 'Player 1' ? 'text-blue-400' :
                      game.winner === 'Player 2' ? 'text-red-400' :
                        game.winner === 'AI' ? 'text-red-400' : 'text-slate-400'
                  }>{game.winner}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};