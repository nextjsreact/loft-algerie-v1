"use client"

import * as React from "react"
import type { LoftWithRelations, LoftOwner, ZoneArea, LoftStatus } from "@/lib/types"
import { deleteLoft } from "@/app/actions/lofts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useTranslation } from 'react-i18next'
import { Home, Users, MapPin, TrendingUp, Eye, Edit, Trash2 } from "lucide-react"

interface LoftsListProps {
  lofts: LoftWithRelations[]
  owners: LoftOwner[]
  zoneAreas: ZoneArea[]
  isAdmin: boolean
}

const LOFT_STATUSES: LoftStatus[] = ["available", "occupied", "maintenance"]

// Fonction pour traduire les descriptions des lofts
const getTranslatedDescription = (originalDescription: string, loftName: string, t: any) => {
  const descriptionMap: Record<string, string> = {
    'Profitez avec toute la famille dans cet appartement confortable, calme, avec une magnifique vue panoramique': 'lofts:descriptions.heavenLoft',
    'Oubliez vos soucis dans ce logement spacieux et serein. Il offre une vue panoramique sur la forêt. Situé dans une résidence fermée et gardée avec un stationnement sécurisé.': 'lofts:descriptions.aidaLoft',
    'Logement paisible offrant un séjour détente pour toute la famille. Il est situé en face la forêt de Bainem vue panoramique. La résidence est gardée et sécurisée. Le stationnement est disponible à l\'intérieure de la résidence.': 'lofts:descriptions.nadaLoft',
    'Loft moderne avec vue sur la baie d\'Alger': 'lofts:descriptions.modernCenterAlger',
    'Studio haut de gamme dans le quartier d\'Hydra': 'lofts:descriptions.studioHydraPremium',
    'Loft adapté aux étudiants, proche de l\'université': 'lofts:descriptions.loftStudentBabEzzouar',
    'Penthouse avec vue panoramique sur la mer': 'lofts:descriptions.penthouseOranSeaView',
    'Loft spacieux pour famille, quartier calme': 'lofts:descriptions.familyLoftConstantine'
  }
  
  const translationKey = descriptionMap[originalDescription]
  return translationKey ? t(translationKey) : originalDescription
}

export function LoftsList({ lofts, owners, zoneAreas, isAdmin }: LoftsListProps) {
  const { t } = useTranslation(["common", "lofts"])
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [ownerFilter, setOwnerFilter] = React.useState<string>("all")
  const [zoneAreaFilter, setZoneAreaFilter] = React.useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "occupied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const filteredLofts = lofts.filter((loft) => {
    const statusMatch = statusFilter === "all" || loft.status === statusFilter
    const ownerMatch = ownerFilter === "all" || loft.owner_id === ownerFilter
    const zoneAreaMatch = zoneAreaFilter === "all" || loft.zone_area_id === zoneAreaFilter
    return statusMatch && ownerMatch && zoneAreaMatch
  })

  const statusTranslationKeys = {
    available: "lofts:status.available",
    occupied: "lofts:status.occupied",
    maintenance: "lofts:status.maintenance",
  };

  return (
    <>
      {/* Section des filtres avec style amélioré */}
      <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          {t('lofts:filterTitle')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="status-filter" className="text-sm font-medium text-gray-700 flex items-center">
              <Home className="w-4 h-4 mr-2 text-blue-500" />
              {t('lofts:filterByStatus')}
            </Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter" className="bg-white border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors">
                <SelectValue placeholder={t('lofts:allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('lofts:allStatuses')}</SelectItem>
                {LOFT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status} className="capitalize">
                    {t(statusTranslationKeys[status])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="owner-filter" className="text-sm font-medium text-gray-700 flex items-center">
              <Users className="w-4 h-4 mr-2 text-green-500" />
              {t('lofts:filterByOwner')}
            </Label>
            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger id="owner-filter" className="bg-white border-gray-300 hover:border-green-400 focus:border-green-500 transition-colors">
                <SelectValue placeholder={t('lofts:allOwners')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('lofts:allOwners')}</SelectItem>
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zone-area-filter" className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-purple-500" />
              {t('lofts:filterByZoneArea')}
            </Label>
            <Select value={zoneAreaFilter} onValueChange={setZoneAreaFilter}>
              <SelectTrigger id="zone-area-filter" className="bg-white border-gray-300 hover:border-purple-400 focus:border-purple-500 transition-colors">
                <SelectValue placeholder={t('lofts:allZoneAreas')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('lofts:allZoneAreas')}</SelectItem>
                {zoneAreas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Résumé des filtres actifs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Statut: {t(statusTranslationKeys[statusFilter as LoftStatus])}
            </Badge>
          )}
          {ownerFilter !== "all" && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Propriétaire: {owners.find(o => o.id === ownerFilter)?.name}
            </Badge>
          )}
          {zoneAreaFilter !== "all" && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Zone: {zoneAreas.find(z => z.id === zoneAreaFilter)?.name}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredLofts.map((loft) => (
          <Card key={loft.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 overflow-hidden">
            {/* Image placeholder avec gradient */}
            <div className="h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-4 right-4">
                <Badge className={`${getStatusColor(loft.status)} shadow-lg backdrop-blur-sm`}>
                  {t(statusTranslationKeys[loft.status])}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-1 drop-shadow-lg">{loft.name}</h3>
                <p className="text-sm opacity-90 drop-shadow">{loft.address}</p>
              </div>
              {/* Icône de maison */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
                <Home className="w-24 h-24 text-white" />
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Prix en vedette */}
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <p className="text-sm text-green-600 font-medium">{t('lofts:pricePerMonth')}</p>
                  <p className="text-2xl font-bold text-green-700">{loft.price_per_month?.toLocaleString()} DA</p>
                </div>

                {/* Informations détaillées */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {t('lofts:owner')}
                    </span>
                    <span className="font-medium text-gray-800">{loft.owner_name || t('lofts:unknown')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {t('lofts:zoneArea')}
                    </span>
                    <span className="font-medium text-gray-800">{loft.zone_area_name || "N/A"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {t('lofts:companyShare')}
                    </span>
                    <span className="font-medium text-gray-800">{loft.company_percentage}%</span>
                  </div>
                </div>

                {loft.description && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 line-clamp-2">{getTranslatedDescription(loft.description, loft.name, t)}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                <Button variant="default" size="sm" asChild className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Link href={`/lofts/${loft.id}`} className="flex items-center justify-center">
                    <Eye className="w-4 h-4 mr-2" />
                    {t('common:view')}
                  </Link>
                </Button>
                {isAdmin && (
                  <>
                    <Button variant="outline" size="sm" asChild className="hover:bg-blue-50">
                      <Link href={`/lofts/${loft.id}/edit`} className="flex items-center justify-center">
                        <Edit className="w-4 h-4 mr-1" />
                        {t('common:edit')}
                      </Link>
                    </Button>
                    <form
                      action={async () => {
                        if (confirm(t('lofts:deleteConfirm', { loftName: loft.name }))) {
                          await deleteLoft(loft.id)
                        }
                      }}
                    >
                      <Button variant="destructive" size="sm" type="submit" className="hover:bg-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredLofts.length === 0 && (
          <div className="col-span-full">
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center">
                  <Home className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('lofts:noLoftsFound')}</h3>
                <p className="text-gray-500 mb-6">
                  {t('lofts:noLoftsMatch')}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStatusFilter("all")
                    setOwnerFilter("all")
                    setZoneAreaFilter("all")
                  }}
                  className="hover:bg-blue-50"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}