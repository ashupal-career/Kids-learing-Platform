import React, { useState } from 'react';
import FullScreenDraw from './FullScreenDraw';

const NurseryCard = ({ alphabet, word, color, type = 'english', onComplete, isCompleted }) => {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [completed, setCompleted] = useState(isCompleted || false);

  const handleComplete = (letter) => {
    setCompleted(true);
    if (onComplete) {
      onComplete(letter);
    }
  };

  // Play sound on hover
  const playHoverSound = () => {
    let textToSpeak = '';
    
    if (type === 'hindi') {
      textToSpeak = `${alphabet} - ${word}`;
    } else if (type === 'number') {
      textToSpeak = word || alphabet;
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
      textToSpeak = sounds[alphabet.toUpperCase()] || alphabet;
    }
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = type === 'hindi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const playClickSound = (e) => {
    e.stopPropagation();
    playHoverSound();
  };

  return (
    <>
      <div 
        className="transition-all duration-300 hover:scale-105 cursor-pointer"
        onMouseEnter={playHoverSound}
      >
        <div className={`${color} rounded-3xl p-6 shadow-2xl relative overflow-hidden`}>
          <div className="absolute top-2 left-2 text-2xl opacity-40">⭐</div>
          <div className="absolute bottom-2 right-2 text-2xl opacity-40">✨</div>
          
          <div className="text-center">
            <div className="bg-white/40 rounded-2xl p-4 inline-block mb-3">
              <span className="text-8xl font-black">{alphabet}</span>
            </div>
            {word && word !== alphabet && (
              <p className="text-lg font-bold text-gray-800 bg-white/50 rounded-xl px-3 py-1 inline-block">
                {word}
              </p>
            )}
          </div>
          
          {/* Sound Button */}
          <button
            onClick={playClickSound}
            className="absolute top-3 right-3 bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-full text-xl transition-all duration-300 transform hover:scale-110"
          >
            🔊
          </button>
          
          {/* Completion Badge */}
          {completed && (
            <div className="absolute top-3 left-3">
              <span className="text-3xl animate-bounce">✅</span>
            </div>
          )}
          
          {/* Draw Button */}
          <div className="mt-5">
            <button
              onClick={() => setShowFullScreen(true)}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              ✍️ Draw & Learn
            </button>
          </div>
        </div>
      </div>
      
      {/* Full Screen Drawing Modal */}
      {showFullScreen && (
        <FullScreenDraw
          letter={alphabet}
          word={word}
          type={type}
          onComplete={handleComplete}
          onClose={() => setShowFullScreen(false)}
        />
      )}
    </>
  );
};

export default NurseryCard;