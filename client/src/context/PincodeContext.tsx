// src/context/PincodeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface PincodeContextType {
  pincode: string;
  setPincode: (pin: string) => void;
  clearPincode: () => void;
}

const PincodeContext = createContext<PincodeContextType | undefined>(undefined);

export const PincodeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pincode, setPincodeState] = useState<string>('');

  useEffect(() => {
    const savedPin = localStorage.getItem('pincode');
    if (savedPin) {
      setPincodeState(savedPin);
    }
  }, []);

  const setPincode = (pin: string) => {
    localStorage.setItem('pincode', pin);
    setPincodeState(pin);
  };

  const clearPincode = () => {
    localStorage.removeItem('pincode');
    setPincodeState('');
  };

  return (
    <PincodeContext.Provider value={{ pincode, setPincode, clearPincode }}>
      {children}
    </PincodeContext.Provider>
  );
};

export const usePincode = () => {
  const context = useContext(PincodeContext);
  if (!context) {
    throw new Error('usePincode must be used within a PincodeProvider');
  }
  return context;
};
