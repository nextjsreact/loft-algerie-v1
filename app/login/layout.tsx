import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../../styles/settings-animations.css"
import "./globals.css"
import { I18nProvider } from "@/lib/i18n/context"
import { cookies } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Loft Algérie - Connexion",
  description: "Connectez-vous à votre compte Loft Algérie",
}

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get language from cookies or default to 'fr'
  const cookieStore = await cookies()
  const languageCookie = cookieStore.get('language')
  const lang = languageCookie?.value && ['en', 'fr', 'ar'].includes(languageCookie.value) 
    ? languageCookie.value 
    : 'fr'

  return (
    <I18nProvider lang={lang}>
      {children}
    </I18nProvider>
  )
}