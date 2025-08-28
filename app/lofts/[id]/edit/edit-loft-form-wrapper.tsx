"use client"

import { useRouter } from "next/navigation"
import { LoftForm } from "@/components/forms/loft-form"
import { updateLoft } from "@/app/actions/lofts"
import { toast } from "sonner"
import { useTranslation } from "@/lib/i18n/context"

export function EditLoftFormWrapper({ loft, owners, zoneAreas, internetConnectionTypes }: any) {
  const router = useRouter()
  const { t } = useTranslation(["lofts", "common"]);

  const handleSubmit = async (data: any) => {
    try {
      const result = await updateLoft(loft.id, data)
      if (result?.success) {
        toast.success(t('lofts:loftUpdated'), {
          description: t('lofts:loftUpdatedDescription'),
          duration: 4000,
        })
        setTimeout(() => {
          router.push("/lofts")
        }, 1500)
      } else {
        toast.error(t('common:error'), {
          description: t('lofts:updateError'),
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Error updating loft:', error)
      toast.error(t('common:systemError'), {
        description: t('lofts:systemErrorDescription'),
        duration: 6000,
      })
    }
  }

  return <LoftForm key={loft.id} loft={loft} owners={owners} zoneAreas={zoneAreas} internetConnectionTypes={internetConnectionTypes} onSubmit={handleSubmit} />
}
