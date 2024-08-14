import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './components/ui/Settingboard/language/locales/en.json';
import es from './components/ui/Settingboard/language/locales/vi.json';

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Mặc định ngôn ngữ
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
