"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SimpleLanguageSelector } from "@/components/ui/simple-language-selector"
import { useSimpleTranslation } from "@/hooks/use-simple-translation"
import { Eye, EyeOff, Building2 } from "lucide-react"
import Link from "next/link"
import { login } from "@/lib/auth"
import { loginSchema, type LoginFormData } from "@/lib/validations"

export function SimpleLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { t } = useSimpleTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await login(data.email, data.password)
      if (result.success) {
        router.push("/")
        router.refresh()
      } else {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Building2 className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            🔐 {t('auth.welcomeBack')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.signInDescription')}
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex justify-end">
          <SimpleLanguageSelector />
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-xl">{t('auth.signIn')}</CardTitle>
          </CardHeader>
          <CardContent>
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

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('auth.signingIn') : t('auth.signIn')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {t('auth.noAccount')}{" "}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                  {t('auth.signUp')}
                </Link>
              </p>
              
              <Separator className="my-4" />
              
              <div>
                <p className="text-sm font-medium mb-3 text-blue-900">{t('auth.demoAccounts')}</p>
                <div className="space-y-2 text-xs text-blue-700">
                  <p>
                    <strong>{t('auth.admin')}:</strong> admin@loftmanager.com / password123
                  </p>
                  <p>
                    <strong>{t('auth.manager')}:</strong> manager@loftmanager.com / password123
                  </p>
                  <p>
                    <strong>{t('auth.member')}:</strong> member@loftmanager.com / password123
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}