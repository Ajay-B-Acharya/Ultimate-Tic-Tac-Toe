import React from 'react';
import { UserIcon, BrainIcon, HistoryIcon, SettingsIcon } from './Icons';

interface LandingProps {
  onSelectMode: (mode: 'PvP' | 'PvAI') => void;
  onViewHistory: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onSelectMode, onViewHistory }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg animate-in fade-in duration-700 slide-in-from-bottom-4 relative">
      <div className="absolute top-0 right-0 p-4">
        <button className="text-slate-500 hover:text-slate-300 transition-colors" title="Settings (Coming Soon)">
            <SettingsIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="text-center mb-10 mt-8">
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-br from-blue-400 via-indigo-400 to-red-400 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-lg">
          ULTIMATE
          <br />
          TIC TAC TOE
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xs mx-auto">
          A strategic twist on the classic game.
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full px-8">
        <button
          onClick={() => onSelectMode('PvAI')}
          className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 p-[1px] rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]"
        >
          <div className="relative bg-slate-900 rounded-[11px] p-6 flex items-center justify-between group-hover:bg-slate-900/90 transition-colors">
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold text-white flex items-center gap-2">
                <BrainIcon className="w-6 h-6 text-blue-400" />
                Play vs AI
              </span>
              <span className="text-sm text-slate-400 mt-1">Challenge the computer</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <BrainIcon className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelectMode('PvP')}
          className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 p-[1px] rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
        >
          <div className="relative bg-slate-900 rounded-[11px] p-6 flex items-center justify-between group-hover:bg-slate-900/90 transition-colors">
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold text-white flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-red-400" />
                2 Player
              </span>
              <span className="text-sm text-slate-400 mt-1">Local multiplayer</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <UserIcon className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </button>

        <button
          onClick={onViewHistory}
          className="mt-2 py-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-700 transition-all text-slate-300 font-bold flex items-center justify-center gap-2 hover:text-white"
        >
          <HistoryIcon className="w-5 h-5" />
          View History
        </button>
      </div>

      <div className="mt-12 text-slate-600 text-sm">
        v1.1.0
      </div>
    </div>
  );
};