import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// Configuration améliorée pour résoudre les problèmes de traduction
i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'fr', 'ar'],
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    ns: [
      'common',
      'lofts',
      'bills',
      'dashboard',
      'executive',
      'notifications',
      'paymentMethods',
      'reports',
      'reservations',
      'tasks',
      'teams',
      'unauthorized',
      'transactions',
      'nav',
      'auth',
      'settings',
      'owners',
      'conversations',
      'analytics',
      'landing',
      'internetConnections',
      'zoneAreas',
      'theme',
      'testSound',
      'testTranslations'
    ],
    defaultNS: 'common',
    nsSeparator: ':',
    keySeparator: '.',
    detection: {
      order: ['path', 'cookie', 'htmlTag', 'localStorage', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    }
    // Amélioration de la gestion des clés manquantes
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} in namespace: ${ns} for language: ${lng}`);
      }
      return fallbackValue || key;
    },
  });

export default i18n;