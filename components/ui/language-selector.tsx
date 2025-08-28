"use client"

import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Check } from "lucide-react"
import { FlagIcon } from "@/components/ui/flag-icon"
import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation" // Plus nécessaire

const languages = [
  { code: 'fr', name: 'Français', flagCode: 'FR' as const },
  { code: 'en', name: 'English', flagCode: 'GB' as const },
  { code: 'ar', name: 'العربية', flagCode: 'DZ' as const }
]

interface LanguageSelectorProps {
  showText?: boolean
}

export function LanguageSelector({ showText = false }: LanguageSelectorProps) {
  const [currentLang, setCurrentLang] = useState('fr');
  const [mounted, setMounted] = useState(false);

  // Récupérer la langue actuelle depuis les cookies après le montage
  useEffect(() => {
    const getCurrentLanguage = () => {
      const cookies = document.cookie.split(';');
      const langCookie = cookies.find(cookie => cookie.trim().startsWith('language='));
      if (langCookie) {
        return langCookie.split('=')[1];
      }
      return 'fr'; // défaut
    };

    setCurrentLang(getCurrentLanguage());
    setMounted(true);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    // Sauvegarder la langue dans les cookies
    document.cookie = `language=${langCode}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Recharger la page pour appliquer la nouvelle langue
    window.location.reload();
  }

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0] // Par défaut français

  // Afficher le drapeau français par défaut pendant le chargement
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-2 ${showText ? 'h-8 px-3' : 'h-8 w-8 p-0'} text-white hover:text-white hover:bg-gray-600`}
        disabled
      >
        <FlagIcon country="FR" className="w-5 h-4" />
        {showText && <span className="text-sm font-medium">Français</span>}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-2 ${showText ? 'h-8 px-3' : 'h-8 w-8 p-0'} text-white hover:text-white hover:bg-gray-600`}
        >
          <FlagIcon country={currentLanguage.flagCode} className="w-5 h-4" />
          {showText && <span className="text-sm font-medium">{currentLanguage.name}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FlagIcon country={lang.flagCode} className="w-5 h-4" />
              <span>{lang.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}