'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Paperclip, Mic, Search, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WhatsAppMessagesList } from './whatsapp-messages-list'
import { TypingIndicator } from './typing-indicator'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { SimpleMessage } from '@/lib/services/conversations-simple'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface WhatsAppChatViewProps {
  conversationId: string
  currentUserId: string
  onBack?: () => void
  showBackButton?: boolean
}

export function WhatsAppChatView({
  conversationId,
  currentUserId,
  onBack,
  showBackButton = false
}: WhatsAppChatViewProps) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<SimpleMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [conversationInfo, setConversationInfo] = useState<any>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Charger les messages initiaux
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/conversations/${conversationId}/messages`)
        if (response.ok) {
          const data = await response.json()
          setMessages(data.messages || [])
          setConversationInfo(data.conversation)
        }
      } catch (error) {
        console.error('Error loading messages:', error)
        toast.error('Erreur lors du chargement des messages')
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [conversationId])

  // Configuration Supabase Realtime
  useEffect(() => {
    const supabase = createClient()
    
    // Marquer comme lu
    const markAsRead = async () => {
      try {
        await fetch(`/api/conversations/${conversationId}/mark-read`, {
          method: 'POST'
        })
      } catch (error) {
        console.error('Error marking as read:', error)
      }
    }

    markAsRead()

    // Écouter les nouveaux messages
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as SimpleMessage
          setMessages(prev => [...prev, newMessage])
          markAsRead()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  // Gestion de la frappe (typing indicator)
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout

    const handleTyping = () => {
      if (!isTyping) {
        setIsTyping(true)
        // Envoyer l'événement de frappe (à implémenter)
      }

      clearTimeout(typingTimeout)
      typingTimeout = setTimeout(() => {
        setIsTyping(false)
        // Arrêter l'événement de frappe (à implémenter)
      }, 1000)
    }

    const input = inputRef.current
    if (input) {
      input.addEventListener('input', handleTyping)
      return () => {
        input.removeEventListener('input', handleTyping)
        clearTimeout(typingTimeout)
      }
    }
  }, [isTyping])

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return

    const messageContent = newMessage.trim()
    setNewMessage('')
    setIsSending(true)

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageContent
        })
      })

      if (response.ok) {
        const sentMessage = await response.json()
        // Le message sera ajouté via Realtime
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de l\'envoi')
        setNewMessage(messageContent)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Erreur lors de l\'envoi du message')
      setNewMessage(messageContent)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getConversationName = () => {
    if (!conversationInfo) return 'Conversation'
    
    if (conversationInfo.name) return conversationInfo.name
    
    if (conversationInfo.type === 'direct') {
      const otherParticipant = conversationInfo.participants?.find(
        (p: any) => p.user_id !== currentUserId
      )
      return otherParticipant?.user?.full_name || 'Utilisateur'
    }
    
    return `Groupe ${conversationInfo.id.slice(0, 8)}`
  }

  const getConversationAvatar = () => {
    if (!conversationInfo || conversationInfo.type !== 'direct') return null
    
    const otherParticipant = conversationInfo.participants?.find(
      (p: any) => p.user_id !== currentUserId
    )
    return otherParticipant?.user?.avatar_url
  }

  const getConversationInitials = () => {
    const name = getConversationName()
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  const getStatusText = () => {
    if (conversationInfo?.type === 'direct') {
      return 'en ligne' // À remplacer par le vrai statut
    } else {
      const participantCount = conversationInfo?.participants?.length || 0
      return `${participantCount} participant${participantCount > 1 ? 's' : ''}`
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#efeae2] dark:bg-[#0b141a]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a884]"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a]">
      {/* Header de la conversation */}
      <div className="flex items-center gap-3 p-4 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-[#e9edef] dark:border-[#313d45]">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0 text-[#54656f] dark:text-[#8696a0] hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942]">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        <Avatar className="h-10 w-10">
          <AvatarImage src={getConversationAvatar()} />
          <AvatarFallback className={cn(
            "font-medium text-white",
            conversationInfo?.type === 'group' ? "bg-[#667781]" : "bg-[#00a884]"
          )}>
            {conversationInfo?.type === 'group' ? (
              <Users className="h-5 w-5" />
            ) : (
              getConversationInitials()
            )}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => {/* Ouvrir profil/info groupe */}}>
          <h2 className="font-medium truncate text-[#111b21] dark:text-[#e9edef]">{getConversationName()}</h2>
          <p className="text-xs text-[#667781] dark:text-[#8696a0]">
            {typingUsers.length > 0 ? (
              <span className="text-[#00a884]">en train d'écrire...</span>
            ) : (
              getStatusText()
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#54656f] dark:text-[#8696a0] hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942]">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#54656f] dark:text-[#8696a0] hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942]">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#54656f] dark:text-[#8696a0] hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942]">
            <Video className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#54656f] dark:text-[#8696a0] hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942]">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Infos du contact</DropdownMenuItem>
              <DropdownMenuItem>Sélectionner messages</DropdownMenuItem>
              <DropdownMenuItem>Fermer conversation</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Supprimer conversation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-hidden">
        <WhatsAppMessagesList
          messages={messages}
          currentUserId={currentUserId}
          conversationId={conversationId}
        />
      </div>

      {/* Indicateur de frappe */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 bg-[#efeae2] dark:bg-[#0b141a]">
          <TypingIndicator users={typingUsers} />
        </div>
      )}

      {/* Zone de saisie */}
      <div className="p-4 bg-[#f0f2f5] dark:bg-[#202c33] border-t border-[#e9edef] dark:border-[#313d45]">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 flex-shrink-0 text-[#54656f] dark:text-[#8696a0] hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942]">
            <Smile className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 flex-shrink-0 text-[#54656f] dark:text-[#8696a0] hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942]">
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder="Tapez un message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSending}
              className="bg-white dark:bg-[#2a3942] border-[#e9edef] dark:border-[#313d45] text-[#111b21] dark:text-[#e9edef] placeholder:text-[#667781] dark:placeholder:text-[#8696a0] focus:border-[#00a884] dark:focus:border-[#00a884] rounded-lg pr-12"
            />
          </div>
          
          {newMessage.trim() ? (
            <Button 
              onClick={sendMessage} 
              disabled={isSending}
              size="sm"
              className="h-10 w-10 p-0 rounded-full bg-[#00a884] hover:bg-[#00a884]/90 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "h-10 w-10 p-0 flex-shrink-0 rounded-full transition-colors",
                isRecording 
                  ? "bg-red-500 text-white hover:bg-red-600" 
                  : "text-[#54656f] dark:text-[#8696a0] hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942]"
              )}
              onMouseDown={() => setIsRecording(true)}
              onMouseUp={() => setIsRecording(false)}
              onMouseLeave={() => setIsRecording(false)}
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}