"use client"

import { useTranslation } from "@/lib/i18n/context"
import NotificationsList from '@/app/notifications/notifications-list'

interface NotificationsWrapperProps {
  notifications: any[]
}

export function NotificationsWrapper({ notifications }: NotificationsWrapperProps) {
  const { t } = useTranslation(["common", "notifications"]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">{t('notifications.title')}</h1>
      <NotificationsList notifications={notifications} />
    </div>
  )
}