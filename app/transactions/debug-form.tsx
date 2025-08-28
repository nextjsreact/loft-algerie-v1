"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export default function DebugForm() {
  const { t } = useTranslation();
  const [type, setType] = useState('income')
  const [status, setStatus] = useState('completed')

  const handleSubmit = async () => {
    console.log('Submitting:', { type, status })
    const res = await fetch('/api/debug-transaction', {
      method: 'POST',
      body: JSON.stringify({ type, status }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await res.json()
    console.log('Server response:', result)
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <label>{t('type', { ns: 'transactions' })}:</label>
        <select
          value={type}
          onChange={(e) => {
            console.log('Type changed to:', e.target.value)
            setType(e.target.value)
          }}
          className="border p-2 ml-2"
        >
          <option value="income">{t('income', { ns: 'transactions' })}</option>
          <option value="expense">{t('expense', { ns: 'transactions' })}</option>
        </select>
      </div>

      <div>
        <label>{t('status', { ns: 'transactions' })}:</label>
        <select
          value={status}
          onChange={(e) => {
            console.log('Status changed to:', e.target.value)
            setStatus(e.target.value)
          }}
          className="border p-2 ml-2"
        >
          <option value="pending">{t('pending', { ns: 'transactions' })}</option>
          <option value="completed">{t('completed', { ns: 'transactions' })}</option>
        </select>
      </div>

      <Button onClick={handleSubmit}>{t('common.submit')}</Button>
    </div>
  )
}
