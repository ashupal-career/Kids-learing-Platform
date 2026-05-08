import React, { useState } from 'react';
import { englishAlphabets } from '../../data/englishAlphabets';
import { hindiAlphabets } from '../../data/hindiAlphabets';
import { numbers } from '../../data/numbers';
import AlphabetCard from './AlphabetCard';

const LearningSection = ({ mode, onBack }) => {
  const [progress, setProgress] = useState({ english: [], hindi: [], numbers: [] });

  const getData = () => {
    if (mode === 'english') {
      return { 
        data: englishAlphabets, 
        type: 'english', 
        title: '🔤 English Alphabets', 
        total: 26, 
        bg: 'from-blue-500 to-purple-500' 
      };
    }
    if (mode === 'hindi') {
      return { 
        data: hindiAlphabets, 
        type: 'hindi', 
        title: '🇮🇳 Hindi Varnamala', 
        total: 50, 
        bg: 'from-orange-500 to-red-500' 
      };
    }
    return { 
      data: numbers, 
      type: 'number', 
      title: '🔢 Numbers 1-100', 
      total: 100, 
      bg: 'from-green-500 to-teal-500' 
    };
  };

  const { data, type, title, total } = getData();
  const currentProgress = progress[type]?.length || 0;
  const progressPercent = (currentProgress / total) * 100;

  const handleComplete = (letter) => {
    setProgress(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), letter]
    }));
  };

  // Play sound when entering this section
  React.useEffect(() => {
    const welcomeSound = new SpeechSynthesisUtterance(
      type === 'hindi' ? `${title} में आपका स्वागत है। सीखना शुरू करें!` : `Welcome to ${title}. Start learning!`
    );
    welcomeSound.lang = type === 'hindi' ? 'hi-IN' : 'en-US';
    welcomeSound.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(welcomeSound);
  }, [title, type]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/10 backdrop-blur-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <button 
            onClick={onBack} 
            className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full transition-all text-lg font-semibold flex items-center gap-2"
          >
            ← Back to Menu
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
          <div className="bg-white/20 rounded-full px-4 py-2">
            <span className="text-white font-semibold">⭐ Progress: {currentProgress}/{total}</span>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-3">
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-400 to-yellow-400 h-full transition-all duration-500 rounded-full" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((item) => (
            <AlphabetCard
              key={item.id}
              alphabet={item.letter || item.number}
              word={item.word || item.spelling}
              color={item.color}
              type={type}
              onComplete={handleComplete}
              isCompleted={progress[type]?.includes(item.letter || item.number?.toString())}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-white/10">
        <p className="text-white/50 text-sm">
          ✨ Click on any card and then "Draw in Full Screen" to practice writing! ✨
        </p>
      </footer>
    </div>
  );
};

export default LearningSection;