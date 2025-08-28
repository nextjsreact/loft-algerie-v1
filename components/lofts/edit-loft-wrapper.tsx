"use client"

import { useTranslation } from "@/lib/i18n/context"
import { EditLoftClientPage } from "@/app/lofts/[id]/edit/edit-loft-client-page"

interface EditLoftWrapperProps {
  loft: any
  owners: any[]
  zoneAreas: any[]
  internetConnectionTypes: any[]
}

export function EditLoftWrapper({ 
  loft, 
  owners, 
  zoneAreas, 
  internetConnectionTypes 
}: EditLoftWrapperProps) {
  const { t } = useTranslation(["common", "lofts"]);

  const translations = {
    editLoft: t('lofts:editLoft'),
    updatePropertyDetails: t('lofts:updatePropertyDetails'),
    loftUpdated: t('lofts:loftUpdated'),
    error: t('common:error'),
  };

  return (
    <EditLoftClientPage
      loft={loft}
      owners={owners}
      zoneAreas={zoneAreas}
      internetConnectionTypes={internetConnectionTypes}
      translations={translations}
    />
  )
}