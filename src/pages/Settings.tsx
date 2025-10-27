import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Select, Button, Badge } from '@/shared/components/ui'
import { Save, User, Bell, Shield, Database } from 'lucide-react'

export function Settings() {
  const notificationOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'important', label: 'Important Only' },
    { value: 'none', label: 'None' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Settings</h2>
        <p className="text-slate-600">Manage your account and application preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name" placeholder="John" />
                <Input label="Last Name" placeholder="Doe" />
              </div>
              <Input label="Email" type="email" placeholder="john.doe@us.af.mil" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Rank" placeholder="e.g., MSgt" />
                <Input label="Unit" placeholder="e.g., 1st IS" />
              </div>
              <Button leftIcon={<Save className="w-4 h-4" />}>
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Bell className="w-5 h-5 text-success" />
              </div>
              <div>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                label="Email Notifications"
                options={notificationOptions}
                defaultValue="all"
              />
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Processing Complete</p>
                  <p className="text-sm text-slate-600">Get notified when MEL processing finishes</p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Error Alerts</p>
                  <p className="text-sm text-slate-600">Receive alerts for processing errors</p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <Button leftIcon={<Save className="w-4 h-4" />}>
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Shield className="w-5 h-5 text-warning" />
              </div>
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <Input label="New Password" type="password" placeholder="••••••••" />
              <Input label="Confirm New Password" type="password" placeholder="••••••••" />
              <Button variant="warning" leftIcon={<Shield className="w-4 h-4" />}>
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Connection */}
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-special/10 rounded-lg">
                <Database className="w-5 h-5 text-special" />
              </div>
              <div>
                <CardTitle>Database Connection</CardTitle>
                <CardDescription>Supabase connection status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-success/5 border border-success rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-slate-900">Connected</p>
                    <p className="text-sm text-slate-600">Database connection active</p>
                  </div>
                </div>
                <Badge variant="success">Online</Badge>
              </div>
              <Button variant="outline">
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
