import React, { useRef, useState, useEffect } from 'react';

const FullScreenDraw = ({ letter, word, type, onComplete, onClose }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState(0);
  const [message, setMessage] = useState('');

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    setCtx(context);
    
    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerHeight - 200;
    
    // Set background
    context.fillStyle = '#FFF9C4';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw guide letter (faint grey)
    context.save();
    context.globalAlpha = 0.35;
    const fontSize = Math.min(250, canvas.width / 2.5);
    context.font = `bold ${fontSize}px "Comic Sans MS", cursive`;
    context.fillStyle = '#9CA3AF';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(letter, canvas.width / 2, canvas.height / 2);
    context.restore();
    
    // Drawing style
    context.strokeStyle = '#2563eb';
    context.lineWidth = 12;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth - 40;
      canvas.height = window.innerHeight - 200;
      context.fillStyle = '#FFF9C4';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.globalAlpha = 0.35;
      context.font = `bold ${fontSize}px "Comic Sans MS", cursive`;
      context.fillStyle = '#9CA3AF';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(letter, canvas.width / 2, canvas.height / 2);
      context.restore();
      context.strokeStyle = '#2563eb';
      context.lineWidth = 12;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [letter]);

  const playSuccessSound = () => {
    const utterance = new SpeechSynthesisUtterance(`Good job! Next alphabet!`);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const playTryAgainSound = () => {
    const utterance = new SpeechSynthesisUtterance(`Try again! Trace the letter carefully!`);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const playLetterSound = () => {
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.lang = type === 'hindi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    if (completed) return;
    e.preventDefault();
    setIsDrawing(true);
    const pos = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setMessage('✏️ Trace the letter...');
    setTimeout(() => setMessage(''), 2000);
  };

  const draw = (e) => {
    if (!isDrawing || completed) return;
    e.preventDefault();
    const pos = getCoordinates(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setDrawingPoints(prev => prev + 1);
  };

  const stopDrawing = () => {
    if (!isDrawing || completed) {
      setIsDrawing(false);
      return;
    }
    
    setIsDrawing(false);
    ctx.beginPath();
    
    // Check if drawing has enough strokes (50+ points = good drawing)
    if (drawingPoints > 50) {
      setCompleted(true);
      playSuccessSound();
      setMessage('🎉 Perfect! Moving to next! 🎉');
      
      setTimeout(() => {
        if (onComplete) onComplete(letter);
        onClose();
      }, 2000);
    } else if (drawingPoints > 10) {
      playTryAgainSound();
      setMessage('❌ Not enough tracing! Try again! ❌');
      
      setTimeout(() => {
        clearCanvas();
        setDrawingPoints(0);
        setMessage('');
      }, 2000);
    } else {
      playTryAgainSound();
      setMessage('❌ Please trace the letter completely! ❌');
      
      setTimeout(() => {
        setMessage('');
      }, 2000);
    }
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.fillStyle = '#FFF9C4';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Redraw guide letter
    ctx.save();
    ctx.globalAlpha = 0.35;
    const fontSize = Math.min(250, canvasRef.current.width / 2.5);
    ctx.font = `bold ${fontSize}px "Comic Sans MS", cursive`;
    ctx.fillStyle = '#9CA3AF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, canvasRef.current.width / 2, canvasRef.current.height / 2);
    ctx.restore();
    
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 12;
    setDrawingPoints(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full text-2xl z-10 transition-all hover:scale-110"
      >
        ✖️
      </button>
      
      {/* Sound Button */}
      <button
        onClick={playLetterSound}
        className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full text-2xl z-10 transition-all hover:scale-110"
      >
        🔊
      </button>
      
      {/* Header */}
      <div className="text-center pt-6 pb-2">
        <div className="bg-white/20 backdrop-blur-sm inline-block rounded-2xl px-8 py-3">
          <span className="text-2xl font-bold text-white">Trace the letter</span>
          <span className="text-yellow-300 text-7xl font-bold mx-3">{letter}</span>
          <span className="text-white/80 text-sm">({word})</span>
        </div>
      </div>
      
      {/* Message */}
      {message && (
        <div className={`text-center mt-2 mb-2 ${message.includes('Perfect') ? 'animate-bounce' : ''}`}>
          <div className={`inline-block px-6 py-2 rounded-full ${
            message.includes('Perfect') ? 'bg-green-500' : 
            message.includes('Not enough') ? 'bg-red-500' : 
            message.includes('Please') ? 'bg-red-500' : 'bg-blue-500'
          } text-white font-semibold`}>
            {message}
          </div>
        </div>
      )}
      
      {/* Canvas Area */}
      <div className="flex justify-center items-center px-5 mt-2">
        <canvas
          ref={canvasRef}
          className="border-4 border-white rounded-2xl shadow-2xl cursor-crosshair"
          style={{ width: 'calc(100% - 40px)', height: 'calc(100vh - 220px)' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-5 left-0 right-0 text-center">
        <div className="flex justify-center gap-4">
          <p className="text-white text-sm bg-black/30 inline-block px-4 py-1 rounded-full">
            ✏️ Trace the grey letter completely
          </p>
        </div>
        <button
          onClick={clearCanvas}
          className="mt-3 bg-red-500/80 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-all text-sm"
        >
          🧹 Clear & Start Over
        </button>
      </div>
    </div>
  );
};

export default FullScreenDraw;