"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormWrapper, FormSection } from "@/components/ui/form-wrapper"
import { toast } from "@/components/ui/use-toast"
import { useTranslation } from "react-i18next"
import { loftOwnerSchema, type LoftOwnerFormData } from "@/lib/validations"
import type { LoftOwner } from "@/lib/types"

interface OwnerFormProps {
  owner?: LoftOwner
  action: (formData: FormData) => Promise<{ error?: string }>
}

export function OwnerForm({ owner, action }: OwnerFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoftOwnerFormData>({
    resolver: zodResolver(loftOwnerSchema),
    defaultValues: owner
      ? {
          name: owner.name,
          email: owner.email || "",
          phone: owner.phone || "",
          address: owner.address || "",
          ownership_type: owner.ownership_type,
        }
      : {
          ownership_type: "third_party",
        },
  })

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await action(formData)
      if (result?.error) {
        setError(result.error)
        toast({
          title: "❌ Error",
          description: result.error,
          variant: "destructive",
          duration: 5000,
        })
      } else {
        const ownerName = formData.get("name") as string
        toast({
          title: "✅ Success",
          description: `Owner "${ownerName}" ${owner ? 'updated' : 'created'} successfully`,
          duration: 3000,
        })
        setTimeout(() => {
          router.push("/owners")
        }, 1000)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormWrapper 
      maxWidth="2xl"
      title={owner ? t('owners.editOwner') : t('owners.addOwner')}
      description={owner ? t('owners.updateOwnerInfo') : t('owners.createNewOwner')}
      icon="👤"
    >
      <FormSection 
        title={t('owners.ownerDetails')}
        description={t('owners.enterOwnerInfo')}
        icon="🏠"
        colorScheme="default"
      >
        <form action={handleFormSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('owners.name')} *</Label>
              <Input id="name" {...register("name")} className="bg-white" />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownership_type">{t('owners.ownershipType')} *</Label>
              <Select
                onValueChange={(value) => setValue("ownership_type", value as any)}
                defaultValue={owner?.ownership_type || "third_party"}
                {...register("ownership_type")}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder={t('owners.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">{t('owners.companyOwned')}</SelectItem>
                  <SelectItem value="third_party">{t('owners.thirdParty')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.ownership_type && <p className="text-sm text-red-500">{errors.ownership_type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('owners.email')}</Label>
              <Input id="email" type="email" {...register("email")} className="bg-white" />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('owners.phone')}</Label>
              <Input id="phone" {...register("phone")} className="bg-white" />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('owners.address')}</Label>
            <Textarea id="address" {...register("address")} className="bg-white" />
            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? t('owners.saving') : owner ? t('owners.updateOwner') : t('owners.createOwner')}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {t('owners.cancel')}
            </Button>
          </div>
        </form>
      </FormSection>
    </FormWrapper>
  )
}
