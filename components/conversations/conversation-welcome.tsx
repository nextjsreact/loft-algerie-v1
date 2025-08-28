'use client'

import { MessageSquare, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

export function ConversationWelcome() {
  const { t } = useTranslation()

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Icône principale */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Titre et description */}
        <h2 className="text-2xl font-bold mb-3">
          Messagerie Loft Algérie
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Communiquez facilement avec votre équipe de gestion immobilière. 
          Sélectionnez une conversation existante ou créez-en une nouvelle pour commencer.
        </p>

        {/* Fonctionnalités */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-left">
              <h4 className="font-medium text-sm">Messages en temps réel</h4>
              <p className="text-xs text-muted-foreground">Communication instantanée sécurisée</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-left">
              <h4 className="font-medium text-sm">Conversations d'équipe</h4>
              <p className="text-xs text-muted-foreground">Coordination entre gestionnaires</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-left">
              <h4 className="font-medium text-sm">Synchronisation multi-appareils</h4>
              <p className="text-xs text-muted-foreground">Accédez partout à vos messages</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/conversations/new">
              <MessageSquare className="w-4 h-4 mr-2" />
              Nouvelle conversation
            </Link>
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Ou sélectionnez une conversation existante dans la liste
          </p>
        </div>
      </div>
    </div>
  )
}