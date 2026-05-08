import React, { useState } from 'react';
import MainMenu from './components/Layout/MainMenu';
import LearningSection from './components/Learning/LearningSection';
import GamesMenu from './components/Games/GamesMenu';

function App() {
  const [activeSection, setActiveSection] = useState('menu'); // 'menu', 'learning', 'games'
  const [selectedMode, setSelectedMode] = useState(null);

  const handleMenuSelect = (mode) => {
    setSelectedMode(mode);
    if (mode === 'games') {
      setActiveSection('games');
    } else {
      setActiveSection('learning');
    }
  };

  const handleBack = () => {
    setActiveSection('menu');
    setSelectedMode(null);
  };

  if (activeSection === 'menu') {
    return <MainMenu onSelect={handleMenuSelect} />;
  }

  if (activeSection === 'games') {
    return <GamesMenu onBack={handleBack} />;
  }

  return <LearningSection mode={selectedMode} onBack={handleBack} />;
}

export default App