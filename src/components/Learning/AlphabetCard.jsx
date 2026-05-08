import React, { useState } from 'react';
import SoundButton from './SoundButton';
import DrawingBoard from './DrawingBoard';

const AlphabetCard = ({ alphabet, word, color, type = 'english', onComplete, isCompleted }) => {
  const [showDrawing, setShowDrawing] = useState(false);
  const [completed, setCompleted] = useState(isCompleted || false);

  const handleComplete = (letter) => {
    setCompleted(true);
    if (onComplete) {
      onComplete(letter);
    }
  };

  const playHoverSound = () => {
    let text = '';
    if (type === 'hindi') {
      text = `${alphabet} - ${word}`;
    } else if (type === 'number') {
      text = word || alphabet;
    } else {
      const sounds = {
        'A': 'A for Apple', 'B': 'B for Ball', 'C': 'C for Cat',
        'D': 'D for Dog', 'E': 'E for Elephant', 'F': 'F for Fish',
        'G': 'G for Ghost', 'H': 'H for Hat', 'I': 'I for Ice Cream',
        'J': 'J for Juice', 'K': 'K for Kite', 'L': 'L for Lion',
        'M': 'M for Monkey', 'N': 'N for Nest', 'O': 'O for Orange',
        'P': 'P for Parrot', 'Q': 'Q for Queen', 'R': 'R for Rabbit',
        'S': 'S for Sun', 'T': 'T for Tiger', 'U': 'U for Umbrella',
        'V': 'V for Van', 'W': 'W for Watch', 'X': 'X for X-ray',
        'Y': 'Y for Yoyo', 'Z': 'Z for Zebra'
      };
      text = sounds[alphabet.toUpperCase()] || alphabet;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = type === 'hindi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div 
      onMouseEnter={playHoverSound}
      className="transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      <div className={`${color} rounded-2xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl relative overflow-hidden`}>
        {/* Decorative Elements */}
        <div className="absolute top-2 left-2 text-2xl opacity-30">⭐</div>
        <div className="absolute bottom-2 right-2 text-2xl opacity-30">✨</div>
        
        {/* Main Content */}
        <div className="text-center">
          <div className="bg-white/40 rounded-2xl p-4 inline-block mb-3">
            <span className="text-7xl md:text-8xl font-black">{alphabet}</span>
          </div>
          {word && word !== alphabet && (
            <p className="text-lg font-semibold text-gray-800 bg-white/50 rounded-xl px-3 py-1 inline-block">
              {word}
            </p>
          )}
        </div>
        
        {/* Sound Button */}
        <div className="absolute top-3 right-3">
          <SoundButton text={alphabet} lang={type === 'hindi' ? 'hi' : 'en'} type="alphabet" />
        </div>
        
        {/* Completion Badge */}
        {completed && (
          <div className="absolute top-3 left-3">
            <span className="text-2xl animate-bounce">✅</span>
          </div>
        )}
        
        {/* Draw Button */}
        <div className="mt-5">
          <button
            onClick={() => setShowDrawing(!showDrawing)}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {showDrawing ? '🙈 Close Drawing Pad' : '✍️ Draw & Learn'}
          </button>
        </div>
        
        {/* Drawing Board */}
        {showDrawing && (
          <div className="mt-5">
            <DrawingBoard 
              targetLetter={alphabet} 
              onLetterComplete={handleComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AlphabetCard;