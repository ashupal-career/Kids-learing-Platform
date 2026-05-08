import React, { useState } from 'react';
import FullScreenDraw from './FullScreenDraw';

const HindiCard = ({ letter, word, color, onComplete, isCompleted }) => {
  const [showFullScreen, setShowFullScreen] = useState(false);
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

  const playClickSound = () => {
    const textToSpeak = `${letter} - ${word}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
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
          <button
            onClick={playClickSound}
            className="absolute top-3 right-3 bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg text-xl"
          >
            🔊
          </button>
          
          {/* Completion Badge */}
          {completed && (
            <div className="absolute top-3 left-3">
              <span className="text-2xl animate-bounce">✅</span>
            </div>
          )}
          
          <div className="p-6">
            <button
              onClick={() => setShowFullScreen(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              ✍️ पूर्ण स्क्रीन में लिखें
            </button>
          </div>
        </div>
      </div>
      
      {/* Full Screen Drawing Modal */}
      {showFullScreen && (
        <FullScreenDraw
          letter={letter}
          word={word}
          type="hindi"
          onComplete={handleComplete}
          onClose={() => setShowFullScreen(false)}
        />
      )}
    </>
  );
};

export default HindiCard;