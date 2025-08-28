'use client';

import { useTranslation } from '@/lib/i18n/context';

export default function TestTranslationsPage() {
  const { t } = useTranslation('reservations');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Reservations Translations</h1>

      <div className="space-y-2">
        <p><strong>reservations.title:</strong> {t('title')}</p>
        <p><strong>reservations.description:</strong> {t('description')}</p>
        <p><strong>reservations.vsLastMonth:</strong> {t('vsLastMonth')}</p>
        <p><strong>reservations.analytics.totalReservations:</strong> {t('analytics.totalReservations')}</p>
        <p><strong>reservations.status.confirmed:</strong> {t('status.confirmed')}</p>
        <p><strong>reservations.form.title:</strong> {t('form.title')}</p>
      </div>
    </div>
  );
}
