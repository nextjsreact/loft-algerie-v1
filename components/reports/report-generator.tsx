'use client'

/**
 * COMPOSANT DE GÉNÉRATION DE RAPPORTS
 * ===================================
 * 
 * Interface utilisateur pour générer des rapports PDF
 * Supporte les rapports par loft, par propriétaire, et globaux
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// Temporarily removing Select components to fix Radix errors
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarIcon, FileText, Download, TrendingUp, TrendingDown, DollarSign, Hash } from 'lucide-react'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useReports, type ReportFilters } from '@/hooks/use-reports'
import { useTranslation } from '@/lib/i18n/context'
import { toast } from 'sonner'

interface QuickStats {
  totalIncome: number
  totalExpenses: number
  netResult: number
  transactionCount: number
}

export function ReportGenerator() {
  const { t } = useTranslation(['reports', 'common'])
  const {
    isLoading,
    error,
    generateLoftReport,
    generateOwnerReport,
    generateGlobalReport,
    getQuickStats,
    fetchLofts,
    fetchOwners
  } = useReports()

  // États pour les données
  const [lofts, setLofts] = useState<any[]>([])
  const [owners, setOwners] = useState<any[]>([])
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null)

  // États pour les filtres
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    transactionType: 'all'
  })

  // États pour les options de rapport
  const [reportOptions, setReportOptions] = useState({
    includeDetails: true,
    includeSummary: true,
    groupBy: 'category'
  })

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loftsData, ownersData] = await Promise.all([
          fetchLofts(),
          fetchOwners()
        ])
        setLofts(loftsData)
        setOwners(ownersData)
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err)
        toast.error(t('common:error'))
      }
    }

    loadData()
  }, [fetchLofts, fetchOwners])

  // Mettre à jour les statistiques quand les filtres changent
  useEffect(() => {
    const updateStats = async () => {
      try {
        const stats = await getQuickStats(filters)
        setQuickStats(stats)
      } catch (err) {
        console.error('Erreur lors du calcul des statistiques:', err)
      }
    }

    updateStats()
  }, [filters, getQuickStats])

  // Gestionnaires d'événements
  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleQuickDateRange = (range: string) => {
    const now = new Date()
    let startDate: Date
    let endDate: Date = now

    switch (range) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
        break
      case 'week':
        startDate = subDays(now, 7)
        break
      case 'month':
        startDate = startOfMonth(now)
        endDate = endOfMonth(now)
        break
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        startDate = quarterStart
        endDate = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), 11, 31)
        break
      default:
        return
    }

    setFilters(prev => ({ ...prev, startDate, endDate }))
  }

  const handleGenerateReport = async (type: 'loft' | 'owner' | 'global', id?: string) => {
    try {
      switch (type) {
        case 'loft':
          if (!id) {
            toast.error(t('reports:selectLoftError'))
            return
          }
          await generateLoftReport(id, filters, reportOptions)
          break
        case 'owner':
          if (!id) {
            toast.error(t('reports:selectOwnerError'))
            return
          }
          await generateOwnerReport(id, filters, reportOptions)
          break
        case 'global':
          await generateGlobalReport(filters, reportOptions)
          break
      }
    } catch (err) {
      console.error('Erreur lors de la génération du rapport:', err)
    }
  }

  return (
    <div className="space-y-8">
      {/* En-tête amélioré */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
          <FileText className="w-4 h-4" />
          {t('reports:pdfGeneration')}
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          {t('reports:financialReports')}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('reports:generateDetailedReports')}
        </p>
      </div>

      {/* Statistiques rapides améliorées */}
      {quickStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">{t('reports:revenue')}</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {quickStats.totalIncome.toLocaleString()} DA
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-800/30 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">{t('reports:expenses')}</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {quickStats.totalExpenses.toLocaleString()} DA
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-800/30 rounded-full">
                  <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('reports:netResult')}</p>
                  <p className={`text-2xl font-bold ${quickStats.netResult >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {quickStats.netResult.toLocaleString()} DA
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-800/30 rounded-full">
                  <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">{t('reports:transactionsCount')}</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {quickStats.transactionCount}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-800/30 rounded-full">
                  <Hash className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filtres améliorés */}
        <Card className="lg:col-span-1 bg-gradient-to-br from-gray-50/50 to-slate-50/50 dark:from-gray-800/50 dark:to-slate-800/50 border-0 shadow-xl backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-500 to-slate-500"></div>
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
                {t('reports:reportFilters')}
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              {t('reports:configureFilters')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Période rapide */}
            <div>
              <Label className="text-sm font-medium">{t('reports:quickPeriod')}</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { key: 'today', label: t('reports:today') },
                  { key: 'week', label: t('reports:sevenDays') },
                  { key: 'month', label: t('reports:thisMonth') },
                  { key: 'quarter', label: t('reports:quarter') },
                  { key: 'year', label: t('reports:thisYear') }
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickDateRange(key)}
                    className="hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Dates personnalisées */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="startDate">{t('reports:startDate')}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={format(filters.startDate, 'yyyy-MM-dd')}
                  onChange={(e) => handleFilterChange('startDate', new Date(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="endDate">{t('reports:endDate')}</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={format(filters.endDate, 'yyyy-MM-dd')}
                  onChange={(e) => handleFilterChange('endDate', new Date(e.target.value))}
                />
              </div>
            </div>

            <Separator />

            {/* Type de transaction */}
            <div>
              <Label>{t('reports:transactionType')}</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={filters.transactionType}
                onChange={(e) => handleFilterChange('transactionType', e.target.value)}
              >
                <option value="all">{t('reports:allTransactions')}</option>
                <option value="income">{t('reports:revenueOnly')}</option>
                <option value="expense">{t('reports:expensesOnly')}</option>
              </select>
            </div>

            {/* Catégorie */}
            <div>
              <Label>{t('reports:category')}</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              >
                <option value="">{t('reports:allCategories')}</option>
                <option value="rent">{t('reports:rent')}</option>
                <option value="maintenance">{t('reports:maintenance')}</option>
                <option value="utilities">{t('reports:utilities')}</option>
                <option value="insurance">{t('reports:insurance')}</option>
                <option value="taxes">{t('reports:taxes')}</option>
                <option value="other">{t('reports:other')}</option>
              </select>
            </div>

            <Separator />

            {/* Options du rapport */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">{t('reports:reportOptions')}</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeDetails"
                  checked={reportOptions.includeDetails}
                  onCheckedChange={(checked) => 
                    setReportOptions(prev => ({ ...prev, includeDetails: !!checked }))
                  }
                />
                <Label htmlFor="includeDetails" className="text-sm">
                  {t('reports:includeDetails')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeSummary"
                  checked={reportOptions.includeSummary}
                  onCheckedChange={(checked) => 
                    setReportOptions(prev => ({ ...prev, includeSummary: !!checked }))
                  }
                />
                <Label htmlFor="includeSummary" className="text-sm">
                  {t('reports:includeSummary')}
                </Label>
              </div>

              <div>
                <Label className="text-sm">{t('reports:groupBy')}</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={reportOptions.groupBy}
                  onChange={(e) => 
                    setReportOptions(prev => ({ ...prev, groupBy: e.target.value }))
                  }
                >
                  <option value="category">{t('reports:groupByCategory')}</option>
                  <option value="loft">{t('reports:groupByLoft')}</option>
                  <option value="month">{t('reports:groupByMonth')}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Génération de rapports */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('reports:generateReports')}</CardTitle>
            <CardDescription>
              {t('reports:chooseReportType')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="loft" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="loft">{t('reports:byLoft')}</TabsTrigger>
                <TabsTrigger value="owner">{t('reports:byOwner')}</TabsTrigger>
                <TabsTrigger value="global">{t('reports:globalReportTab')}</TabsTrigger>
              </TabsList>

              {/* Rapport par loft */}
              <TabsContent value="loft" className="space-y-4">
                <div>
                  <Label>{t('reports:selectLoft')}</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => setFilters(prev => ({ ...prev, loftId: e.target.value }))}
                    defaultValue=""
                  >
                    <option value="">{t('reports:chooseLoft')}</option>
                    {lofts.map((loft) => (
                      <option key={loft.id} value={loft.id}>
                        {loft.name} - {loft.owner_name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={() => handleGenerateReport('loft', filters.loftId)}
                  disabled={isLoading || !filters.loftId}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isLoading ? t('reports:generatingInProgress') : t('reports:generateLoftReport')}
                </Button>
              </TabsContent>

              {/* Rapport par propriétaire */}
              <TabsContent value="owner" className="space-y-4">
                <div>
                  <Label>{t('reports:selectOwner')}</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => setFilters(prev => ({ ...prev, ownerId: e.target.value }))}
                    defaultValue=""
                  >
                    <option value="">{t('reports:chooseOwner')}</option>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name} ({owner.lofts_count} loft{owner.lofts_count > 1 ? 's' : ''})
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={() => handleGenerateReport('owner', filters.ownerId)}
                  disabled={isLoading || !filters.ownerId}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isLoading ? t('reports:generatingInProgress') : t('reports:generateOwnerReport')}
                </Button>
              </TabsContent>

              {/* Rapport global */}
              <TabsContent value="global" className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">{t('reports:globalReport')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('reports:globalReportDescription')}
                  </p>
                </div>

                <Button
                  onClick={() => handleGenerateReport('global')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isLoading ? t('reports:generatingInProgress') : t('reports:generateGlobalReport')}
                </Button>
              </TabsContent>
            </Tabs>

            {/* Affichage des erreurs */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informations sur les rapports */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reports:aboutPdfReports')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">{t('reports:loftReportTitle')}</h4>
              <div className="text-muted-foreground whitespace-pre-line">
                {t('reports:loftReportInfo')}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">{t('reports:ownerReportTitle')}</h4>
              <div className="text-muted-foreground whitespace-pre-line">
                {t('reports:ownerReportInfo')}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">{t('reports:globalReportTitle')}</h4>
              <div className="text-muted-foreground whitespace-pre-line">
                {t('reports:globalReportInfo')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}