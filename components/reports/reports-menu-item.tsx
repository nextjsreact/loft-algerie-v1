'use client'

/**
 * ÉLÉMENT DE MENU POUR LES RAPPORTS
 * =================================
 * 
 * Composant pour ajouter les rapports dans la navigation
 */

import Link from 'next/link'
import { FileText, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/lib/i18n/context'

export function ReportsMenuItem() {
  const { t } = useTranslation(['reports', 'common'])
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <FileText className="w-4 h-4" />
          {t('reports:menuTitle')}
          <Badge variant="secondary" className="ml-1">
            {t('reports:menuBadge')}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('reports:menuLabel')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/reports" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {t('reports:reportGenerator')}
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/reports?type=loft" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {t('reports:loftReport')}
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/reports?type=owner" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {t('reports:ownerReport')}
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/reports?type=global" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {t('reports:globalReport')}
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="text-muted-foreground text-xs">
          {t('reports:automaticPdfGeneration')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Composant simple pour la navigation principale
export function ReportsNavLink() {
  const { t } = useTranslation(['reports', 'common'])
  
  return (
    <Link 
      href="/reports" 
      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <FileText className="w-4 h-4" />
      {t('reports:menuTitle')}
      <Badge variant="outline" className="ml-auto">
        {t('reports:menuBadge')}
      </Badge>
    </Link>
  )
}