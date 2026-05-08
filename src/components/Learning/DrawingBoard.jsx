import React, { useRef, useState, useEffect } from 'react';

const DrawingBoard = ({ targetLetter, onLetterComplete }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [showStar, setShowStar] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    setCtx(context);
    canvas.width = 600;
    canvas.height = 400;
    
    // Set background
    context.fillStyle = '#FFF9C4';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set drawing style
    context.strokeStyle = '#2563eb';
    context.lineWidth = 8;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    // Draw suggestion
    drawSuggestion(context, targetLetter);
    
    const currentCanvas = canvas;
    return () => {
      if (currentCanvas) {
        const oldContext = currentCanvas.getContext('2d');
        if (oldContext) {
          oldContext.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
        }
      }
    };
  }, [targetLetter]);

  const drawSuggestion = (context, letter) => {
    if (!context) return;
    
    context.save();
    context.globalAlpha = 0.2;
    context.font = 'bold 180px "Comic Sans MS", cursive';
    context.fillStyle = '#9CA3AF';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(letter, canvasRef.current?.width / 2 || 300, canvasRef.current?.height / 2 || 200);
    context.restore();
    
    // Draw starting point
    context.beginPath();
    context.arc((canvasRef.current?.width / 2 || 300) - 80, (canvasRef.current?.height / 2 || 200) - 50, 15, 0, 2 * Math.PI);
    context.fillStyle = '#22c55e';
    context.fill();
    context.fillStyle = 'white';
    context.font = 'bold 14px sans-serif';
    context.fillText('START', (canvasRef.current?.width / 2 || 300) - 110, (canvasRef.current?.height / 2 || 200) - 45);
  };

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

  const startDrawing = (e) => {
    if (completed) return;
    setIsDrawing(true);
    const pos = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing || completed) return;
    const pos = getCoordinates(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setDrawingPoints(prev => prev + 1);
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

  const stopDrawing = () => {
    if (!isDrawing || completed) {
      setIsDrawing(false);
      return;
    }
    
    setIsDrawing(false);
    ctx.beginPath();
    
    // Check if drawing has enough strokes
    if (drawingPoints > 50) {
      setCompleted(true);
      setShowStar(true);
      playSuccessSound();
      
      if (onLetterComplete) {
        onLetterComplete(targetLetter);
      }
      
      setTimeout(() => {
        setShowStar(false);
      }, 2000);
    } else if (drawingPoints > 10) {
      playTryAgainSound();
      setTimeout(() => {
        clearCanvas();
        setDrawingPoints(0);
      }, 1500);
    }
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.fillStyle = '#FFF9C4';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawSuggestion(ctx, targetLetter);
    setDrawingPoints(0);
  };

  const playLetterSound = () => {
    const utterance = new SpeechSynthesisUtterance(targetLetter);
    utterance.lang = /[A-Za-z]/.test(targetLetter) ? 'en-US' : 'hi-IN';
    utterance.rate = 0.7;
    utterance.pitch = 1.3;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl shadow-2xl p-6">
      {/* Big Letter Display */}
      <div className="text-center mb-4">
        <div className="bg-white rounded-xl p-4 shadow-lg inline-block">
          <span className="text-8xl font-bold text-purple-600">{targetLetter}</span>
        </div>
        <button
          onClick={playLetterSound}
          className="ml-4 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg text-2xl"
        >
          🔊
        </button>
      </div>

      {/* Drawing Board */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-purple-400 rounded-2xl cursor-crosshair shadow-lg w-full bg-yellow-50"
          style={{ height: '400px', backgroundColor: '#FFF9C4' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {/* Star Animation */}
        {showStar && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
            <span className="text-6xl">⭐🎉</span>
          </div>
        )}
      </div>

      {/* Instructions and Buttons */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-left">
          <p className="text-gray-600 text-sm">
            ✏️ Trace the letter with your finger or mouse
          </p>
          <p className="text-gray-500 text-xs mt-1">
            🎵 Complete the letter to hear "Good job! Next alphabet!"
          </p>
        </div>
        <button
          onClick={clearCanvas}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg"
        >
          🧹 Clear & Try Again
        </button>
      </div>
    </div>
  );
};

export default DrawingBoard;