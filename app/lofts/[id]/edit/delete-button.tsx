"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

export function DeleteButton({ 
  id,
  onDelete,
  loftName
}: {
  id: string
  onDelete: (id: string) => Promise<void>
  loftName?: string
}) {
  const router = useRouter()
  const { t } = useTranslation();

  const handleClick = async () => {
    if (confirm(t('lofts.deleteConfirm', { loftName: loftName || '' }))) {
      const confirmation = prompt(t('lofts.deleteConfirmationPrompt'))
      
      if (confirmation === t('lofts.deleteConfirmationKeyword')) {
        try {
          toast.loading(t('lofts.deletingInProgress'), {
            description: t('lofts.deletingDescription'),
            duration: 2000,
          })
          
          await onDelete(id)
          
          toast.success(t('lofts.deleteSuccess', { loftName: loftName || '' }), {
            description: t('lofts.deleteSuccessDescription'),
            duration: 4000,
          })
          
          setTimeout(() => {
            router.push("/lofts")
          }, 1500)
        } catch (error) {
          console.error("Delete failed:", error)
          toast.error(t('lofts.deleteError'), {
            description: t('lofts.deleteErrorDescription'),
            duration: 6000,
          })
        }
      } else if (confirmation !== null) {
        toast.warning(t('lofts.deleteCancelled'), {
          description: t('lofts.deleteCancelledDescription'),
          duration: 3000,
        })
      }
    }
  }

  return (
    <Button 
      variant="destructive"
      onClick={handleClick}
      className="bg-red-600 hover:bg-red-700 text-white font-medium"
    >
      {t('lofts.deleteLoft')}
    </Button>
  )
}
