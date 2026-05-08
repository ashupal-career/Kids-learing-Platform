import React from 'react';

const SoundButton = ({ text, lang = 'en', type = 'alphabet' }) => {
  
  const playSound = () => {
    // Cancel any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    let utterance;
    let speakText = '';
    
    // Hindi Alphabets (अ से ज्ञ तक)
    if (lang === 'hi' && type === 'alphabet') {
      const hindiMap = {
        'अ': 'अ', 'आ': 'आ', 'इ': 'इ', 'ई': 'ई', 'उ': 'उ', 'ऊ': 'ऊ',
        'ऋ': 'ऋ', 'ए': 'ए', 'ऐ': 'ऐ', 'ओ': 'ओ', 'औ': 'औ', 'अं': 'अं',
        'अः': 'अः', 'क': 'क', 'ख': 'ख', 'ग': 'ग', 'घ': 'घ', 'ङ': 'ङ',
        'च': 'च', 'छ': 'छ', 'ज': 'ज', 'झ': 'झ', 'ञ': 'ञ', 'ट': 'ट',
        'ठ': 'ठ', 'ड': 'ड', 'ढ': 'ढ', 'ण': 'ण', 'त': 'त', 'थ': 'थ',
        'द': 'द', 'ध': 'ध', 'न': 'न', 'प': 'प', 'फ': 'फ', 'ब': 'ब',
        'भ': 'भ', 'म': 'म', 'य': 'य', 'र': 'र', 'ल': 'ल', 'व': 'व',
        'श': 'श', 'ष': 'ष', 'स': 'स', 'ह': 'ह', 'क्ष': 'क्ष', 'त्र': 'त्र',
        'ज्ञ': 'ज्ञ', 'श्र': 'श्र'
      };
      speakText = hindiMap[text] || text;
      utterance = new SpeechSynthesisUtterance(speakText);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.7;
      utterance.pitch = 1.1;
    }
    
    // English Alphabets (A to Z)
    else if (lang === 'en' && type === 'alphabet' && text.length === 1) {
      const englishMap = {
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
      speakText = englishMap[text.toUpperCase()] || text;
      utterance = new SpeechSynthesisUtterance(speakText);
      utterance.lang = 'en-US';
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
    }
    
    // Numbers (1 to 1000)
    else if (lang === 'en' && type === 'number') {
      speakText = getNumberWords(text);
      utterance = new SpeechSynthesisUtterance(speakText);
      utterance.lang = 'en-US';
      utterance.rate = 0.7;
      utterance.pitch = 1.1;
    }
    
    // Default (words, spelling, etc.)
    else {
      speakText = text;
      utterance = new SpeechSynthesisUtterance(speakText);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.7;
      utterance.pitch = 1.1;
    }
    
    // Small delay to ensure cancel is processed
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  };
  
  // Number to words converter (1 to 1000)
  const getNumberWords = (num) => {
    const number = parseInt(num);
    
    if (isNaN(number)) return num;
    
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    if (number === 0) return 'zero';
    if (number === 1000) return 'one thousand';
    
    if (number < 10) return ones[number];
    if (number < 20) return teens[number - 10];
    if (number < 100) {
      const ten = Math.floor(number / 10);
      const one = number % 10;
      return tens[ten] + (one ? ' ' + ones[one] : '');
    }
    if (number < 1000) {
      const hundred = Math.floor(number / 100);
      const remainder = number % 100;
      if (remainder === 0) {
        return ones[hundred] + ' hundred';
      } else {
        return ones[hundred] + ' hundred ' + getNumberWords(remainder);
      }
    }
    return number.toString();
  };
  
  return (
    <button
      onClick={playSound}
      className="bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg text-xl md:text-2xl"
      title="Click to hear the sound"
      aria-label="Play sound"
    >
      🔊
    </button>
  );
};

export default SoundButton;