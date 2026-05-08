import React, { useState, useEffect, useCallback, useMemo } from 'react';

const ColorMatch = ({ onBack }) => {
  const [currentColor, setCurrentColor] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [round, setRound] = useState(1);
  const [isCorrect, setIsCorrect] = useState(null);

  const colors = useMemo(() => [
    { name: 'Red', code: '#EF4444', display: '🔴', pronunciation: 'red' },
    { name: 'Blue', code: '#3B82F6', display: '🔵', pronunciation: 'blue' },
    { name: 'Green', code: '#22C55E', display: '🟢', pronunciation: 'green' },
    { name: 'Yellow', code: '#EAB308', display: '🟡', pronunciation: 'yellow' },
    { name: 'Purple', code: '#A855F7', display: '🟣', pronunciation: 'purple' },
    { name: 'Pink', code: '#EC4899', display: '💗', pronunciation: 'pink' },
    { name: 'Orange', code: '#F97316', display: '🟠', pronunciation: 'orange' },
    { name: 'Cyan', code: '#06B6D4', display: '🔷', pronunciation: 'cyan' }
  ], []);

  const generateNewRound = useCallback(() => {
    const correctColor = colors[Math.floor(Math.random() * colors.length)];
    setCurrentColor(correctColor);
    
    const otherColors = colors.filter(c => c.name !== correctColor.name);
    const shuffledOthers = [...otherColors].sort(() => Math.random() - 0.5);
    const randomOptions = [correctColor, shuffledOthers[0], shuffledOthers[1], shuffledOthers[2]].sort(() => Math.random() - 0.5);
    setOptions(randomOptions);
    setIsCorrect(null);
  }, [colors]);

  useEffect(() => {
    generateNewRound();
  }, [generateNewRound, round]);

  const playSound = (text, isSuccess = false) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = isSuccess ? 0.9 : 0.8;
    utterance.pitch = isSuccess ? 1.2 : 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const checkAnswer = (selectedColor) => {
    if (selectedColor.name === currentColor.name) {
      const newScore = score + 10;
      setScore(newScore);
      setMessage('🎉 Correct! Great job! 🎉');
      setIsCorrect(true);
      playSound(`Correct! ${currentColor.name} is right! +10 points!`, true);
      
      setTimeout(() => {
        setRound(round + 1);
        setMessage('');
        setIsCorrect(null);
      }, 1500);
    } else {
      setMessage(`❌ Wrong! The color is ${currentColor.name}! ❌`);
      setIsCorrect(false);
      playSound(`The correct color is ${currentColor.name}. Try again!`);
      
      setTimeout(() => {
        setMessage('');
        setIsCorrect(null);
      }, 2000);
    }
  };

  const resetGame = () => {
    setScore(0);
    setRound(1);
    setMessage('');
    setIsCorrect(null);
    generateNewRound();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-500 to-yellow-500 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={onBack} 
          className="mb-6 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full transition-all flex items-center gap-2"
        >
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <h1 className="text-5xl font-bold text-white text-center mb-2">🎨 Color Match 🎨</h1>
          <p className="text-white/80 text-center mb-6">Match the color with its name!</p>
          
          <div className="flex justify-between items-center mb-6">
            <div className="bg-white/20 rounded-2xl px-6 py-3">
              <p className="text-white text-sm">Score</p>
              <p className="text-white font-bold text-3xl">{score}</p>
            </div>
            <div className="bg-white/20 rounded-2xl px-6 py-3">
              <p className="text-white text-sm">Round</p>
              <p className="text-white font-bold text-3xl">{round}</p>
            </div>
          </div>
          
          {message && (
            <div className={`text-center mb-6 p-4 rounded-2xl ${message.includes('Correct') ? 'bg-green-500' : 'bg-red-500'} animate-bounce shadow-lg`}>
              <p className="text-white font-bold text-xl">{message}</p>
            </div>
          )}
          
          <div className="text-center mb-10">
            <div 
              className={`w-72 h-72 rounded-3xl shadow-2xl mx-auto mb-4 transition-all duration-300 flex items-center justify-center ${isCorrect === true ? 'ring-8 ring-green-400 scale-110' : isCorrect === false ? 'ring-8 ring-red-400' : ''}`}
              style={{ backgroundColor: currentColor?.code }}
            >
              <span className="text-9xl">{currentColor?.display}</span>
            </div>
            <p className="text-white text-2xl font-bold mt-4">What color is this? 🤔</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {options.map((color, idx) => (
              <button
                key={idx}
                onClick={() => checkAnswer(color)}
                className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 rounded-2xl text-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <span className="text-3xl">{color.display}</span>
                <span>{color.name}</span>
              </button>
            ))}
          </div>
          
          <button 
            onClick={resetGame} 
            className="w-full mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 rounded-2xl transition-all text-lg shadow-lg"
          >
            🔄 New Game
          </button>
        </div>
        
        <div className="text-center mt-6 text-white/70 text-sm">
          <p>✨ Look at the color and click the correct name! Each correct answer gives 10 points! ✨</p>
        </div>
      </div>
    </div>
  );
};

export default ColorMatch;