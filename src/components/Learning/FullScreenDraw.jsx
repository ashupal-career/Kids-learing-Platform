import React, { useRef, useState, useEffect } from 'react';

const FullScreenDraw = ({ letter, word, type, onComplete, onClose }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState(0);
  const [message, setMessage] = useState('');
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    setCtx(context);
    
    // Set canvas size for mobile
    const resizeCanvas = () => {
      canvas.width = window.innerWidth - 30;
      canvas.height = window.innerHeight - 180;
      
      // Set background
      context.fillStyle = '#FFF9C4';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw guide letter
      context.save();
      context.globalAlpha = 0.35;
      const fontSize = Math.min(180, canvas.width / 2);
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
    };
    
    resizeCanvas();
    
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
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
    setTouchStart(pos);
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
    
    // Check if drawing has enough strokes
    if (drawingPoints > 40) {
      setCompleted(true);
      playSuccessSound();
      setMessage('🎉 Perfect! Moving to next! 🎉');
      
      setTimeout(() => {
        if (onComplete) onComplete(letter);
        onClose();
      }, 1500);
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
    
    ctx.save();
    ctx.globalAlpha = 0.35;
    const fontSize = Math.min(180, canvasRef.current.width / 2);
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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-black/20 backdrop-blur-sm">
        <button
          onClick={playLetterSound}
          className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all w-12 h-12 flex items-center justify-center"
        >
          🔊
        </button>
        
        <div className="text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
            <span className="text-white text-sm font-bold">Trace:</span>
            <span className="text-yellow-300 text-4xl font-bold mx-2">{letter}</span>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all w-12 h-12 flex items-center justify-center"
        >
          ✖️
        </button>
      </div>
      
      {/* Message */}
      {message && (
        <div className="absolute top-20 left-0 right-0 z-20 flex justify-center">
          <div className={`px-4 py-2 rounded-full text-white font-bold text-sm ${
            message.includes('Perfect') ? 'bg-green-500 animate-bounce' : 
            message.includes('Not enough') ? 'bg-red-500' : 
            message.includes('Please') ? 'bg-red-500' : 'bg-blue-500'
          }`}>
            {message}
          </div>
        </div>
      )}
      
      {/* Canvas Area - Full Screen Drawing */}
      <div className="flex-1 flex items-center justify-center p-3">
        <canvas
          ref={canvasRef}
          className="border-4 border-white rounded-2xl shadow-2xl touch-none"
          style={{ 
            width: 'calc(100% - 20px)', 
            height: 'auto',
            maxHeight: 'calc(100vh - 160px)',
            backgroundColor: '#FFF9C4',
            touchAction: 'none'
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
      </div>
      
      {/* Bottom Controls */}
      <div className="p-4 bg-black/20 backdrop-blur-sm flex justify-center gap-4">
        <button
          onClick={clearCanvas}
          className="bg-red-500/80 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-all font-semibold text-sm"
        >
          🧹 Clear & Start Over
        </button>
        <button
          onClick={playLetterSound}
          className="bg-green-500/80 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all font-semibold text-sm"
        >
          🔊 Hear Sound
        </button>
      </div>
      
      {/* Instructions */}
      <div className="p-2 text-center bg-black/20">
        <p className="text-white/80 text-xs">
          ✏️ Use your finger to trace the grey letter
        </p>
      </div>
    </div>
  );
};

export default FullScreenDraw;