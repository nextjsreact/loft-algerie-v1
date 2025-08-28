"use client"

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/hooks/useTranslation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export default function TestReservationsTranslation() {
  const { t, validateTranslations, language, changeLanguage } = useTranslation(['common', 'reservations'], {
    validate: true,
    namespace: 'reservations'
  })

  const [validationResult, setValidationResult] = useState<any>(null)

  const runValidation = () => {
    const expectedKeys = [
      'title', 'subtitle', 'totalReservations', 'monthlyRevenue', 'occupancyRate',
      'guestSatisfaction', 'quickActions', 'recentActivity', 'newReservation',
      'professionalTools', 'availabilityManagement', 'liveView', 'manageGuests',
      'viewReports', 'checkInCompleted', 'reservationCancelled', 'reservationsList',
      'advancedListView', 'advancedListDescription', 'reservationAnalytics',
      'enterpriseAnalyticsSuite', 'enterpriseAnalyticsDescription',
      'form.title', 'form.loft', 'form.selectLoft', 'form.guestCount', 'form.guest',
      'form.guests', 'form.checkIn', 'form.checkOut', 'form.guestInfo', 'form.guestName',
      'form.guestEmail', 'form.guestPhone', 'form.guestNationality', 'form.specialRequests',
      'form.specialRequestsPlaceholder', 'form.checkingAvailability', 'form.notAvailable',
      'form.available', 'form.basePrice', 'form.cleaningFee', 'form.serviceFee', 'form.taxes',
      'form.total', 'form.creating', 'form.createReservation', 'form.errorCreating',
      'form.successCreated', 'form.successDescription', 'form.propertyGuestDetails',
      'form.stayDates', 'form.pricingBreakdown', 'form.availabilityPerfect', 'form.professional'
    ]
    
    const result = validateTranslations(expectedKeys)
    setValidationResult(result)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Reservations Translation Test</h1>
          <p className="text-gray-600">Test and validate reservations translations across all languages</p>
          
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm font-medium">Current Language:</span>
            <Badge variant="outline">{language}</Badge>
            <Select value={language} onValueChange={changeLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={runValidation}>Run Validation</Button>
          </div>
        </div>

        {/* Validation Results */}
        {validationResult && (
          <Card>
            <CardHeader>
              <CardTitle>Validation Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge variant={validationResult.valid ? "default" : "destructive"}>
                    {validationResult.valid ? "✅ Valid" : "❌ Invalid"}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {validationResult.missing?.length || 0} missing keys
                  </span>
                </div>
                
                {validationResult.missing && validationResult.missing.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">Missing Translation Keys:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {validationResult.missing.map((key: string, index: number) => (
                        <li key={index}>• {key}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Page Level Translations */}
          <Card>
            <CardHeader>
              <CardTitle>Page Level Translations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Title</label>
                  <p className="font-semibold">{t('reservations:title')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Subtitle</label>
                  <p className="font-semibold">{t('reservations:subtitle')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Reservations</label>
                  <p className="font-semibold">{t('reservations:totalReservations')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Monthly Revenue</label>
                  <p className="font-semibold">{t('reservations:monthlyRevenue')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Occupancy Rate</label>
                  <p className="font-semibold">{t('reservations:occupancyRate')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Guest Satisfaction</label>
                  <p className="font-semibold">{t('reservations:guestSatisfaction')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Level Translations */}
          <Card>
            <CardHeader>
              <CardTitle>Form Level Translations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Form Title</label>
                  <p className="font-semibold">{t('reservations:form.title')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Loft</label>
                  <p className="font-semibold">{t('reservations:form.loft')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Guest Count</label>
                  <p className="font-semibold">{t('reservations:form.guestCount')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Check-in</label>
                  <p className="font-semibold">{t('reservations:form.checkIn')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Check-out</label>
                  <p className="font-semibold">{t('reservations:form.checkOut')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Guest Info</label>
                  <p className="font-semibold">{t('reservations:form.guestInfo')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Translations */}
          <Card>
            <CardHeader>
              <CardTitle>Status Translations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Confirmed</label>
                  <p className="font-semibold">{t('reservations:status.confirmed')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Pending</label>
                  <p className="font-semibold">{t('reservations:status.pending')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cancelled</label>
                  <p className="font-semibold">{t('reservations:status.cancelled')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Completed</label>
                  <p className="font-semibold">{t('reservations:status.completed')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Translations */}
          <Card>
            <CardHeader>
              <CardTitle>Common Translations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">List</label>
                  <p className="font-semibold">{t('common:list')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Analytics</label>
                  <p className="font-semibold">{t('common:analytics')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Coming Soon</label>
                  <p className="font-semibold">{t('common:comingSoon')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Enterprise</label>
                  <p className="font-semibold">{t('common:enterprise')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cancel</label>
                  <p className="font-semibold">{t('common:cancel')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Save</label>
                  <p className="font-semibold">{t('common:actions.save')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Section */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar Translations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Calendar Title</label>
                <p className="font-semibold">{t('reservations:calendar.title')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Month</label>
                <p className="font-semibold">{t('reservations:calendar.month')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Week</label>
                <p className="font-semibold">{t('reservations:calendar.week')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Day</label>
                <p className="font-semibold">{t('reservations:calendar.day')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability Section */}
        <Card>
          <CardHeader>
            <CardTitle>Availability Translations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Management</label>
                <p className="font-semibold">{t('reservations:availability.management')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Block Dates</label>
                <p className="font-semibold">{t('reservations:availability.blockDates')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Choose Loft</label>
                <p className="font-semibold">{t('reservations:availability.chooseLoft')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p className="font-semibold">{t('reservations:availability.startDate')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}