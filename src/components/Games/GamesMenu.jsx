import React, { useState } from 'react';
import TicTacToe from './TicTacToe';
import MemoryMatch from './MemoryMatch';
import NumberSequence from './NumberSequence';
import ColorMatch from './ColorMatch';

const GamesMenu = ({ onBack }) => {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    { id: 'tictactoe', name: 'Tic Tac Toe', icon: '⭕', color: 'from-purple-500 to-pink-500', desc: 'Play X and O game!', emoji: '🎮' },
    { id: 'memory', name: 'Memory Match', icon: '🧩', color: 'from-blue-500 to-cyan-500', desc: 'Match the pairs!', emoji: '🧠' },
    { id: 'numbers', name: 'Number Sequence', icon: '🔢', color: 'from-green-500 to-emerald-500', desc: 'Find missing numbers!', emoji: '🔢' },
    { id: 'colors', name: 'Color Match', icon: '🎨', color: 'from-orange-500 to-red-500', desc: 'Match the colors!', emoji: '🎨' }
  ];

  const playHoverSound = (gameName) => {
    const utterance = new SpeechSynthesisUtterance(`Play ${gameName}`);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  if (selectedGame === 'tictactoe') {
    return <TicTacToe onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === 'memory') {
    return <MemoryMatch onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === 'numbers') {
    return <NumberSequence onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === 'colors') {
    return <ColorMatch onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 py-8 px-4">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-4">
        <button 
          onClick={onBack} 
          className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full transition-all flex items-center gap-2"
        >
          ← Back to Main Menu
        </button>
      </div>
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block animate-bounce mb-4">
          <span className="text-7xl">🎮</span>
          <span className="text-7xl mx-3">🧠</span>
          <span className="text-7xl">🎲</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
          Mind Games
        </h1>
        <p className="text-xl text-white/80">Play, learn, and have fun! 🎉</p>
      </div>
      
      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {games.map(game => (
          <button
            key={game.id}
            onClick={() => setSelectedGame(game.id)}
            onMouseEnter={() => playHoverSound(game.name)}
            className={`bg-gradient-to-r ${game.color} rounded-3xl p-8 text-center transition-all duration-500 transform hover:scale-110 hover:rotate-1 shadow-2xl hover:shadow-3xl group`}
          >
            <div className="text-8xl mb-5 group-hover:animate-bounce">{game.icon}</div>
            <h2 className="text-2xl font-bold text-white mb-2">{game.name}</h2>
            <p className="text-white/80 text-sm">{game.desc}</p>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-white text-sm bg-white/20 px-3 py-1 rounded-full">Click to Play →</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Footer */}
      <footer className="text-center mt-16">
        <div className="flex justify-center gap-3 text-3xl mb-3">
          <span className="animate-bounce">🎮</span>
          <span className="animate-bounce delay-100">🧩</span>
          <span className="animate-bounce delay-200">🎨</span>
          <span className="animate-bounce delay-300">🔢</span>
        </div>
        <p className="text-white/60 text-sm">✨ Choose a game and start playing! ✨</p>
        <p className="text-white/40 text-xs mt-2">Each game helps improve memory and thinking skills!</p>
      </footer>
    </div>
  );
};

export default GamesMenu;