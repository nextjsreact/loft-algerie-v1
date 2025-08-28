"use client"

import { useTranslation } from "@/lib/i18n/context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { FlagIcon } from "@/components/ui/flag-icon"

const languages = [
  { code: 'ar' as const, name: 'العربية', flagCode: 'DZ' as const },
  { code: 'fr' as const, name: 'Français', flagCode: 'FR' as const },
  { code: 'en' as const, name: 'English', flagCode: 'GB' as const }
]

interface SimpleLanguageSelectorProps {
  showText?: boolean
}

export function SimpleLanguageSelector({ showText = false }: SimpleLanguageSelectorProps) {
  const { language, changeLanguage } = useTranslation()
  
  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {currentLanguage?.flagCode && (
            <FlagIcon country={currentLanguage.flagCode} className="w-5 h-4" />
          )}
          {showText && currentLanguage?.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex items-center gap-2"
          >
            <FlagIcon country={lang.flagCode} className="w-5 h-4" /> {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}