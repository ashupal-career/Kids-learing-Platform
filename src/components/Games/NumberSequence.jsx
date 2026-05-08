import React, { useState, useEffect, useCallback } from 'react';

const NumberSequence = ({ onBack }) => {
  const [numbers, setNumbers] = useState([]);
  const [missingValue, setMissingValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState(1);
  const [questionCount, setQuestionCount] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);

  const generateNewGame = useCallback(() => {
    const sequenceLength = 5;
    const startNum = Math.floor(Math.random() * 50) + 1;
    const sequence = [];
    for (let i = 0; i < sequenceLength; i++) {
      sequence.push(startNum + i);
    }
    
    const missingPos = Math.floor(Math.random() * sequenceLength);
    const correctValue = sequence[missingPos];
    setMissingValue(correctValue);
    
    // Generate wrong options (more challenging based on level)
    const wrongOptions = [];
    const difficultyOffset = Math.min(5, Math.floor(level / 2));
    while (wrongOptions.length < 3) {
      const offset = Math.floor(Math.random() * (difficultyOffset + 3)) + 1;
      const wrong = correctValue + (Math.random() > 0.5 ? offset : -offset);
      if (wrong !== correctValue && wrong > 0 && !wrongOptions.includes(wrong)) {
        wrongOptions.push(wrong);
      }
    }
    
    const allOptions = [correctValue, ...wrongOptions].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    
    const displayNumbers = [...sequence];
    displayNumbers[missingPos] = '?';
    setNumbers(displayNumbers);
    setIsCorrect(null);
  }, [level]);

  useEffect(() => {
    generateNewGame();
  }, [generateNewGame, questionCount]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  const playSound = (text, isSuccess = false) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = isSuccess ? 0.9 : 0.8;
    utterance.pitch = isSuccess ? 1.2 : 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const checkAnswer = (selectedNum) => {
    if (selectedNum === missingValue) {
      const pointsScored = 10 + Math.floor(level / 2) + (streak * 2);
      setScore(score + pointsScored);
      setStreak(streak + 1);
      setMessage(`🎉 Correct! +${pointsScored} points! Streak: ${streak + 1}! 🎉`);
      setIsCorrect(true);
      playSound(`Correct! Well done! +${pointsScored} points! You're on a ${streak + 1} streak!`, true);
      
      setTimeout(() => {
        setLevel(level + 1);
        setQuestionCount(questionCount + 1);
        setMessage('');
        setIsCorrect(null);
      }, 1500);
    } else {
      setStreak(0);
      setMessage(`❌ Oops! The correct number was ${missingValue}! ❌`);
      setIsCorrect(false);
      playSound(`The correct number was ${missingValue}. Try the next one!`);
      
      setTimeout(() => {
        setQuestionCount(questionCount + 1);
        setMessage('');
        setIsCorrect(null);
      }, 2000);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setQuestionCount(0);
    setMessage('');
    setStreak(0);
    setIsCorrect(null);
    generateNewGame();
    playSound(`Game reset! Starting fresh!`);
  };

  const getLevelColor = () => {
    if (level <= 3) return 'text-green-300';
    if (level <= 7) return 'text-yellow-300';
    if (level <= 12) return 'text-orange-300';
    return 'text-red-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={onBack} 
          className="mb-6 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full transition-all flex items-center gap-2"
        >
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <h1 className="text-5xl font-bold text-white text-center mb-2">🔢 Number Sequence 🔢</h1>
          <p className="text-white/80 text-center mb-6">Find the missing number in the sequence!</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-white/70 text-sm">Score</p>
              <p className="text-yellow-300 font-bold text-2xl">{score}</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-white/70 text-sm">Level</p>
              <p className={`font-bold text-2xl ${getLevelColor()}`}>{level}</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-white/70 text-sm">Streak</p>
              <p className={`font-bold text-2xl ${streak > 0 ? 'text-green-400' : 'text-white'}`}>🔥 {streak}</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-white/70 text-sm">High Score</p>
              <p className="text-purple-300 font-bold text-2xl">🏆 {highScore}</p>
            </div>
          </div>
          
          {message && (
            <div className={`text-center mb-6 p-4 rounded-2xl ${message.includes('Correct') ? 'bg-green-500' : 'bg-red-500'} animate-bounce shadow-lg`}>
              <p className="text-white font-bold text-lg">{message}</p>
            </div>
          )}
          
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {numbers.map((num, idx) => (
              <div 
                key={idx} 
                className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                  num === '?' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse' 
                    : 'bg-white/20'
                }`}
              >
                <span className={`text-3xl md:text-4xl font-bold text-white ${num === '?' ? 'text-4xl md:text-5xl' : ''}`}>
                  {num}
                </span>
              </div>
            ))}
          </div>
          
          <div className="text-center mb-8">
            <p className="text-white text-2xl font-bold mb-2">What number is missing? 🤔</p>
            <p className="text-white/60 text-sm">Look at the pattern and find the missing number!</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => checkAnswer(opt)}
                className={`bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 rounded-2xl text-3xl transition-all transform hover:scale-105 shadow-lg ${
                  isCorrect === true ? 'bg-green-500' : isCorrect === false ? 'bg-red-500' : ''
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          
          <button 
            onClick={resetGame} 
            className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all text-lg flex items-center justify-center gap-2"
          >
            🔄 Reset Game
          </button>
        </div>
        
        <div className="text-center mt-6 text-white/60 text-sm">
          <p>✨ Find the missing number! Each correct answer increases level and gives bonus points! ✨</p>
          <p className="text-xs mt-1">💪 Keep your streak going for extra points!</p>
        </div>
      </div>
    </div>
  );
};

export default NumberSequence;