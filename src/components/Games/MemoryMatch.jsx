import React, { useState, useEffect, useCallback, useMemo } from 'react';

const MemoryMatch = ({ onBack }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const emojis = useMemo(() => ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'], []);
  const gameEmojis = useMemo(() => [...emojis, ...emojis], [emojis]);

  const shuffleCards = useCallback(() => {
    const shuffled = [...gameEmojis].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameComplete(false);
    setWaiting(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  }, [gameEmojis]);

  useEffect(() => {
    shuffleCards();
  }, [shuffleCards]);

  useEffect(() => {
    let timer;
    if (!gameComplete && startTime && matched.length > 0) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameComplete, startTime, matched.length]);

  useEffect(() => {
    if (matched.length === gameEmojis.length && gameEmojis.length > 0 && !gameComplete) {
      setGameComplete(true);
      const minutes = Math.floor(elapsedTime / 60);
      const seconds = elapsedTime % 60;
      const timeString = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''} and ${seconds} seconds` : `${seconds} seconds`;
      
      const sound = new SpeechSynthesisUtterance(`Amazing! You completed the memory game in ${moves} moves and ${timeString}! You're a champion!`);
      sound.lang = 'en-US';
      sound.rate = 0.9;
      sound.pitch = 1.2;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(sound);
    }
  }, [matched, gameEmojis.length, moves, gameComplete, elapsedTime]);

  const playMatchSound = () => {
    const sound = new SpeechSynthesisUtterance(`Match found! Great memory!`);
    sound.lang = 'en-US';
    sound.rate = 0.9;
    sound.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(sound);
  };

  const playTryAgainSound = () => {
    const sound = new SpeechSynthesisUtterance(`Try again! Find the matching pair!`);
    sound.lang = 'en-US';
    sound.rate = 0.8;
    window.speechSynthesis.speak(sound);
  };

  const handleCardClick = (index) => {
    if (waiting) return;
    if (flipped.length === 2) return;
    if (flipped.includes(index)) return;
    if (matched.includes(index)) return;
    if (gameComplete) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    setMoves(moves + 1);

    if (newFlipped.length === 2) {
      setWaiting(true);
      const [first, second] = newFlipped;
      
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        playMatchSound();
        setWaiting(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setWaiting(false);
        }, 800);
      }
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={onBack} 
          className="mb-6 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full transition-all flex items-center gap-2"
        >
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <h1 className="text-5xl font-bold text-white text-center mb-2">🧩 Memory Match 🧩</h1>
          <p className="text-white/80 text-center mb-6">Test your memory! Find all matching pairs!</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-white/70 text-sm">Moves</p>
              <p className="text-white font-bold text-2xl">{moves}</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-white/70 text-sm">Matched</p>
              <p className="text-white font-bold text-2xl">{matched.length / 2}/{gameEmojis.length / 2}</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-white/70 text-sm">Time</p>
              <p className="text-white font-bold text-2xl">{formatTime()}</p>
            </div>
            <button 
              onClick={shuffleCards} 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold rounded-2xl p-3 transition-all transform hover:scale-105"
            >
              🔄 New
            </button>
          </div>
          
          {gameComplete && (
            <div className="text-center mb-6 p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl animate-bounce shadow-lg">
              <p className="text-white font-bold text-2xl">🎉 Congratulations! You're a memory champion! 🎉</p>
              <p className="text-white/90 text-lg mt-2">✨ {moves} moves in {formatTime()}! ✨</p>
            </div>
          )}
          
          <div className="grid grid-cols-4 gap-3">
            {cards.map((card, index) => (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                className={`aspect-square rounded-2xl text-4xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  flipped.includes(index) || matched.includes(index)
                    ? 'bg-white text-gray-800 rotate-0'
                    : 'bg-gradient-to-br from-purple-600 to-pink-500 text-white rotate-180'
                }`}
                disabled={waiting}
              >
                {(flipped.includes(index) || matched.includes(index)) ? card : '?'}
              </button>
            ))}
          </div>
          
          <div className="mt-6 text-center text-white/80 text-sm bg-black/20 rounded-xl p-3">
            <p className="font-semibold">💡 Tip:</p>
            <p>Click on cards to find matching pairs. Try to remember where you saw each card!</p>
            <p className="text-xs mt-1">Lower moves and faster time = Better score!</p>
          </div>
        </div>
        
        <div className="text-center mt-6 text-white/60 text-sm">
          <p>✨ Match all {gameEmojis.length / 2} pairs to win! ✨</p>
        </div>
      </div>
    </div>
  );
};

export default MemoryMatch;