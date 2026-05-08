import React, { useState } from 'react';
import SoundButton from './SoundButton';
import DrawingBoard from './DrawingBoard';

const HindiCard = ({ letter, word, color, onComplete, isCompleted }) => {
  const [showDrawing, setShowDrawing] = useState(false);
  const [completed, setCompleted] = useState(isCompleted || false);

  const handleComplete = (completedLetter) => {
    setCompleted(true);
    if (onComplete) {
      onComplete(completedLetter);
    }
  };

  const playHoverSound = () => {
    const textToSpeak = `${letter} - ${word}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div 
      onMouseEnter={playHoverSound}
      className="transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl relative">
        {/* Decorative Elements */}
        <div className="absolute top-2 left-2 text-2xl opacity-30">⭐</div>
        <div className="absolute bottom-2 right-2 text-2xl opacity-30">✨</div>
        
        <div className={`${color} p-6 text-center relative`}>
          <div className="bg-white/40 rounded-2xl p-4 inline-block mb-3">
            <span className="text-7xl md:text-8xl font-black">{letter}</span>
          </div>
          {word && word !== letter && (
            <p className="text-lg font-semibold text-gray-800 bg-white/50 rounded-xl px-3 py-1 inline-block">
              {word}
            </p>
          )}
        </div>
        
        {/* Sound Button */}
        <div className="absolute top-3 right-3">
          <SoundButton text={letter} lang="hi" type="alphabet" />
        </div>
        
        {/* Completion Badge */}
        {completed && (
          <div className="absolute top-3 left-3">
            <span className="text-2xl animate-bounce">✅</span>
          </div>
        )}
        
        <div className="p-6">
          <button
            onClick={() => setShowDrawing(!showDrawing)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {showDrawing ? '🙈 बंद करें' : '✍️ अभ्यास करें'}
          </button>
          
          {showDrawing && (
            <div className="mt-5">
              <DrawingBoard 
                targetLetter={letter} 
                onLetterComplete={handleComplete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HindiCard;