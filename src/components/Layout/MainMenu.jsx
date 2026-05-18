import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MainMenu = ({ onSelect }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [particles, setParticles] = useState([]);
  const [floatingStars, setFloatingStars] = useState([]);
  const [floatingBubbles, setFloatingBubbles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // New States for additional functionality
  const [showDailyTip, setShowDailyTip] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [dailyProgress, setDailyProgress] = useState(0);
  const streakDays = 3; // Fixed streak value
  const [currentTime, setCurrentTime] = useState(new Date());

  // Create floating elements
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
      color: `hsl(${Math.random() * 360}, 80%, 65%)`
    }));
    setParticles(newParticles);

    const newStars = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 15 + 8,
      duration: Math.random() * 8 + 4,
      delay: Math.random() * 3
    }));
    setFloatingStars(newStars);

    const newBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 20,
      duration: Math.random() * 12 + 6,
      delay: Math.random() * 5
    }));
    setFloatingBubbles(newBubbles);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // Auto-hide daily tip after 5 seconds
    const tipTimer = setTimeout(() => setShowDailyTip(false), 5000);
    
    // Simulate daily progress (would come from actual learning data)
    const completedToday = Math.floor(Math.random() * 5);
    setDailyProgress(completedToday);
    
    // Update time
    const timeTimer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(tipTimer);
      clearInterval(timeTimer);
    };
  }, []);

  const menuItems = [
    { id: 'english', title: 'English Alphabets', desc: 'Learn A to Z', color: 'from-blue-500 to-purple-600', icon: '🔤', sound: 'You selected English Alphabets. Let\'s learn A to Z!', stats: '26 Letters', colorCode: 'blue' },
    { id: 'hindi', title: 'Hindi Varnamala', desc: 'Learn अ to ज्ञ', color: 'from-orange-500 to-red-600', icon: '🇮🇳', sound: 'आपने हिंदी वर्णमाला चुनी। अ से ज्ञ सीखें!', stats: '50 Letters', colorCode: 'orange' },
    { id: 'numbers', title: 'Numbers', desc: 'Learn 1 to 100', color: 'from-green-500 to-teal-600', icon: '🔢', sound: 'You selected Numbers. Let\'s count from one to one hundred!', stats: '1-100', colorCode: 'green' },
    { id: 'games', title: 'Mind Games', desc: 'Play & Learn', color: 'from-pink-500 to-purple-600', icon: '🎮', sound: 'You selected Mind Games. Let\'s have fun!', stats: '4 Games', colorCode: 'pink' }
  ];

  const handleSelect = (item) => {
    if (soundEnabled) {
      const utterance = new SpeechSynthesisUtterance(item.sound);
      utterance.lang = item.id === 'hindi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => onSelect(item.id), 500);
  };

  const playHoverSound = (title) => {
    if (soundEnabled) {
      const utterance = new SpeechSynthesisUtterance(title);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      const utterance = new SpeechSynthesisUtterance('Sound enabled!');
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const dailyTips = [
    "💡 Practice 10 minutes daily for best results!",
    "🎯 You're doing great! Keep going!",
    "🌟 Every letter you learn opens new doors!",
    "📚 Reading helps build vocabulary faster!",
    "🎨 Learning with fun is the best way to remember!",
    "⭐ You are amazing! Keep learning every day!"
  ];

  const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.8 },
    visible: { 
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 12 }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20, delay: 0.2 }
    }
  };

  const footerIconVariants = {
    animate: (i) => ({
      y: [0, -8, 0],
      transition: { duration: 1.5, repeat: Infinity, delay: i * 0.15 }
    })
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(255,215,0,0)",
        "0 0 0 15px rgba(255,215,0,0.15)",
        "0 0 0 0 rgba(255,215,0,0)"
      ],
      transition: { duration: 2.5, repeat: Infinity }
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
      selectedTheme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900'
    }`}>
      
      {/* Settings Button */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => setShowSettings(!showSettings)}
        className="fixed top-4 left-4 z-30 bg-white/20 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center text-white text-xl hover:bg-white/30 transition-all"
      >
        ⚙️
      </motion.button>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-16 left-4 z-30 bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20 w-64"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-bold text-sm">Settings</h3>
            <button onClick={() => setShowSettings(false)} className="text-white/60 text-sm">✖️</button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm">🔊 Sound</span>
              <button
                onClick={toggleSound}
                className={`w-12 h-6 rounded-full transition-all ${soundEnabled ? 'bg-green-500' : 'bg-gray-500'} relative`}
              >
                <motion.div
                  animate={{ x: soundEnabled ? 24 : 0 }}
                  className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"
                />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm">🎨 Theme</span>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="bg-white/20 text-white text-sm rounded-lg px-2 py-1"
              >
                <option value="default">Default</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Animated Floating Bubbles */}
      {floatingBubbles.map((bubble) => (
        <motion.div
          key={`bubble-${bubble.id}`}
          className="absolute rounded-full bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: bubble.size,
            height: bubble.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, bubble.id % 2 === 0 ? 15 : -15, 0],
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: bubble.duration, repeat: Infinity, delay: bubble.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Animated Background Stars */}
      {floatingStars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute text-yellow-300"
          style={{ left: `${star.x}%`, top: `${star.y}%`, fontSize: star.size }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 360],
            opacity: [0.15, 0.45, 0.15]
          }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay, ease: "easeInOut" }}
        >
          ⭐
        </motion.div>
      ))}

      {/* Animated Background Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 10px ${particle.color}`
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, 25, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Parallax Effect */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="absolute top-20 left-10 text-7xl">🌈</div>
        <div className="absolute bottom-20 right-10 text-6xl">🎈</div>
        <div className="absolute top-40 right-20 text-5xl">🎨</div>
        <div className="absolute bottom-40 left-20 text-5xl">📚</div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        
        {/* Streak and Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4 mt-4"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2">
            <span className="text-yellow-400">🔥</span>
            <span className="text-white text-sm font-semibold">{streakDays} Day Streak!</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2">
            <span className="text-green-400">📊</span>
            <span className="text-white text-sm font-semibold">Today: {dailyProgress}/5 Completed</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2">
            <span className="text-blue-400">👋</span>
            <span className="text-white text-sm font-semibold">{getGreeting()}!</span>
          </div>
        </motion.div>
        
        {/* Daily Tip Notification */}
        {showDailyTip && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-20 right-4 z-30 bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-md rounded-2xl p-3 shadow-2xl max-w-xs"
          >
            <div className="flex items-start gap-2">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{randomTip}</p>
                <button 
                  onClick={() => setShowDailyTip(false)}
                  className="text-white/60 text-xs mt-1"
                >
                  Got it!
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="text-center pt-8 pb-4 px-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-yellow-500/10 via-pink-500/10 to-purple-500/10 blur-3xl"
          />
          
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-3"
          >
            <span className="text-7xl md:text-8xl drop-shadow-2xl">🌈</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            className="text-4xl md:text-6xl font-black mt-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
          >
            Kids Learning Playground
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base text-white/80 mt-2 font-medium"
          >
            ✨ Learn • Play • Draw • Have Fun! ✨
          </motion.p>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="h-0.5 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 mx-auto mt-3 rounded-full"
          />
        </motion.div>

        {/* Cards Grid */}
        <motion.div 
          className="container mx-auto px-4 py-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                onHoverStart={() => setHoveredCard(item.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative"
              >
                <motion.div
                  animate={{
                    opacity: hoveredCard === item.id ? 0.4 : 0,
                    scale: hoveredCard === item.id ? 1.02 : 0.98
                  }}
                  className={`absolute -inset-3 bg-gradient-to-r ${item.color} rounded-2xl blur-lg transition-all duration-500`}
                />
                
                <button
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => playHoverSound(item.title)}
                  className={`relative w-full bg-gradient-to-br ${item.color} rounded-2xl p-5 text-center shadow-xl cursor-pointer overflow-hidden`}
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="absolute top-2 left-2 bg-white/30 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {index + 1}
                  </motion.div>
                  
                  <motion.div
                    animate={{
                      scale: hoveredCard === item.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-6xl mb-2"
                  >
                    {item.icon}
                  </motion.div>
                  
                  <h3 className="text-base font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  
                  <p className="text-white/70 text-xs mb-2">{item.desc}</p>
                  
                  {/* Stats Badge */}
                  <div className="inline-block bg-white/20 rounded-full px-2 py-0.5 mb-2">
                    <span className="text-white text-[10px] font-semibold">{item.stats}</span>
                  </div>
                  
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: hoveredCard === item.id ? '60%' : '30%' }}
                    className="h-0.5 bg-white/30 rounded-full mx-auto mb-2"
                  />
                  
                  <motion.div
                    animate={{
                      backgroundColor: hoveredCard === item.id ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'
                    }}
                    className="rounded-full py-1 px-3 transition-all duration-300"
                  >
                    <span className="text-white text-xs font-semibold flex items-center justify-center gap-1">
                      Start Learning
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </span>
                  </motion.div>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="max-w-md mx-auto mt-4 mb-6"
        >
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(dailyProgress / 5) * 100}%` }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
            />
          </div>
          <p className="text-white/50 text-xs text-center mt-2">
            Today's Progress: {dailyProgress}/5 completed
          </p>
        </motion.div>

        {/* Daily Challenge Badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          className="flex justify-center mt-2 mb-6"
        >
          <motion.div 
            variants={pulseVariants}
            animate="animate"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full px-4 py-1.5 shadow-xl"
          >
            <span className="text-base">🏆</span>
            <span className="text-white font-semibold text-[11px] tracking-wide">Complete 5 letters today to earn a special badge!</span>
            <span className="text-base">🎯</span>
          </motion.div>
        </motion.div>

        {/* Footer Icons */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-center py-4 border-t border-white/10 mt-2"
        >
          <div className="flex justify-center items-center gap-5 text-xl mb-2">
            <motion.div custom={0} variants={footerIconVariants} animate="animate" className="text-white/40">🎨</motion.div>
            <motion.div custom={1} variants={footerIconVariants} animate="animate" className="text-white/40">✏️</motion.div>
            <motion.div custom={2} variants={footerIconVariants} animate="animate" className="text-yellow-400">⭐</motion.div>
            <motion.div custom={3} variants={footerIconVariants} animate="animate" className="text-white/40">🎮</motion.div>
            <motion.div custom={4} variants={footerIconVariants} animate="animate" className="text-white/40">🌈</motion.div>
            <motion.div custom={5} variants={footerIconVariants} animate="animate" className="text-white/40">📚</motion.div>
          </div>
          <p className="text-white/30 text-[10px] tracking-wide">
            ✨ Hover on cards | Tap to start your learning journey ✨
          </p>
          <p className="text-white/20 text-[8px] mt-1">
            🌟 Every day is a new adventure in learning! 🌟
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default MainMenu;