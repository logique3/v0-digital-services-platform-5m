'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, RefreshCw, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface AdminSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  phoneNumber: string
  currency: string
  taxRate: number
  maintenanceMode: boolean
}

const defaultSettings: AdminSettings = {
  siteName: 'AtlasVault',
  siteDescription: 'Digital Services Platform',
  contactEmail: 'admin@atlasvault.com',
  phoneNumber: '+216 xx xxx xxxx',
  currency: 'TND',
  taxRate: 0,
  maintenanceMode: false,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings)
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Load settings from localStorage (in production, this would come from a database)
    const savedSettings = localStorage.getItem('adminSettings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }, [])

  const handleChange = (field: keyof AdminSettings, value: any) => {
    setSettings({ ...settings, [field]: value })
    setHasChanges(true)
  }

  const handleSaveSettings = async () => {
    try {
      setLoading(true)
      // Save settings to localStorage (in production, this would be saved to database)
      localStorage.setItem('adminSettings', JSON.stringify(settings))
      toast.success('Settings saved successfully')
      setHasChanges(false)
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure platform settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Basic information about your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Site Name</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) =>
                    handleChange('siteName', e.target.value)
                  }
                  placeholder="Enter site name"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Site Description</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) =>
                    handleChange('siteDescription', e.target.value)
                  }
                  placeholder="Enter site description"
                  className="w-full px-3 py-2 border border-border rounded-lg resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Contact Email</label>
                  <Input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) =>
                      handleChange('contactEmail', e.target.value)
                    }
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    value={settings.phoneNumber}
                    onChange={(e) =>
                      handleChange('phoneNumber', e.target.value)
                    }
                    placeholder="+216 xx xxx xxxx"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Configuration</CardTitle>
              <CardDescription>
                Configure business and financial settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) =>
                      handleChange('currency', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  >
                    <option value="TND">TND (Tunisian Dinar)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Tax Rate (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.taxRate}
                    onChange={(e) =>
                      handleChange('taxRate', parseFloat(e.target.value))
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-400">
                      Payment Methods
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-500 mt-1">
                      Payment methods are configured in the main app settings. Supported methods include D17, Flouci, Card, and Wallet.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                System-level platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Disable access to the platform for users
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    handleChange('maintenanceMode', e.target.checked)
                  }
                  className="w-5 h-5 rounded border-border"
                />
              </div>

              {settings.maintenanceMode && (
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900 dark:text-yellow-400">
                        Maintenance Mode Active
                      </p>
                      <p className="text-sm text-yellow-800 dark:text-yellow-500 mt-1">
                        Users will see a maintenance message when trying to access the platform.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database & Cache</CardTitle>
              <CardDescription>
                Manage database and cache operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear Cache
                </Button>
                <Button variant="destructive" className="flex-1">
                  Backup Database
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Clearing cache will remove all stored data. Backup will create a snapshot of your database.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Changes */}
      {hasChanges && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">You have unsaved changes</p>
                <p className="text-sm text-muted-foreground">
                  Save your settings to apply the changes
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button
                  onClick={handleSaveSettings}
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasChanges && (
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              All changes have been saved
            </p>
          </CardContent>
        </Card>
      )}

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Framework</span>
            <span className="font-medium">Next.js 16</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Database</span>
            <span className="font-medium">Supabase PostgreSQL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Authentication</span>
            <span className="font-medium">Supabase Auth</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
