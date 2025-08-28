'use client'

import { I18nextProvider, initReactI18next } from 'react-i18next'
import { createInstance } from 'i18next'
import { ReactNode } from 'react'

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources
}: {
  children: ReactNode,
  locale: string,
  namespaces: string[],
  resources: any
}) {
  const i18n = createInstance()

  i18n
    .use(initReactI18next)
    .init({
      lng: locale,
      resources,
      fallbackLng: 'fr',
      defaultNS: namespaces[0],
    })

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}