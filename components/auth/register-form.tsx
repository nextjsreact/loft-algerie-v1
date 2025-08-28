"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { FormWrapper, FormSection } from "@/components/ui/form-wrapper"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { register as registerUser } from "@/lib/auth"
import { registerSchema, type RegisterFormData } from "@/lib/validations"
import { useTranslation } from "react-i18next"

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await registerUser(data.email, data.password, data.full_name)
      if (result.success) {
        router.push("/dashboard")
        router.refresh()
      } else {
        setError(result.error || t('auth.registrationFailed'))
      }
    } catch (err) {
      setError(t('auth.unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormWrapper 
      maxWidth="md"
      title={t('auth.signUpTitle')}
      description={t('auth.signUpDescription')}
      icon="👤"
    >
      <FormSection>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="full_name">{t('auth.fullName')}</Label>
            <Input 
              id="full_name" 
              placeholder={t('auth.enterFullName')} 
              {...register("full_name")} 
              disabled={isLoading}
              className="bg-white"
            />
            {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t('auth.enterPassword')}
                {...register("password")}
                disabled={isLoading}
                className="bg-white"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('auth.signingUp') : t('auth.signUp')}
          </Button>
        </form>
      </FormSection>

      <FormSection colorScheme="green">
        <div className="text-center">
          <p className="text-sm text-green-700">
            {t('auth.haveAccount')}{" "}
            <Link href="/login" className="text-green-800 hover:underline font-medium">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </FormSection>
    </FormWrapper>
  )
}
