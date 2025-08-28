'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Send, ArrowLeft, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { SimpleMessage } from '@/lib/services/conversations-simple'
import { useTranslation } from 'react-i18next'
import { createClient } from '@/utils/supabase/client'

interface SimpleConversationPageClientProps {
  conversationId: string
  initialMessages: SimpleMessage[]
  currentUserId: string
}

export function SimpleConversationPageClient({ 
  conversationId, 
  initialMessages, 
  currentUserId 
}: SimpleConversationPageClientProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<SimpleMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  // Fonction pour marquer la conversation comme lue
  const markAsRead = async () => {
    try {
      await fetch(`/api/conversations/${conversationId}/mark-read`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error marking conversation as read:', error)
    }
  }

  useEffect(() => {
    const supabase = createClient()
    markAsRead()

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
          // You might need to fetch the sender's name separately
          // or adjust the backend to include it.
          // For now, we'll add the message directly.
          setMessages((prevMessages) => [...prevMessages, payload.new as SimpleMessage])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  // Marquer comme lu quand de nouveaux messages arrivent (pour les messages qu'on voit)
  useEffect(() => {
    if (messages.length > 0) {
      markAsRead()
    }
  }, [messages.length])


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
        setMessages(prev => [...prev, {
          id: sentMessage.id,
          conversation_id: sentMessage.conversation_id,
          sender_id: sentMessage.sender_id,
          content: sentMessage.content,
          created_at: sentMessage.created_at,
          sender_name: sentMessage.sender?.full_name || 'You'
        }])
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to send message')
        setNewMessage(messageContent) // Restore message
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
      setNewMessage(messageContent) // Restore message
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

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-background">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/conversations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-semibold">{t('conversations.conversation')}</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {messages.length} {t('conversations.messages')}
              </span>
            </div>
          </div>
        </div>
        

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <div className="text-lg mb-2">{t('conversations.noMessages')}</div>
            <div className="text-sm">{t('conversations.startConversationDesc')}</div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id || `message-${conversationId}-${index}-${message.created_at}-${message.sender_id}`}
              className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-[70%] ${
                message.sender_id === currentUserId 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <CardContent className="p-3">
                  {message.sender_id !== currentUserId && (
                    <div className="text-xs font-medium mb-1 opacity-70">
                      {message.sender_name}
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 opacity-70 ${
                    message.sender_id === currentUserId ? 'text-right' : 'text-left'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4 bg-background">
        <div className="flex gap-2">
          <Input
            placeholder={t('conversations.typeMessage')}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || isSending}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-2 text-center">
          {t('conversations.sendInstructions')}
        </div>
      </div>
    </div>
  )
}