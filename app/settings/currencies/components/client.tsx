"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, DollarSign, Star, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { getColumns } from "../columns"
import { Currency } from "@/lib/types"
import { useTranslation } from "react-i18next"

interface CurrencyClientProps {
  data: Currency[]
  onSetDefault: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export const CurrencyClient = ({ data, onSetDefault, onDelete }: CurrencyClientProps) => {
  const { t } = useTranslation();
  const router = useRouter()

  const defaultCurrency = data.find(currency => currency.is_default)
  const otherCurrencies = data.filter(currency => !currency.is_default)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-primary" />
            {t('nav.currencies')}
          </h1>
          <p className="text-muted-foreground">{t('settings.currencies.subtitle')}</p>
        </div>
        <Button onClick={() => router.push("/settings/currencies/new")} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          {t('settings.currencies.addNew')}
        </Button>
      </div>

      {/* Default Currency Card */}
      {defaultCurrency && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent hover:shadow-xl transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-primary">
              <div className="p-2 rounded-full bg-primary/10 animate-pulse">
                <Star className="h-5 w-5" />
              </div>
              {t('settings.currencies.defaultCurrency')}
            </CardTitle>
            <CardDescription className="text-primary/70">
              {t('settings.currencies.defaultCurrencyDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                  <DollarSign className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">{defaultCurrency.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {defaultCurrency.code} • {defaultCurrency.symbol}
                  </p>
                </div>
              </div>
              <Badge variant="default" className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 px-4 py-2">
                <Star className="h-3 w-3 mr-1" />
                {t('settings.currencies.default')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Currencies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('settings.currencies.allCurrencies')}
          </CardTitle>
          <CardDescription>
            {t('settings.currencies.totalCurrencies', { count: data.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">
                {t('settings.currencies.noCurrenciesFound')}
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                {t('settings.currencies.addFirstCurrency')}
              </p>
              <Button onClick={() => router.push("/settings/currencies/new")}>
                <Plus className="mr-2 h-4 w-4" />
                {t('settings.currencies.addNew')}
              </Button>
            </div>
          ) : (
            <DataTable 
              key={data.length} 
              columns={getColumns(onSetDefault, onDelete, router, t)} 
              data={data} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
