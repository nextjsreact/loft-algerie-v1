"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { deleteOwner } from "@/app/actions/owners"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "react-i18next"

export function DeleteOwnerButton({ id }: { id: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation();

  const handleDelete = async () => {
    if (confirm(t('owners.deleteConfirm'))) {
      try {
        await deleteOwner(id)
        toast({
          title: t('owners.deleteSuccessTitle'),
          description: t('owners.deleteSuccessDescription'),
        })
        router.push("/owners")
      } catch (error) {
        toast({
          title: t('common.error'),
          description: error instanceof Error ? error.message : t('owners.deleteError'),
          variant: "destructive"
        })
      }
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
    >
      {t('owners.deleteOwner')}
    </Button>
  )
}
