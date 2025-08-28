export function getOptions(lng = 'fr', ns = ['common', 'auth', 'landing', 'bills', 'lofts', 'owners', 'teams', 'reservations', 'transactions', 'analytics', 'conversations', 'dashboard', 'executive', 'internetConnections', 'nav', 'notifications', 'paymentMethods', 'reports', 'settings', 'tasks', 'test', 'testSound', 'testTranslations', 'theme', 'unauthorized', 'zoneAreas', 'photos', 'availability']) {
  return {
    debug: true,
    supportedLngs: ['en', 'fr', 'ar'],
    fallbackLng: 'fr',
    lng,
    fallbackNS: 'common',
    defaultNS: 'common',
    ns,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Generic path, will be overridden for server
      requestOptions: {
        cache: process.env.NODE_ENV === 'production' ? 'default' : 'no-cache',
      },
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    }
  }
}