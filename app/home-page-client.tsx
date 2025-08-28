'use client'

import { useTranslation } from '@/lib/i18n/context'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface NavigationCardProps {
  href: string
  icon: string
  title: string
  description: string
  buttonText: string
  buttonColor: string
  isMobile: boolean
  isTablet: boolean
}

const NavigationCard = ({ href, icon, title, description, buttonText, buttonColor, isMobile, isTablet }: NavigationCardProps) => (
  <a href={href} className="no-underline h-full">
    <div className={cn(
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
      "shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full text-center",
      "flex flex-col justify-between", // Flexbox pour aligner les boutons
      isMobile ? "rounded-xl p-6" : isTablet ? "rounded-2xl p-7" : "rounded-2xl p-8"
    )}>
      {/* Contenu principal */}
      <div className="flex-1">
        <div className={cn(
          "mb-4",
          isMobile ? "text-4xl" : "text-5xl"
        )}>
          {icon}
        </div>
        <h3 className={cn(
          "font-bold text-gray-900 dark:text-gray-100 mb-3",
          isMobile ? "text-lg" : "text-xl"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-gray-600 dark:text-gray-400 leading-relaxed",
          isMobile ? "text-sm" : "text-sm"
        )}>
          {description}
        </p>
      </div>
      
      {/* Bouton aligné en bas */}
      <div className="mt-6">
        <div 
          className={cn(
            "inline-block text-white font-semibold rounded-lg transition-all duration-200 hover:opacity-90",
            isMobile ? "px-5 py-2.5 text-sm" : "px-6 py-3 text-sm"
          )}
          style={{ backgroundColor: buttonColor }}
        >
          {buttonText}
        </div>
      </div>
    </div>
  </a>
)

