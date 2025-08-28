'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, MoreVertical, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ConversationsSidebarProps {
  conversations: any[]
  currentUserId: string
  selectedConversationId: string | null
  onSelectConversation: (id: string) => void
}

export function ConversationsSidebar({
  conversations,
  currentUserId,
  selectedConversationId,
  onSelectConversation
}: ConversationsSidebarProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})

  // Récupérer les compteurs de messages non lus
  const fetchUnreadCounts = async () => {
    try {
      const response = await fetch('/api/conversations/unread-by-conversation')
      if (response.ok) {
        const counts = await response.json()
        setUnreadCounts(counts)
      }
    } catch (error) {
      console.error('Error fetching unread counts:', error)
    }
  }

  useEffect(() => {
    fetchUnreadCounts()
    const interval = setInterval(fetchUnreadCounts, 3000)
    return () => clearInterval(interval)
  }, [])

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    
    if (isToday(date)) {
      return format(date, 'HH:mm')
    } else if (isYesterday(date)) {
      return 'Hier'
    } else {
      return format(date, 'dd/MM', { locale: fr })
    }
  }

  const getConversationName = (conversation: any) => {
    if (conversation.name) return conversation.name
    
    if (conversation.type === 'direct') {
      // Pour les conversations directes, afficher le nom de l'autre participant
      const otherParticipant = conversation.participants?.find(
        (p: any) => p.user_id !== currentUserId
      )
      let name = otherParticipant?.user?.full_name || 'Conversation'
      
      // Corriger les noms génériques
      if (name === 'member1') name = 'Membre 1'
      if (name === 'Team Member') name = 'Membre'
      
      return name
    }
    
    return `Groupe ${conversation.id.slice(0, 8)}`
  }

  const getConversationAvatar = (conversation: any) => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants?.find(
        (p: any) => p.user_id !== currentUserId
      )
      return otherParticipant?.user?.avatar_url
    }
    return null
  }

  const getConversationInitials = (conversation: any) => {
    const name = getConversationName(conversation)
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  const filteredConversations = conversations.filter(conv => {
    const name = getConversationName(conv).toLowerCase()
    return name.includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Conversations</h1>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
            <Button size="sm" asChild>
              <Link href="/conversations/new">
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Filtres */}
        <div className="flex gap-2 mb-4">
          <Button variant="default" size="sm" className="text-xs">
            Toutes
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Non lues
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Groupes
          </Button>
        </div>
        
        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des conversations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-0"
          />
        </div>
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium mb-2">Aucune conversation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Commencez une nouvelle conversation avec votre équipe
            </p>
            <Button size="sm" asChild>
              <Link href="/conversations/new">
                Nouvelle conversation
              </Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredConversations.map((conversation) => {
              const isSelected = conversation.id === selectedConversationId
              const unreadCount = unreadCounts[conversation.id] || 0
              const hasUnread = unreadCount > 0

              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={cn(
                    "conversation-item flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50",
                    isSelected && "bg-muted"
                  )}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={getConversationAvatar(conversation)} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getConversationInitials(conversation)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Indicateur en ligne (pour plus tard) */}
                    {conversation.type === 'direct' && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>

                  {/* Contenu de la conversation */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={cn(
                        "font-medium truncate",
                        hasUnread && "font-semibold"
                      )}>
                        {getConversationName(conversation)}
                      </h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatLastMessageTime(conversation.updated_at)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "text-sm text-muted-foreground truncate",
                        hasUnread && "text-foreground font-medium"
                      )}>
                        {conversation.last_message?.content || 'Aucun message'}
                      </p>
                      
                      {hasUnread && (
                        <Badge 
                          variant="default" 
                          className="notification-badge ml-2 h-5 min-w-[20px] flex items-center justify-center px-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full"
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}