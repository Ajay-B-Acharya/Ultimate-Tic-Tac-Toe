import React from 'react';
import { Difficulty } from '../types';
import { ArrowLeftIcon, BrainIcon } from './Icons';

interface DifficultySelectionProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
}

export const DifficultySelection: React.FC<DifficultySelectionProps> = ({ onSelectDifficulty, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg animate-in slide-in-from-right-8 fade-in duration-500">
      <div className="w-full flex justify-start px-4 mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <BrainIcon className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Select Difficulty</h2>
        <p className="text-slate-400">Choose your opponent level</p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full px-8">
        <button
          onClick={() => onSelectDifficulty(Difficulty.EASY)}
          className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-green-500/10 hover:border-green-500/50 transition-all group flex items-center justify-between"
        >
          <div className="text-left">
            <div className="font-bold text-green-400 text-lg">Easy</div>
            <div className="text-xs text-slate-500 group-hover:text-green-400/70">Random moves, casual play</div>
          </div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.0)] group-hover:shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all"></div>
        </button>

        <button
          onClick={() => onSelectDifficulty(Difficulty.MEDIUM)}
          className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-yellow-500/10 hover:border-yellow-500/50 transition-all group flex items-center justify-between"
        >
          <div className="text-left">
            <div className="font-bold text-yellow-400 text-lg">Medium</div>
            <div className="text-xs text-slate-500 group-hover:text-yellow-400/70">Balanced, looks 2 steps ahead</div>
          </div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.0)] group-hover:shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-all"></div>
        </button>

        <button
          onClick={() => onSelectDifficulty(Difficulty.HARD)}
          className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-red-500/10 hover:border-red-500/50 transition-all group flex items-center justify-between"
        >
          <div className="text-left">
            <div className="font-bold text-red-400 text-lg">Hard</div>
            <div className="text-xs text-slate-500 group-hover:text-red-400/70">Master, predicts outcomes</div>
          </div>
          <div className="w-3 h-3 rounded-full bg-red-500/20 group-hover:bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.0)] group-hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all"></div>
        </button>
      </div>
    </div>
  );
};
