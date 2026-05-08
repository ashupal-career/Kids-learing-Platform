import React, { useState, useEffect, useCallback, useRef } from 'react';

const TicTacToe = ({ onBack }) => {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [isComputerMode, setIsComputerMode] = useState(false);
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  
  const computerTimeoutRef = useRef(null);

  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const playSound = useCallback((text) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log("Sound error:", e);
    }
  }, []);

  const checkWinner = useCallback((squares) => {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: pattern };
      }
    }
    return null;
  }, [winPatterns]);

  const makeMove = useCallback((index, player) => {
    if (winner !== null || board[index] !== '') return false;
    
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);
    
    // Check winner immediately
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setScores(prev => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1
      }));
      playSound(`${result.winner} wins! Great job!`);
      return true;
    }
    
    // Check draw
    if (newBoard.every(cell => cell !== '')) {
      setWinner('draw');
      setScores(prev => ({ ...prev, draw: prev.draw + 1 }));
      playSound(`It's a draw! Good game!`);
      return true;
    }
    
    // Switch turn
    setIsXNext(!isXNext);
    return false;
  }, [board, winner, isXNext, checkWinner, playSound]);

  // Computer AI - SIMPLIFIED
  const computerMove = useCallback(() => {
    if (!isComputerMode || winner !== null || isXNext || board.every(cell => cell !== '')) {
      setIsComputerThinking(false);
      return;
    }

    setIsComputerThinking(true);
    
    // Simple AI: find best move
    const emptyCells = board.reduce((acc, cell, idx) => {
      if (cell === '') acc.push(idx);
      return acc;
    }, []);

    let bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    // Prefer center
    if (emptyCells.includes(4)) bestMove = 4;
    // Prefer corners
    else if (emptyCells.some(i => [0,2,6,8].includes(i))) {
      bestMove = [0,2,6,8].find(i => emptyCells.includes(i)) || bestMove;
    }

    // Make move after delay
    computerTimeoutRef.current = setTimeout(() => {
      makeMove(bestMove, 'O');
      setIsComputerThinking(false);
    }, 500);
  }, [isComputerMode, winner, isXNext, board, makeMove]);

  // Trigger computer move
  useEffect(() => {
    if (isComputerMode && !isXNext && winner === null && !isComputerThinking) {
      computerMove();
    }
  }, [isComputerMode, isXNext, winner, isComputerThinking, computerMove]);

  const handleClick = useCallback((index) => {
    // SIMPLIFIED: Only disable when game over OR computer is thinking
    if (winner !== null || (isComputerMode && isComputerThinking)) return;
    
    // Player X always goes first, computer is O
    const player = isComputerMode ? 'X' : (isXNext ? 'X' : 'O');
    makeMove(index, player);
  }, [winner, isComputerMode, isComputerThinking, isXNext, makeMove]);

  const resetGame = useCallback(() => {
    if (computerTimeoutRef.current) clearTimeout(computerTimeoutRef.current);
    setBoard(Array(9).fill(''));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
    setIsComputerThinking(false);
  }, []);

  const resetScores = useCallback(() => {
    setScores({ X: 0, O: 0, draw: 0 });
    resetGame();
    playSound('Scores reset!');
  }, [resetGame, playSound]);

  const toggleMode = useCallback(() => {
    if (computerTimeoutRef.current) clearTimeout(computerTimeoutRef.current);
    setIsComputerMode(!isComputerMode);
    resetGame();
    playSound(!isComputerMode ? 'Computer mode activated!' : 'Two player mode!');
  }, [isComputerMode, resetGame, playSound]);

  const getStatus = useCallback(() => {
    if (winner === 'draw') return "🎉 IT'S A DRAW! 🎉";
    if (winner === 'X') return "🎉 X WINS! 🎉";
    if (winner === 'O') return isComputerMode ? "🤖 COMPUTER WINS! 🤖" : "🎉 O WINS! 🎉";
    
    if (isComputerMode) {
      return isComputerThinking ? "🤖 COMPUTER THINKING..." : "✨ YOUR TURN (X) ✨";
    }
    return `🎯 ${isXNext ? 'X' : 'O'} TURN 🎯`;
  }, [winner, isComputerMode, isXNext, isComputerThinking]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (computerTimeoutRef.current) clearTimeout(computerTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header - BIGGER & CLEARER */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onBack} 
            className="bg-white/20 hover:bg-white/40 text-white px-6 py-3 rounded-2xl text-lg font-bold transition-all shadow-lg"
          >
            ← Back
          </button>
          <button 
            onClick={toggleMode} 
            className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white px-6 py-3 rounded-2xl text-lg font-bold shadow-2xl transition-all"
          >
            {isComputerMode ? '🤖 COMPUTER' : '👥 2 PLAYERS'}
          </button>
        </div>
        
        {/* Game Card */}
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              <span className="inline-block animate-bounce">⭕</span>
              <span className="inline-block animate-bounce mx-4 delay-150">❌</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-wide">TIC TAC TOE</h1>
            <div className="text-xl font-bold text-white/80 mb-2">
              {getStatus()}
            </div>
            <div className="text-lg text-yellow-300 font-bold animate-pulse">
              👆 TAP EMPTY BOXES TO PLAY 👆
            </div>
          </div>
          
          {/* Scores */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-500/40 rounded-2xl p-4 text-center shadow-lg">
              <p className="text-white/80 text-sm font-medium">PLAYER X</p>
              <p className="text-blue-200 font-black text-4xl">{scores.X}</p>
            </div>
            <div className="bg-yellow-500/40 rounded-2xl p-4 text-center shadow-lg">
              <p className="text-white/80 text-sm font-medium">DRAWS</p>
              <p className="text-yellow-200 font-black text-4xl">{scores.draw}</p>
            </div>
            <div className="bg-pink-500/40 rounded-2xl p-4 text-center shadow-lg">
              <p className="text-white/80 text-sm font-medium">
                {isComputerMode ? 'COMPUTER' : 'PLAYER O'}
              </p>
              <p className="text-pink-200 font-black text-4xl">{scores.O}</p>
            </div>
          </div>
          
          {/* BIGGER BOARD - EASY TO CLICK */}
          <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-white/10 rounded-2xl">
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => handleClick(i)}
                className={`h-24 w-full rounded-2xl text-4xl font-black shadow-lg transition-all transform hover:scale-110 active:scale-95 ${
                  winner !== null || (isComputerMode && isComputerThinking)
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer hover:shadow-2xl'
                } ${
                  winningLine.includes(i)
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-2xl ring-8 ring-yellow-400/50'
                    : cell === 'X'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/50 shadow-2xl'
                    : cell === 'O'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/50 shadow-2xl'
                    : 'bg-white/30 hover:bg-white/50 text-gray-200 shadow-lg hover:shadow-2xl border-4 border-white/30'
                }`}
              >
                {cell}
              </button>
            ))}
          </div>
          
          {/* BIG CLEAR BUTTONS */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={resetGame}
              disabled={isComputerThinking}
              className="h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-green-400 text-white font-black text-xl rounded-2xl shadow-2xl transition-all hover:shadow-3xl active:scale-95"
            >
              🔄 NEW GAME
            </button>
            <button 
              onClick={resetScores}
              disabled={isComputerThinking}
              className="h-14 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:from-red-400 text-white font-black text-xl rounded-2xl shadow-2xl transition-all hover:shadow-3xl active:scale-95"
            >
              🏆 RESET SCORES
            </button>
          </div>
        </div>
        
        {/* SUPER CLEAR INSTRUCTIONS */}
        <div className="mt-8 p-4 bg-white/10 rounded-2xl text-center">
          <p className="text-2xl font-bold text-yellow-300 mb-2 animate-pulse">
            🎮 HOW TO PLAY 🎮
          </p>
          <p className="text-white text-lg mb-2">
            👆 <strong>CLICK/TAP</strong> any <strong>EMPTY WHITE BOX</strong> 👆
          </p>
          <p className="text-white/80 text-sm">
            {isComputerMode 
              ? "✨ You play X (blue), Computer plays O (pink)" 
              : "✨ Player 1 = X, Player 2 = O"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;