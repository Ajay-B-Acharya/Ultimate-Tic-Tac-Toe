import React from 'react';
import { Difficulty } from '../types';
import { ArrowLeftIcon, BrainIcon } from './Icons';
import { Card } from './ui/card';
import { Spotlight } from './ui/spotlight';
import { SplineScene } from './ui/splite';

interface DifficultySelectionProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
}

export const DifficultySelection: React.FC<DifficultySelectionProps> = ({ onSelectDifficulty, onBack }) => {
  return (
    <div className="w-full max-w-5xl px-4 animate-in slide-in-from-right-8 fade-in duration-500">
      <Card className="w-full min-h-[580px] bg-slate-900/90 border-slate-800 relative overflow-hidden rounded-2xl shadow-2xl backdrop-blur-md">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="rgb(99, 102, 241)"
        />
        
        {/* Back Button (Absolutely positioned at top-left) */}
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium z-20"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 h-full min-h-[580px] items-center">
          {/* Left Column (Col 1-2): Spacer for desktop to center the middle content */}
          <div className="hidden md:block md:col-span-2"></div>

          {/* Middle Column (Col 3-8): Centered Difficulty Selection */}
          <div className="col-span-1 md:col-span-6 p-6 md:p-10 relative z-10 flex flex-col justify-center items-center text-center">
            {/* Header */}
            <div className="text-center mb-8 mt-12 md:mt-0">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <BrainIcon className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Select Difficulty</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Choose your opponent level. The Hard AI is highly strategic and predicts your moves!
              </p>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 gap-3 w-full max-w-md">
              <button
                onClick={() => onSelectDifficulty(Difficulty.EASY)}
                className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl hover:bg-green-500/10 hover:border-green-500/50 transition-all group flex items-center justify-between text-left"
              >
                <div>
                  <div className="font-bold text-green-400 text-base">Easy</div>
                  <div className="text-xs text-slate-500 group-hover:text-green-400/70">Random moves, casual play</div>
                </div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.0)] group-hover:shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all"></div>
              </button>

              <button
                onClick={() => onSelectDifficulty(Difficulty.MEDIUM)}
                className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl hover:bg-yellow-500/10 hover:border-yellow-500/50 transition-all group flex items-center justify-between text-left"
              >
                <div>
                  <div className="font-bold text-yellow-400 text-base">Medium</div>
                  <div className="text-xs text-slate-500 group-hover:text-yellow-400/70">Balanced, blocks wins and wins local boards</div>
                </div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.0)] group-hover:shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-all"></div>
              </button>

              <button
                onClick={() => onSelectDifficulty(Difficulty.HARD)}
                className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl hover:bg-red-500/10 hover:border-red-500/50 transition-all group flex items-center justify-between text-left"
              >
                <div>
                  <div className="font-bold text-red-400 text-base">Hard</div>
                  <div className="text-xs text-slate-500 group-hover:text-red-400/70">Strategic Master, looks ahead and controls board movement</div>
                </div>
                <div className="w-3 h-3 rounded-full bg-red-500/20 group-hover:bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.0)] group-hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all"></div>
              </button>
            </div>
          </div>

          {/* Right Column (Col 9-12): Transparent robot floating on the right side */}
          <div className="col-span-1 md:col-span-4 h-[350px] md:h-full w-full relative z-10 flex items-center justify-center">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
