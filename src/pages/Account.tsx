import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Select, Button, Badge } from '@/shared/components/ui'
import { User, Mail, Phone, Building, Shield, Key, Bell, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function Account() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const rankOptions = [
    { value: 'AB', label: 'Airman Basic (AB)' },
    { value: 'Amn', label: 'Airman (Amn)' },
    { value: 'A1C', label: 'Airman First Class (A1C)' },
    { value: 'SrA', label: 'Senior Airman (SrA)' },
    { value: 'SSgt', label: 'Staff Sergeant (SSgt)' },
    { value: 'TSgt', label: 'Technical Sergeant (TSgt)' },
    { value: 'MSgt', label: 'Master Sergeant (MSgt)' },
    { value: 'SMSgt', label: 'Senior Master Sergeant (SMSgt)' },
    { value: 'CMSgt', label: 'Chief Master Sergeant (CMSgt)' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Account Settings</h2>
        <p className="text-slate-600">Manage your profile, security settings, and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your personal and military information</CardDescription>
                </div>
              </div>
              <Badge variant="primary">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  leftIcon={<User className="w-4 h-4" />}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Rank"
                  options={rankOptions}
                  defaultValue="MSgt"
                />
                <Input
                  label="SSAN (Last 4)"
                  placeholder="1234"
                  maxLength={4}
                />
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="john.doe@us.af.mil"
                leftIcon={<Mail className="w-4 h-4" />}
                helperText="Official .mil email address"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  leftIcon={<Phone className="w-4 h-4" />}
                />
                <Input
                  label="Office Symbol"
                  placeholder="e.g., 1 IS/SCO"
                />
              </div>

              <Input
                label="Unit/Organization"
                placeholder="1st Information Systems Squadron"
                leftIcon={<Building className="w-4 h-4" />}
              />

              <Input
                label="Base/Location"
                placeholder="e.g., Joint Base San Antonio"
              />

              <Button leftIcon={<User className="w-4 h-4" />}>
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Role and Permissions */}
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Shield className="w-5 h-5 text-warning" />
              </div>
              <div>
                <CardTitle>Role & Permissions</CardTitle>
                <CardDescription>Your access level and capabilities</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-warning/5 border border-warning rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900">Current Role</span>
                  <Badge variant="warning">Editor</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  You can create and edit MELs, generate memoranda, and view reports
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-slate-700">Process Initial & Final MELs</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-slate-700">Generate Memoranda</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-slate-700">View and Download Reports</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    <span className="text-slate-400">User Management (Admin only)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    <span className="text-slate-400">System Settings (Admin only)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Contact your system administrator to request a role change
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-danger/10 rounded-lg">
                <Key className="w-5 h-5 text-danger" />
              </div>
              <div>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Password and authentication</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  helperText="Minimum 8 characters, include uppercase, lowercase, number, and special character"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
              />

              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 text-sm mb-2">Password Requirements</h4>
                <ul className="space-y-1 text-xs text-slate-600">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character (@, #, $, etc.)</li>
                </ul>
              </div>

              <Button variant="danger" leftIcon={<Key className="w-4 h-4" />}>
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Bell className="w-5 h-5 text-success" />
              </div>
              <div>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>How you want to be notified</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Email Notifications</p>
                  <p className="text-sm text-slate-600">Receive updates via email</p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">MEL Processing Complete</p>
                  <p className="text-sm text-slate-600">Notify when processing finishes</p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">System Announcements</p>
                  <p className="text-sm text-slate-600">Important system updates</p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Security Alerts</p>
                  <p className="text-sm text-slate-600">Login attempts and security events</p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
