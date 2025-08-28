'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useNotificationSound } from '@/lib/hooks/use-notification-sound'
import { useTranslation } from 'react-i18next'

export default function TestSoundPage() {
  const { playNotificationSound } = useNotificationSound()
  const [audioInitialized, setAudioInitialized] = useState(false)
  const { t } = useTranslation();
  
  // Initialize audio on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      setAudioInitialized(true)
      document.removeEventListener('click', handleInteraction)
    }
    
    document.addEventListener('click', handleInteraction)
    return () => document.removeEventListener('click', handleInteraction)
  }, [])
  
  const handlePlaySound = (type: 'success' | 'info' | 'warning' | 'error') => {
    console.log(`Playing ${type} sound...`)
    playNotificationSound(type)
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('testSound.title')}</h1>
      
      {!audioInitialized && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="font-bold">{t('testSound.clickAnywhere')}</p>
          <p>{t('testSound.browserBlocksAudio')}</p>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-3">{t('testSound.testSoundTypes')}</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handlePlaySound('success')}
              className="bg-green-500 hover:bg-green-600"
            >
              {t('testSound.successSound')}
            </Button>
            <Button
              onClick={() => handlePlaySound('info')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {t('testSound.infoSound')}
            </Button>
            <Button
              onClick={() => handlePlaySound('warning')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              {t('testSound.warningSound')}
            </Button>
            <Button
              onClick={() => handlePlaySound('error')}
              className="bg-red-500 hover:bg-red-600"
            >
              {t('testSound.errorSound')}
            </Button>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-3">{t('testSound.testRealTimeNotifications')}</h2>
          <div className="space-y-3">
            <Button
              onClick={async () => {
                try {
                  const response = await fetch('/api/test-instant-notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      type: 'success',
                      title: t('testSound.taskCompletedTitle'),
                      message: t('testSound.taskCompletedMessage')
                    })
                  })
                  
                  if (!response.ok) {
                    throw new Error(t('testSound.failedToSend'))
                  }
                  
                  const data = await response.json()
                  console.log('✅ Test notification sent:', data)
                } catch (error) {
                  console.error('❌ Error sending test notification:', error)
                }
              }}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              {t('testSound.sendSuccessNotification')}
            </Button>
            
            <Button
              onClick={async () => {
                try {
                  const response = await fetch('/api/test-instant-notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      type: 'warning',
                      title: t('testSound.taskOverdueTitle'),
                      message: t('testSound.taskOverdueMessage')
                    })
                  })
                  
                  if (!response.ok) {
                    throw new Error(t('testSound.failedToSend'))
                  }
                  
                  const data = await response.json()
                  console.log('⚠️ Test warning sent:', data)
                } catch (error) {
                  console.error('❌ Error sending test notification:', error)
                }
              }}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              {t('testSound.sendWarningNotification')}
            </Button>
            
            <Button
              onClick={async () => {
                try {
                  const response = await fetch('/api/test-task-notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      type: 'info'
                    })
                  })
                  
                  if (!response.ok) {
                    throw new Error(t('testSound.failedToSendTask'))
                  }
                  
                  const data = await response.json()
                  console.log('📋 Test task notification sent:', data)
                } catch (error) {
                  console.error('❌ Error sending test task notification:', error)
                }
              }}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {t('testSound.testTaskNotification')}
            </Button>
            
            <p className="text-sm text-gray-600 mt-2">
              {t('testSound.notificationHint')}
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <h3 className="font-medium">{t('testSound.troubleshooting')}</h3>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>{t('testSound.volumeUp')}</li>
            <li>{t('testSound.checkConsole')}</li>
            <li>{t('testSound.browserBlocksAudio')}</li>
            <li>{t('testSound.tryDifferentBrowsers')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}