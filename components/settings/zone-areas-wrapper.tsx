"use client"

import { useTranslation } from "@/lib/i18n/context"
import ZoneAreasClientWrapper from "@/app/settings/zone-areas/zone-areas-client-wrapper"
import type { ZoneArea } from "@/app/actions/zone-areas"

interface ZoneAreasWrapperProps {
  initialZoneAreas: ZoneArea[]
}

export function ZoneAreasWrapper({ initialZoneAreas }: ZoneAreasWrapperProps) {
  const { t } = useTranslation(["common", "settings", "zoneAreas"]);

  const translations = {
    pageTitle: t('nav.zoneAreas'),
    subtitle: t('zoneAreas.subtitle'),
    addNew: t('settings.zoneAreas.addNew'),
    updateZoneArea: t('zoneAreas.updateZoneArea'),
    createZoneArea: t('zoneAreas.createZoneArea'),
    updateZoneAreaInfo: t('settings.zoneAreas.updateZoneAreaInfo'),
    createNewZoneArea: t('settings.zoneAreas.createNewZoneArea'),
    existingZoneAreas: t('settings.zoneAreas.existingZoneAreas'),
    totalZoneAreas: t('settings.zoneAreas.totalZoneAreas'),
    noZoneAreasFound: t('settings.zoneAreas.noZoneAreasFound'),
    addFirstZoneArea: t('settings.zoneAreas.addFirstZoneArea'),
    success: t('common.success'),
    error: t('common.error'),
    updateSuccess: t('zoneAreas.updateSuccess'),
    createSuccess: t('zoneAreas.createSuccess'),
    refreshError: t('settings.zoneAreas.refreshError'),
  };

  return (
    <ZoneAreasClientWrapper
      initialZoneAreas={initialZoneAreas}
      translations={translations}
    />
  )
}