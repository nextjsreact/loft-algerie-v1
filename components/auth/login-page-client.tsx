"use client"

import { SimpleLoginForm } from "@/components/auth/simple-login-form"
import { useTranslation } from "@/lib/i18n/context"

export function LoginPageClient() {
  const { language } = useTranslation();
  return <SimpleLoginForm key={language} />
}