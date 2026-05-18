import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const Confetti = ({ trigger, onComplete }) => {
  useEffect(() => {
    if (trigger) {
      // Celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
      });
      
      // Second burst after 200ms
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 100,
          origin: { y: 0.6, x: 0.3 },
          startVelocity: 25,
        });
      }, 200);
      
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    }
  }, [trigger, onComplete]);

  return null;
};

export default Confetti;