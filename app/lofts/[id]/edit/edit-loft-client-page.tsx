"use client"

import { LoftForm } from "@/components/forms/loft-form"
import { updateLoft } from "@/app/actions/lofts"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
interface EditLoftClientPageProps {
  loft: any;
  owners: any[];
  zoneAreas: any[];
  internetConnectionTypes: any[];
  translations: {
    editLoft: string;
    updatePropertyDetails: string;
    loftUpdated: string;
    error: string;
  }
}

export function EditLoftClientPage({ loft, owners, zoneAreas, internetConnectionTypes, translations: t }: EditLoftClientPageProps) {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    const result = await updateLoft(loft.id, data)
    if (result?.success) {
      toast.success(t.loftUpdated)
      router.push("/lofts")
    } else {
      toast.error(t.error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          {t.editLoft}
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          {t.updatePropertyDetails}
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <LoftForm
          loft={loft}
          owners={owners}
          zoneAreas={zoneAreas}
          internetConnectionTypes={internetConnectionTypes}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}