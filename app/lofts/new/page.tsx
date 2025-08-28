import { getOwners } from "@/app/actions/owners"
import { getZoneAreas } from "@/app/actions/zone-areas"
import { getInternetConnectionTypes } from "@/app/actions/internet-connections"
import { NewLoftFormWrapper } from "./new-loft-form"
import { getTranslations } from "@/lib/i18n/server"
import { cookies } from "next/headers"

export default async function NewLoftPage() {
  try {
    // Get language from cookies or default to 'fr'
    const cookieStore = await cookies();
    const languageCookie = cookieStore.get('language');
    const lang = languageCookie?.value && ['en', 'fr', 'ar'].includes(languageCookie.value)
      ? languageCookie.value
      : 'fr';

    const [owners, zoneAreas, i18n, internetConnectionResult] = await Promise.all([
      getOwners(),
      getZoneAreas(),
      getTranslations(lang, ['lofts', 'common']),
      getInternetConnectionTypes().catch(() => ({ data: [], error: null }))
    ])

    const t = i18n.t.bind(i18n)
    const internetConnectionTypes = internetConnectionResult?.data || []

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            {t('lofts.createNewLoft')}
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {t('lofts.addNewPropertyListing')}
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <NewLoftFormWrapper
            owners={owners}
            zoneAreas={zoneAreas}
            internetConnectionTypes={internetConnectionTypes}
            translations={{
              loftCreatedSuccess: t('lofts.loftCreatedSuccess'),
              loftCreatedSuccessDescription: t('lofts.loftCreatedSuccessDescription'),
              errorCreatingLoft: t('lofts.errorCreatingLoft'),
              errorCreatingLoftDescription: t('lofts.errorCreatingLoftDescription'),
              systemError: t('lofts.systemError'),
              systemErrorDescription: t('lofts.systemErrorDescription'),
            }}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in NewLoftPage:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Page</h1>
          <p className="text-gray-600 mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }
}
