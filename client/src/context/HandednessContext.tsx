import React, { createContext, useContext, useState, useEffect } from 'react';

type Handedness = 'right' | 'left';

interface HandednessContextType {
  handedness: Handedness;
  toggleHandedness: () => void;
}

const HandednessContext = createContext<HandednessContextType | undefined>(undefined);

export const HandednessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handedness, setHandedness] = useState<Handedness>(() => {
    const saved = localStorage.getItem('handedness');
    return saved === 'left' ? 'left' : 'right';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (handedness === 'left') {
      root.classList.add('handedness-left');
      root.classList.remove('handedness-right');
    } else {
      root.classList.add('handedness-right');
      root.classList.remove('handedness-left');
    }
    localStorage.setItem('handedness', handedness);
  }, [handedness]);

  const toggleHandedness = () => {
    setHandedness((prev) => (prev === 'right' ? 'left' : 'right'));
  };

  return (
    <HandednessContext.Provider value={{ handedness, toggleHandedness }}>
      {children}
    </HandednessContext.Provider>
  );
};

export const useHandedness = () => {
  const context = useContext(HandednessContext);
  if (!context) {
    throw new Error('useHandedness must be used within a HandednessProvider');
  }
  return context;
};
