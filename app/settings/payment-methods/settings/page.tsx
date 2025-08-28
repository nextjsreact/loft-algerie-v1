"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Settings, CreditCard, DollarSign, Bell, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PaymentMethodsSettingsPage() {
  const { t } = useTranslation(['paymentMethods', 'common'])
  const [settings, setSettings] = useState({
    defaultCurrency: 'DZD',
    enableNotifications: true,
    requireConfirmation: true,
    autoValidation: false,
    defaultFees: '2.5',
    maxAmount: '100000',
    enableStripe: false,
    enablePayPal: false,
    stripeApiKey: '',
    paypalClientId: ''
  })

  const handleSave = () => {
    // Logique de sauvegarde
    alert(t('settingsSavedSuccessfully'))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* En-tête */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings/payment-methods">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('back')}
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                <Settings className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {t('paymentMethodsSettings')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {t('configureGlobalSettings')}
                </p>
              </div>
            </div>
          </div>

          {/* Configuration générale */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <CreditCard className="h-6 w-6" />
                {t('generalConfiguration')}
              </CardTitle>
              <CardDescription>
                {t('basicSettingsForAllMethods')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">{t('defaultCurrency')}</Label>
                  <Select value={settings.defaultCurrency} onValueChange={(value) => setSettings({...settings, defaultCurrency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DZD">{t('algerianDinar')}</SelectItem>
                      <SelectItem value="EUR">{t('euro')}</SelectItem>
                      <SelectItem value="USD">{t('usDollar')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultFees">{t('defaultFees')}</Label>
                  <Input 
                    id="defaultFees"
                    type="number"
                    value={settings.defaultFees}
                    onChange={(e) => setSettings({...settings, defaultFees: e.target.value})}
                    placeholder="2.5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAmount">{t('maxAmountAllowed')}</Label>
                <Input 
                  id="maxAmount"
                  type="number"
                  value={settings.maxAmount}
                  onChange={(e) => setSettings({...settings, maxAmount: e.target.value})}
                  placeholder="100000"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sécurité et Validation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6" />
                {t('securityAndValidation')}
              </CardTitle>
              <CardDescription>
                {t('securitySettingsForTransactions')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('confirmationRequired')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('requestConfirmationForEachTransaction')}
                  </p>
                </div>
                <Switch 
                  checked={settings.requireConfirmation}
                  onCheckedChange={(checked) => setSettings({...settings, requireConfirmation: checked})}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('automaticValidation')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('automaticallyValidateSmallAmounts')}
                  </p>
                </div>
                <Switch 
                  checked={settings.autoValidation}
                  onCheckedChange={(checked) => setSettings({...settings, autoValidation: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Bell className="h-6 w-6" />
                {t('notifications')}
              </CardTitle>
              <CardDescription>
                {t('notificationSettingsForPayments')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('notificationsEnabled')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('receiveNotificationsForNewPayments')}
                  </p>
                </div>
                <Switch 
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, enableNotifications: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Intégrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <DollarSign className="h-6 w-6" />
                {t('apiIntegrations')}
              </CardTitle>
              <CardDescription>
                {t('externalPaymentServicesConfiguration')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('stripe')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('enableStripeIntegration')}
                    </p>
                  </div>
                  <Switch 
                    checked={settings.enableStripe}
                    onCheckedChange={(checked) => setSettings({...settings, enableStripe: checked})}
                  />
                </div>
                
                {settings.enableStripe && (
                  <div className="space-y-2 ml-4">
                    <Label htmlFor="stripeApiKey">{t('stripeApiKey')}</Label>
                    <Input 
                      id="stripeApiKey"
                      type="password"
                      value={settings.stripeApiKey}
                      onChange={(e) => setSettings({...settings, stripeApiKey: e.target.value})}
                      placeholder="sk_test_..."
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('paypal')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('enablePaypalIntegration')}
                    </p>
                  </div>
                  <Switch 
                    checked={settings.enablePayPal}
                    onCheckedChange={(checked) => setSettings({...settings, enablePayPal: checked})}
                  />
                </div>
                
                {settings.enablePayPal && (
                  <div className="space-y-2 ml-4">
                    <Label htmlFor="paypalClientId">{t('paypalClientId')}</Label>
                    <Input 
                      id="paypalClientId"
                      value={settings.paypalClientId}
                      onChange={(e) => setSettings({...settings, paypalClientId: e.target.value})}
                      placeholder="AXxxx..."
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSave} size="lg" className="flex-1">
              {t('saveSettings')}
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/settings/payment-methods">
                {t('cancel')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}