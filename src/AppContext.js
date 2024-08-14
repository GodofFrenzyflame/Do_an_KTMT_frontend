import React, { createContext, useState } from 'react';

// Tạo context
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    color: 'light',
    language: 'en'
  });

  return (
    <AppContext.Provider value={{ settings, setSettings }}>
      {children}
    </AppContext.Provider>
  );
};
