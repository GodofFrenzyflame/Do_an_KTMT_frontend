// AppContext.js
import React, { createContext, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './components/ui/Settingboard/language/locales/en.json';
import vi from './components/ui/Settingboard/language/locales/vi.json';

// Khởi tạo i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    lng: 'en', // Ngôn ngữ mặc định
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [settings, setSettings] = useState({ color: 'light', language: 'en' });

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    i18n.changeLanguage(newSettings.language); // Cập nhật ngôn ngữ trong i18n
  };

  return (
    <AppContext.Provider value={{ settings, setSettings: handleSettingsChange }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
