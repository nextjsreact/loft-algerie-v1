import { requireRole } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getTranslations } from "@/lib/i18n/server"
import { cookies } from "next/headers"

export default async function IntegrationsPage() {
  await requireRole(["admin"])
  
  // Get language from cookies or default to 'fr'
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get('language');
  const lang = languageCookie?.value && ['en', 'fr', 'ar'].includes(languageCookie.value)
    ? languageCookie.value
    : 'fr';

  const i18n = await getTranslations(lang, ['settings', 'common'])
  const t = i18n.t.bind(i18n)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('settings.integrations.title')}</h1>
          <p className="text-muted-foreground">{t('settings.integrations.subtitle')}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.integrations.airbnbTitle')}</CardTitle>
          <CardDescription>{t('settings.integrations.airbnbDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/api/auth/airbnb">{t('settings.integrations.connectToAirbnb')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
