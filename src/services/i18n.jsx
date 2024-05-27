import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './localization/en/en'
import ar from './localization/ar/ar'
import me from './localization/me/me'
import hi from './localization/hi/hi'
// const availableLanguages = ['en', 'ar']

const option = {
  order: ['navigator', 'htmltag', 'path', 'subdomail'],
  checkWhiteList: true
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      me: {
        translation: me
      },
      ar: {
        translation: ar
      },
      hi: {
        translation: hi
      },
    },
    fallbackLng: 'en',
    debug: true,
    // whitelist: availableLanguages,
    detection: option,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });


export default i18n;