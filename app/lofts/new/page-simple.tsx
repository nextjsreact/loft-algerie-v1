import { getTranslations } from "@/lib/i18n/server"
import { cookies } from "next/headers"

export default async function NewLoftPageSimple() {
  // Get language from cookies or default to 'fr'
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get('language');
  const lang = languageCookie?.value && ['en', 'fr', 'ar'].includes(languageCookie.value)
    ? languageCookie.value
    : 'fr';

  const i18n = await getTranslations(lang, ['lofts', 'common'])
  const t = i18n.t.bind(i18n)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          {t('lofts.createNewLoft')}
        </h1>
        <p className="mt-3 text-gray-500">
          Simple test page
        </p>
      </div>
    </div>
  )
}