export default function HomePage({ userRole }: { userRole: string }) {
  const { t } = useTranslation(['landing', 'nav', 'common'])
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  // Define cards available to each role (consistent with sidebar permissions)
  const roleCards = {
    admin: [
      'lofts', 'reservations', 'availability', 'tasks', 'teams', 'owners', 'transactions', 'reports'
    ],
    manager: [
      'lofts', 'reservations', 'availability', 'tasks', 'teams', 'transactions', 'reports'
    ],
    member: [
      'tasks'
    ],
    executive: [
      'executive'
    ],
    guest: [
      'availability'
    ],
  };

  // Define all possible navigation cards
  const allNavigationCards = [
    {
      id: 'executive',
      href: "/executive",
      icon: "👔",
      title: t('nav:executive'),
      description: t('landing:sections.executive.description'),
      buttonText: t('landing:viewButton'),
      buttonColor: "#7c3aed",
    },
    {
      id: 'lofts',
      href: "/lofts",
      icon: "🏢",
      title: t('nav:lofts'),
      description: t('landing:features.property.description'),
      buttonText: t('landing:viewButton'),
      buttonColor: "#2563eb",
    },
    {
      id: 'reservations',
      href: "/reservations",
      icon: "📅",
      title: t('landing:sections.reservations.title'),
      description: t('landing:sections.reservations.description'),
      buttonText: t('landing:viewButton'),
      buttonColor: "#059669",
    },
    {
      id: 'availability',
      href: "/availability",
      icon: "📋",
      title: t('landing:sections.availability.title'),
      description: t('landing:sections.availability.description'),
      buttonText: t('landing:viewButton'),
      buttonColor: "#7c3aed",
    },
    {
      id: 'tasks',
      href: "/tasks",
      icon: "✅",
      title: t('landing:sections.tasks.title'),
      description: t('landing:sections.tasks.description'),
      buttonText: t('landing:viewButton'),
      buttonColor: "#dc2626",
    },
    {
      id: 'teams',
      href: "/teams",
      icon: "👥",
      title: t('landing:sections.teams.title'),
      description: t('landing:sections.teams.description'),
      buttonText: t('landing:viewButton'),
      buttonColor: "#ea580c",
    },
    {
      id: 'owners',
      href: "/owners",
      icon: "🏠",
      title: t('landing:sections.owners.title'),
      description: t('landing:sections.owners.description'),
      buttonText: t('landing:viewButton'),
      buttonColor: "#0891b2",
    },
    {
      id: 'transactions',
      href: "/transactions",
      icon: "💰",
      title: t('landing:sections.transactions.title'),
      description: t('landing:sections.transactions.description'),
      buttonText: t('landing:viewButton'),
      buttonColor: "#16a34a",
    },
    {
      id: 'reports',
      href: "/reports",
      icon: "📊",
      title: t('landing:sections.reports.title'),
      description: t('landing:sections.reports.description'),
      buttonText: t('landing:viewButton'),
      buttonColor: "#9333ea",
    },
  ];

  // Filter cards based on user role
  const filteredNavigationCards = allNavigationCards.filter(card =>
    roleCards[userRole as keyof typeof roleCards]?.includes(card.id)
  );

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 font-sans">
      <div className={cn(
        "max-w-7xl mx-auto",
        isMobile ? "px-4 py-5" : isTablet ? "px-5 py-8" : "px-5 py-10"
      )}>
        {/* Header */}
        <div className={cn(
          "text-center",
          isMobile ? "mb-12" : isTablet ? "mb-16" : "mb-20"
        )}>
          <h1 className={cn(
            "font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal pb-2",
            isMobile ? "text-3xl mb-4" : isTablet ? "text-4xl mb-5" : "text-5xl mb-5"
          )}>
            {t('landing:title')}
          </h1>
          <p className={cn(
            "text-gray-600 dark:text-gray-300 mx-auto leading-relaxed",
            isMobile ? "text-base px-2" : isTablet ? "text-lg max-w-2xl" : "text-xl max-w-3xl"
          )}>
            {t('landing:description')}
          </p>
        </div>

        {/* Navigation Cards Grid */}
        <div className={cn(
          "grid mb-12 items-stretch", // items-stretch pour égaliser les hauteurs
          isMobile
            ? "grid-cols-1 gap-4"
            : isTablet
              ? "grid-cols-2 gap-6"
              : "grid-cols-3 xl:grid-cols-4 gap-6"
        )}>
          {filteredNavigationCards.map(card => (
            <NavigationCard
              key={card.id}
              href={card.href}
              icon={card.icon}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
              buttonColor={card.buttonColor}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          ))}
        </div>

        {/* Quick Access Section */}
        <div className={cn(
          "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl text-center mb-10",
          isMobile ? "rounded-xl p-6" : isTablet ? "rounded-2xl p-8" : "rounded-2xl p-10"
        )}>
          <h2 className={cn(
            "font-bold text-gray-900 dark:text-gray-100",
            isMobile ? "text-2xl mb-3" : isTablet ? "text-3xl mb-4" : "text-3xl mb-4"
          )}>
            {t('landing:quickAccess.title')}
          </h2>
          <p className={cn(
            "text-gray-600 dark:text-gray-400 mb-8",
            isMobile ? "text-sm" : "text-base"
          )}>
            {t('landing:quickAccess.description')}
          </p>
          
          {/* Quick Access basé sur les permissions de la sidebar */}
          <div className={cn(
            "grid mx-auto",
            isMobile 
              ? "grid-cols-1 gap-3 max-w-sm" 
              : isTablet 
                ? "grid-cols-2 gap-4 max-w-2xl" 
                : "grid-cols-4 gap-4 max-w-4xl"
          )}>
            {/* Dashboard - Tous les rôles connectés */}
            <a href="/dashboard" className="no-underline">
              <div className={cn(
                "bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center",
                isMobile ? "px-5 py-3.5 rounded-lg gap-2 text-sm" : "px-6 py-4 rounded-xl gap-2 text-base"
              )}>
                <span className={isMobile ? "text-base" : "text-lg"}>📊</span>
                {t('landing:quickAccess.dashboard')}
              </div>
            </a>
            
            {/* Conversations - admin, manager, member, executive */}
            {['admin', 'manager', 'member', 'executive'].includes(userRole) && (
              <a href="/conversations" className="no-underline">
                <div className={cn(
                  "bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center",
                  isMobile ? "px-5 py-3.5 rounded-lg gap-2 text-sm" : "px-6 py-4 rounded-xl gap-2 text-base"
                )}>
                  <span className={isMobile ? "text-base" : "text-lg"}>💬</span>
                  {t('landing:quickAccess.conversations')}
                </div>
              </a>
            )}
            
            {/* Notifications - admin, manager, member */}
            {['admin', 'manager', 'member'].includes(userRole) && (
              <a href="/notifications" className="no-underline">
                <div className={cn(
                  "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center",
                  isMobile ? "px-5 py-3.5 rounded-lg gap-2 text-sm" : "px-6 py-4 rounded-xl gap-2 text-base"
                )}>
                  <span className={isMobile ? "text-base" : "text-lg"}>🔔</span>
                  {t('landing:quickAccess.notifications')}
                </div>
              </a>
            )}
            
            {/* Reports PDF - admin, manager */}
            {['admin', 'manager'].includes(userRole) && (
              <a href="/reports" className="no-underline">
                <div className={cn(
                  "bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center",
                  isMobile ? "px-5 py-3.5 rounded-lg gap-2 text-sm" : "px-6 py-4 rounded-xl gap-2 text-base"
                )}>
                  <span className={isMobile ? "text-base" : "text-lg"}>📄</span>
                  {t('landing:quickAccess.pdfReports')}
                </div>
              </a>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className={cn(
          "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 shadow-lg flex items-center",
          isMobile ? "rounded-xl p-5 flex-col text-center" : "rounded-2xl p-6 flex-row text-left"
        )}>
          <div className={cn(
            "bg-green-500 rounded-full shadow-lg shadow-green-500/40",
            isMobile ? "w-3 h-3 mb-3" : "w-4 h-4 mr-4"
          )}></div>
          <div>
            <h3 className={cn(
              "font-bold text-green-800 dark:text-green-300 m-0",
              isMobile ? "text-base" : "text-lg"
            )}>
              {t('landing:systemStatus.title')}
            </h3>
            <p className={cn(
              "text-green-700 dark:text-green-400 mt-1 leading-relaxed",
              isMobile ? "text-sm" : "text-sm"
            )}>
              {t('landing:systemStatus.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}