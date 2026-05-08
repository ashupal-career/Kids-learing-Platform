import React, { useRef, useState, useEffect } from 'react';

const FullScreenDraw = ({ letter, word, type, onComplete, onClose }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState(0);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    setCtx(context);
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth - 40;
      canvas.height = window.innerHeight - 200;
      
      // Gradient background
      const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#FFF9C4');
      gradient.addColorStop(1, '#FFE0B2');
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw decorative stars
      for (let i = 0; i < 20; i++) {
        context.fillStyle = `rgba(255, 193, 7, ${Math.random() * 0.3})`;
        context.beginPath();
        context.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3, 0, Math.PI * 2);
        context.fill();
      }
      
      // Draw guide letter with glow effect
      context.shadowBlur = 0;
      context.save();
      context.globalAlpha = 0.25;
      const fontSize = Math.min(200, canvas.width / 2.2);
      context.font = `bold ${fontSize}px "Comic Sans MS", cursive`;
      context.fillStyle = '#9CA3AF';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(letter, canvas.width / 2, canvas.height / 2);
      
      // Draw outline for guide letter
      context.strokeStyle = '#D1D5DB';
      context.lineWidth = 2;
      context.strokeText(letter, canvas.width / 2, canvas.height / 2);
      context.restore();
      
      // Drawing style
      context.strokeStyle = '#2563eb';
      context.lineWidth = 10;
      context.lineCap = 'round';
      context.lineJoin = 'round';
    };
    
    resizeCanvas();
    
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [letter]);

  // Update progress
  useEffect(() => {
    const newProgress = Math.min((drawingPoints / 50) * 100, 100);
    setProgress(newProgress);
  }, [drawingPoints]);

  const playSuccessSound = () => {
    const utterance = new SpeechSynthesisUtterance(`Excellent! You wrote ${letter} perfectly! Great job!`);
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
    ctx.strokeStyle = '#2563eb';
    ctx.shadowBlur = 0;
    setMessage('✨ Keep tracing! You\'re doing great! ✨');
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
    
    if (drawingPoints > 40) {
      setCompleted(true);
      playSuccessSound();
      setMessage('🎉🎉 PERFECT! Amazing job! 🎉🎉');
      setProgress(100);
      
      setTimeout(() => {
        if (onComplete) onComplete(letter);
        onClose();
      }, 2000);
    } else if (drawingPoints > 10) {
      playTryAgainSound();
      setMessage('💪 Almost there! Try again! 💪');
      
      setTimeout(() => {
        clearCanvas();
        setDrawingPoints(0);
        setMessage('');
      }, 2000);
    } else {
      playTryAgainSound();
      setMessage('🌟 Start from the letter and trace completely! 🌟');
      
      setTimeout(() => {
        setMessage('');
      }, 2000);
    }
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFF9C4');
    gradient.addColorStop(1, '#FFE0B2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw decorative stars
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `rgba(255, 193, 7, ${Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.save();
    ctx.globalAlpha = 0.25;
    const fontSize = Math.min(200, canvas.width / 2.2);
    ctx.font = `bold ${fontSize}px "Comic Sans MS", cursive`;
    ctx.fillStyle = '#9CA3AF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2);
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 2;
    ctx.strokeText(letter, canvas.width / 2, canvas.height / 2);
    ctx.restore();
    
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 10;
    setDrawingPoints(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 flex flex-col animate-fadeIn">
      {/* Top Bar with Glassmorphism */}
      <div className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <button
          onClick={playLetterSound}
          className="group bg-white/20 hover:bg-white/30 text-white p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 w-12 h-12 flex items-center justify-center shadow-lg"
        >
          <span className="text-2xl group-hover:animate-bounce">🔊</span>
        </button>
        
        <div className="text-center">
          <div className="bg-gradient-to-r from-yellow-400/30 to-orange-400/30 backdrop-blur-xl rounded-2xl px-6 py-2 border border-white/30 shadow-xl">
            <span className="text-white/90 text-sm font-bold uppercase tracking-wide">Tracing</span>
            <span className="text-yellow-300 text-6xl font-black mx-2 animate-pulse">{letter}</span>
            <span className="text-white/90 text-sm font-bold uppercase tracking-wide">{word}</span>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="group bg-white/20 hover:bg-red-500/60 text-white p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 w-12 h-12 flex items-center justify-center shadow-lg"
        >
          <span className="text-2xl group-hover:rotate-90 transition-transform">✖️</span>
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="px-6 pt-3">
        <div className="bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-400 to-yellow-400 h-full transition-all duration-500 rounded-full shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white/70 text-xs text-center mt-1 font-medium">
          {progress < 30 ? '📝 Start tracing...' : progress < 70 ? '✏️ You\'re doing great!' : '🎨 Almost there!'}
        </p>
      </div>
      
      {/* Message with Animation */}
      {message && (
        <div className="absolute top-24 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <div className={`px-6 py-3 rounded-2xl text-white font-bold text-base shadow-2xl animate-bounce backdrop-blur-sm ${
            message.includes('PERFECT') ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 
            message.includes('Almost') ? 'bg-gradient-to-r from-yellow-500 to-orange-600' : 
            message.includes('Start') ? 'bg-gradient-to-r from-blue-500 to-cyan-600' : 'bg-gradient-to-r from-purple-500 to-pink-600'
          }`}>
            {message}
          </div>
        </div>
      )}
      
      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <canvas
          ref={canvasRef}
          className="rounded-3xl shadow-2xl cursor-crosshair touch-none ring-4 ring-white/30"
          style={{ 
            width: 'calc(100% - 20px)', 
            height: 'auto',
            maxHeight: 'calc(100vh - 200px)',
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
      <div className="p-4 bg-white/10 backdrop-blur-xl border-t border-white/20">
        <div className="flex justify-center gap-4">
          <button
            onClick={clearCanvas}
            className="group bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-8 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 font-bold text-base shadow-xl flex items-center gap-2"
          >
            <span className="text-xl group-hover:rotate-12 transition-transform">🧹</span>
            Clear
          </button>
          <button
            onClick={playLetterSound}
            className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 font-bold text-base shadow-xl flex items-center gap-2"
          >
            <span className="text-xl group-hover:animate-bounce">🔊</span>
            Hear Sound
          </button>
        </div>
        
        {/* Instructions */}
        <div className="text-center mt-3">
          <p className="text-white/70 text-xs font-medium flex items-center justify-center gap-2">
            <span>✏️</span>
            Trace the grey letter with your finger
            <span>✨</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FullScreenDraw;