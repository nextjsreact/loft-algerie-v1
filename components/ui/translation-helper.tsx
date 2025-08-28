"use client"

import { useTranslation } from 'react-i18next'
import React from 'react'

interface TranslationHelperProps {
  children: (t: (key: string, options?: any) => string) => React.ReactNode
  fallback?: (key: string) => string
  debug?: boolean
}

export function TranslationHelper({ 
  children, 
  fallback,
  debug = process.env.NODE_ENV === 'development'
}: TranslationHelperProps) {
  const { t, ready } = useTranslation()

  const enhancedT = (key: string, options?: any): string => {
    if (!ready) {
      return fallback ? fallback(key) : key
    }

    const translation = t(key, options)
    
    // En mode debug, afficher les clés manquantes
    if (debug && translation === key) {
      console.warn(`Missing translation key: ${key}`)
    }

    return translation as string
  }

  return <>{children(enhancedT)}</>
}

// Hook personnalisé pour les traductions avec fallback
export function useEnhancedTranslation() {
  const { t, i18n, ready } = useTranslation()
  const { language } = i18n

  const enhancedT = React.useCallback((key: string, options?: any): string => {
    if (!ready) {
      return key
    }

    const translation = t(key, options)
    
    // Fallback pour les clés manquantes
    if (translation === key) {
      const fallbacks: Record<string, string> = {
        'dashboard.title': 'Dashboard',
        'dashboard.subtitle': 'Overview of your loft management system',
        'dashboard.welcomeBack': 'Welcome back',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'common.edit': 'Edit',
        'common.delete': 'Delete',
        'common.view': 'View',
        'common.add': 'Add',
        'common.back': 'Back',
        'common.next': 'Next',
        'common.previous': 'Previous',
        'common.yes': 'Yes',
        'common.no': 'No',
        'common.name': 'Name',
        'common.description': 'Description',
        'common.date': 'Date',
        'common.time': 'Time',
        'common.status': 'Status',
        'common.type': 'Type',
        'common.amount': 'Amount',
        'common.currency': 'Currency',
        'common.category': 'Category',
        'common.paymentMethod': 'Payment Method',
        'common.loft': 'Loft',
        'common.owner': 'Owner',
        'common.guest': 'Guest',
        'common.task': 'Task',
        'common.team': 'Team',
        'common.conversation': 'Conversation',
        'common.message': 'Message',
        'common.notification': 'Notification',
        'common.report': 'Report',
        'common.setting': 'Setting',
        'common.analytics': 'Analytics',
        'common.reservation': 'Reservation',
        'common.transaction': 'Transaction',
        'common.bill': 'Bill',
        'common.utility': 'Utility',
        'common.zoneArea': 'Zone Area',
        'common.internetConnection': 'Internet Connection'
      }
      
      return fallbacks[key] || key
    }

    return translation as string
  }, [t, ready])

  return {
    t: enhancedT,
    ready,
    language
  }
}

// Composant pour afficher les traductions avec fallback visuel
export function TranslatedText({ 
  key, 
  fallback, 
  className = "",
  ...props 
}: { 
  key: string
  fallback?: string
  className?: string
} & React.HTMLAttributes<HTMLSpanElement>) {
  const { t, ready } = useTranslation()
  
  const text = ready ? t(key) : (fallback || key)
  const isFallback = !ready || t(key) === key
  
  return (
    <span 
      className={`${className} ${isFallback ? 'text-orange-500' : ''}`}
      title={isFallback ? `Missing translation: ${key}` : undefined}
      {...props}
    >
      {text}
    </span>
  )
}

// Hook pour détecter les clés de traduction manquantes
export function useTranslationDebug() {
  const { t, ready } = useTranslation()
  const [missingKeys, setMissingKeys] = React.useState<string[]>([])

  const debugT = React.useCallback((key: string, options?: any): string => {
    if (!ready) return key

    const translation = t(key, options)
    
    if (translation === key) {
      setMissingKeys(prev => {
        if (!prev.includes(key)) {
          return [...prev, key]
        }
        return prev
      })
    }

    return translation as string
  }, [t, ready])

  return {
    t: debugT,
    missingKeys,
    clearMissingKeys: () => setMissingKeys([])
  }
}

