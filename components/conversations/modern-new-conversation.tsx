'use client'

import { useState, useEffect } from 'react'
import { Search, X, Users, MessageSquare, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  full_name: string
  email: string
  role?: string
  avatar_url?: string
}

interface ModernNewConversationProps {
  currentUserId: string
  onBack?: () => void
  showBackButton?: boolean
}

export function ModernNewConversation({
  currentUserId,
  onBack,
  showBackButton = false
}: ModernNewConversationProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [conversationType, setConversationType] = useState<'direct' | 'group'>('direct')
  const [groupName, setGroupName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Recherche d'utilisateurs
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`)
        if (response.ok) {
          const users = await response.json()
          setSearchResults(users.filter((user: User) => user.id !== currentUserId))
        }
      } catch (error) {
        console.error('Error searching users:', error)
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, currentUserId])

  const handleSelectUser = (user: User) => {
    if (conversationType === 'direct' && selectedUsers.length > 0) {
      setSelectedUsers([user])
    } else {
      if (!selectedUsers.find(u => u.id === user.id)) {
        setSelectedUsers([...selectedUsers, user])
      }
    }
    setSearchQuery('')
    setSearchResults([])
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId))
  }

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Veuillez sélectionner au moins un utilisateur')
      return
    }

    if (conversationType === 'group' && !groupName.trim()) {
      toast.error('Veuillez entrer un nom pour le groupe')
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: conversationType,
          name: conversationType === 'group' ? groupName.trim() : undefined,
          participant_ids: selectedUsers.map(u => u.id)
        })
      })

      if (response.ok) {
        const conversation = await response.json()
        toast.success('Conversation créée avec succès')
        router.push(`/conversations/${conversation.id}`)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de la création')
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
      toast.error('Erreur lors de la création de la conversation')
    } finally {
      setIsCreating(false)
    }
  }

  const getUserInitials = (user: User) => {
    return user.full_name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-xl font-semibold">{t('conversations.newConversation')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('conversations.createDirectOrGroup')}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Type de conversation */}
        <Tabs value={conversationType} onValueChange={(value) => {
          setConversationType(value as 'direct' | 'group')
          setSelectedUsers([])
          setGroupName('')
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t('conversations.directMessage')}
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('conversations.group')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="direct" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Créez une conversation privée avec un autre utilisateur.
            </p>
          </TabsContent>

          <TabsContent value="group" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('conversations.groupName')}
              </label>
              <Input
                placeholder={t('conversations.enterGroupName')}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Utilisateurs sélectionnés */}
        {selectedUsers.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {conversationType === 'direct' ? 'Destinataire' : 'Participants'} ({selectedUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <Badge
                    key={user.id}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1.5"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.full_name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUser(user.id)}
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recherche d'utilisateurs */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('conversations.searchByNameOrEmail')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Résultats de recherche */}
          {searchQuery.trim().length >= 2 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {isSearching ? t('conversations.searching') : t('conversations.searchResults')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isSearching ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucun utilisateur trouvé
                  </p>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                          selectedUsers.find(u => u.id === user.id) && "bg-muted"
                        )}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getUserInitials(user)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{user.full_name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          {user.role && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {user.role}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-border">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack || (() => router.back())}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={handleCreateConversation}
            disabled={selectedUsers.length === 0 || isCreating || (conversationType === 'group' && !groupName.trim())}
            className="flex-1"
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Création...
              </div>
            ) : (
              `Créer ${conversationType === 'direct' ? 'la conversation' : 'le groupe'}`
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}