import React from 'react';
import { Player } from '../types';
import { XIcon, OIcon } from './Icons';
import { playHoverSound } from '../logic/sound';

interface CellProps {
  value: Player;
  onClick: () => void;
  disabled: boolean;
  isValidMove: boolean;
}

export const Cell: React.FC<CellProps> = ({ value, onClick, disabled, isValidMove }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => {
        if (isValidMove) {
          playHoverSound();
        }
      }}
      className={`
        w-full h-full aspect-square flex items-center justify-center rounded-sm transition-all duration-200
        ${value === Player.EMPTY ? 'hover:bg-slate-700/50' : ''}
        ${isValidMove && value === Player.EMPTY ? 'bg-slate-700/30 shadow-[inset_0_0_8px_rgba(56,189,248,0.1)]' : 'bg-slate-800/40'}
        ${disabled ? 'cursor-default' : 'cursor-pointer'}
      `}
    >
      <div className={`transition-all duration-300 transform ${value !== Player.EMPTY ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        {value === Player.X && <XIcon className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500" />}
        {value === Player.O && <OIcon className="w-4 h-4 sm:w-6 sm:h-6 text-red-500" />}
      </div>
    </button>
  );
};