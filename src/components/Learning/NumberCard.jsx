import React, { useState } from 'react';
import SoundButton from './SoundButton';
import DrawingBoard from './DrawingBoard';

const NumberCard = ({ number, spelling, color, onComplete, isCompleted }) => {
  const [showDrawing, setShowDrawing] = useState(false);
  const [completed, setCompleted] = useState(isCompleted || false);

  const handleComplete = (completedNumber) => {
    setCompleted(true);
    if (onComplete) {
      onComplete(completedNumber);
    }
  };

  const playHoverSound = () => {
    const textToSpeak = `${number} - ${spelling}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
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
            <span className="text-7xl md:text-8xl font-black">{number}</span>
          </div>
          {spelling && (
            <p className="text-lg font-semibold text-gray-800 bg-white/50 rounded-xl px-3 py-1 inline-block">
              {spelling}
            </p>
          )}
        </div>
        
        {/* Sound Button */}
        <div className="absolute top-3 right-3">
          <SoundButton text={spelling} lang="en" type="number" />
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
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {showDrawing ? '🙈 Close Drawing Pad' : '✍️ Practice Writing'}
          </button>
          
          {showDrawing && (
            <div className="mt-5">
              <DrawingBoard 
                targetLetter={number.toString()} 
                onLetterComplete={handleComplete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberCard;