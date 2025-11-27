import React, { useEffect } from 'react';
import { Player } from '../types';
import { Cell } from './Cell';
import { XIcon, OIcon } from './Icons';
import { playMiniWinSound } from '../logic/sound';

interface MiniBoardProps {
    cells: number[];
    winner: number;
    boardIndex: number;
    isActive: boolean;
    isValidTarget: boolean;
    onCellClick: (boardIndex: number, cellIndex: number) => void;
    lastMove: [number, number] | null;
}

export const MiniBoard: React.FC<MiniBoardProps> = ({
    cells,
    winner,
    boardIndex,
    isActive,
    isValidTarget,
    onCellClick,
    lastMove
}) => {

    // Play sound when this board gets a winner
    useEffect(() => {
        if (winner) {
            playMiniWinSound();
        }
    }, [winner]);

    return (
        <div
            className={`
        relative p-1 gap-1 grid grid-cols-3 rounded-lg transition-all duration-300 border-2
        ${isActive && !winner ? 'border-yellow-500/80 shadow-[0_0_15px_rgba(234,179,8,0.3)] bg-yellow-500/5' : 'border-slate-700 bg-slate-800/20'}
        ${winner === Player.X ? 'border-blue-500/50 bg-blue-900/20' : ''}
        ${winner === Player.O ? 'border-red-500/50 bg-red-900/20' : ''}
        ${!isActive && !winner ? 'opacity-80' : 'opacity-100'}
      `}
        >
            {/* Grid of Cells */}
            {cells.map((cell, idx) => {
                const isLastMove = lastMove && lastMove[0] === boardIndex && lastMove[1] === idx;
                return (
                    <div key={idx} className={`relative ${isLastMove ? 'z-10 ring-2 ring-emerald-400 rounded-sm' : ''}`}>
                        <Cell
                            value={cell}
                            onClick={() => onCellClick(boardIndex, idx)}
                            disabled={!isActive || cell !== Player.EMPTY || !!winner}
                            isValidMove={isActive && !winner && cell === Player.EMPTY}
                        />
                    </div>
                )
            })}

            {/* Winner Overlay */}
            {winner !== Player.EMPTY && (
                <div className="absolute inset-0 flex items-center justify-center z-20 backdrop-blur-[1px] rounded-lg">
                    {winner === Player.X && <XIcon className="w-16 h-16 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-in zoom-in duration-300" />}
                    {winner === Player.O && <OIcon className="w-16 h-16 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-in zoom-in duration-300" />}
                </div>
            )}
        </div>
    );
};
