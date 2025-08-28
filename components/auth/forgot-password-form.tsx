"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormWrapper, FormSection } from "@/components/ui/form-wrapper"
import Link from "next/link"
import { requestPasswordReset } from "@/lib/auth"
import { z } from "zod"

import { useTranslation } from "react-i18next"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await requestPasswordReset(data.email)
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || t('auth.failedToSendResetEmail'))
      }
    } catch (err) {
      setError(t('auth.unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <FormWrapper 
        maxWidth="md"
        title={t('auth.checkYourEmail')}
        description={t('auth.passwordResetEmailSentDescription')}
        icon="📧"
      >
        <FormSection colorScheme="green">
          <div className="text-center">
            <p className="text-green-700 mb-4">
              {t('auth.passwordResetEmailSentSuccess')}
            </p>
            <Link href="/login" className="text-green-800 hover:underline font-medium">
              {t('auth.backToLogin')}
            </Link>
          </div>
        </FormSection>
      </FormWrapper>
    )
  }

  return (
    <FormWrapper 
      maxWidth="md"
      title={t('auth.forgotPasswordTitle')}
      description={t('auth.forgotPasswordDescription')}
      icon="🔑"
    >
      <FormSection>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('auth.enterEmail')}
              {...register("email")}
              disabled={isLoading}
              className="bg-white"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('auth.sending') : t('auth.sendResetLink')}
          </Button>
        </form>
      </FormSection>

      <FormSection colorScheme="blue">
        <div className="text-center">
          <Link href="/login" className="text-blue-800 hover:underline font-medium">
            {t('auth.backToLogin')}
          </Link>
        </div>
      </FormSection>
    </FormWrapper>
  )
}
