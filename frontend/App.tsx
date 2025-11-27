import React, { useState } from 'react';
import { GameConfig, Difficulty } from './types';
import { Landing } from './components/Landing';
import { DifficultySelection } from './components/DifficultySelection';
import { ScoreHistory } from './components/ScoreHistory';
import { Game } from './components/Game';

type ViewState = 'LANDING' | 'DIFFICULTY' | 'GAME' | 'HISTORY';

function App() {
  const [view, setView] = useState<ViewState>('LANDING');
  const [config, setConfig] = useState<GameConfig>({ 
    mode: 'PvAI', 
    difficulty: Difficulty.MEDIUM 
  });

  const handleSelectMode = (mode: 'PvP' | 'PvAI') => {
    setConfig(prev => ({ ...prev, mode }));
    if (mode === 'PvAI') {
      setView('DIFFICULTY');
    } else {
      setView('GAME');
    }
  };

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setConfig(prev => ({ ...prev, difficulty }));
    setView('GAME');
  };

  const handleBackToLanding = () => {
    setView('LANDING');
  };

  const handleHome = () => {
    setView('LANDING');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center py-10 px-4">
      {view === 'LANDING' && (
        <Landing 
          onSelectMode={handleSelectMode} 
          onViewHistory={() => setView('HISTORY')}
        />
      )}
      
      {view === 'DIFFICULTY' && (
        <DifficultySelection 
          onSelectDifficulty={handleSelectDifficulty} 
          onBack={handleBackToLanding}
        />
      )}

      {view === 'HISTORY' && (
        <ScoreHistory onBack={handleBackToLanding} />
      )}

      {view === 'GAME' && (
        <Game 
          config={config} 
          onHome={handleHome} 
          onViewHistory={() => setView('HISTORY')}
        />
      )}
    </div>
  );
}

export default App;
