import React from 'react';

const MainMenu = ({ onSelect }) => {
  const menuItems = [
    { id: 'english', title: '🔤 English Alphabets', desc: 'Learn A to Z', color: 'from-blue-500 to-purple-500', icon: '🔤', sound: 'You selected English Alphabets. Let\'s learn A to Z!' },
    { id: 'hindi', title: '🇮🇳 Hindi Varnamala', desc: 'Learn अ to ज्ञ', color: 'from-orange-500 to-red-500', icon: '🇮🇳', sound: 'आपने हिंदी वर्णमाला चुनी। अ से ज्ञ सीखें!' },
    { id: 'numbers', title: '🔢 Numbers', desc: 'Learn 1 to 50', color: 'from-green-500 to-teal-500', icon: '🔢', sound: 'You selected Numbers. Let\'s count from one to fifty!' },
    { id: 'games', title: '🎮 Mind Games', desc: 'Play & Learn', color: 'from-pink-500 to-purple-500', icon: '🎮', sound: 'You selected Mind Games. Let\'s have fun!' }
  ];

  const handleSelect = (item) => {
    // Play selection sound
    const utterance = new SpeechSynthesisUtterance(item.sound);
    utterance.lang = item.id === 'hindi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    
    // Navigate after short delay
    setTimeout(() => {
      onSelect(item.id);
    }, 500);
  };

  const playHoverSound = (title) => {
    const utterance = new SpeechSynthesisUtterance(title);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
      {/* Animated Header */}
      <div className="text-center py-12 px-4">
        <div className="inline-block animate-bounce">
          <span className="text-7xl">🌟</span>
          <span className="text-7xl mx-3">🎨</span>
          <span className="text-7xl">📚</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mt-6 bg-gradient-to-r from-yellow-300 via-pink-300 to-white bg-clip-text text-transparent drop-shadow-2xl">
          Kids Learning Playground
        </h1>
        <p className="text-xl text-white/80 mt-3 font-semibold">✨ What would you like to learn today? ✨</p>
      </div>

      {/* Menu Grid - 4 Big Boxes */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => playHoverSound(item.title)}
              className={`bg-gradient-to-r ${item.color} rounded-3xl p-8 text-center transition-all duration-500 transform hover:scale-110 hover:rotate-1 shadow-2xl cursor-pointer`}
            >
              <div className="text-8xl mb-5 animate-pulse">{item.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
              <p className="text-white/80 text-sm">{item.desc}</p>
              <div className="mt-5 opacity-0 hover:opacity-100 transition-all duration-300">
                <span className="text-white text-sm bg-white/20 px-3 py-1 rounded-full">Click to Start →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 mt-12">
        <div className="flex justify-center gap-3 text-3xl mb-3">
          <span className="animate-bounce">✏️</span>
          <span className="animate-bounce delay-100">🔊</span>
          <span className="animate-bounce delay-200">⭐</span>
          <span className="animate-bounce delay-300">🎨</span>
          <span className="animate-bounce delay-400">🎮</span>
        </div>
        <p className="text-white/60 text-sm">✨ Hover on any card to hear, click to start learning! ✨</p>
      </footer>
    </div>
  );
};

export default MainMenu;