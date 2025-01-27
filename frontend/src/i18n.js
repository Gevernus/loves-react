import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslations },
            ru: { translation: ruTranslations }
        },
        lng: localStorage.getItem('i18nextLng') || 'ru',
        fallbackLng: 'en', // fallback language
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;