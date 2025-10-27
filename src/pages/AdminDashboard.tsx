import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge } from '@/shared/components/ui'
import { Users, Shield, FileText, Database, Settings, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AdminDashboard() {
  const userStats = {
    total: 142,
    admins: 8,
    editors: 24,
    viewers: 110,
    active: 98,
  }

  const systemStats = {
    sessions: 245,
    reports: 186,
    storage: '12.4 GB',
    uptime: '99.8%',
  }

  const recentActivity = [
    { user: 'John Smith', action: 'Created Initial MEL', type: 'SSG 2024', time: '5 min ago', status: 'success' },
    { user: 'Sarah Johnson', action: 'Generated Memorandum', type: 'Award Memo', time: '15 min ago', status: 'success' },
    { user: 'Mike Williams', action: 'Updated User Role', type: 'Editor → Admin', time: '1 hour ago', status: 'warning' },
    { user: 'Jennifer Brown', action: 'Failed Login Attempt', type: 'Security Alert', time: '2 hours ago', status: 'danger' },
  ]

  const systemHealth = [
    { name: 'API Server', status: 'healthy', uptime: '99.9%', latency: '45ms' },
    { name: 'Database', status: 'healthy', uptime: '100%', latency: '12ms' },
    { name: 'Storage', status: 'warning', uptime: '98.5%', latency: '120ms' },
    { name: 'Cache', status: 'healthy', uptime: '99.7%', latency: '8ms' },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-danger" />
      default:
        return <Clock className="w-5 h-5 text-slate-400" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <h2 className="text-3xl font-bold text-slate-900">Administrative Dashboard</h2>
          <Badge variant="danger">Admin Only</Badge>
        </div>
        <p className="text-slate-600">System overview, user management, and administrative controls</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center space-x-4 pt-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{userStats.total}</p>
              <p className="text-xs text-success">{userStats.active} active</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center space-x-4 pt-6">
            <div className="p-3 bg-success/10 rounded-lg">
              <FileText className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Sessions</p>
              <p className="text-2xl font-bold text-slate-900">{systemStats.sessions}</p>
              <p className="text-xs text-slate-600">All time</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center space-x-4 pt-6">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Database className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Storage Used</p>
              <p className="text-2xl font-bold text-slate-900">{systemStats.storage}</p>
              <p className="text-xs text-slate-600">of 50 GB</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center space-x-4 pt-6">
            <div className="p-3 bg-special/10 rounded-lg">
              <Activity className="w-6 h-6 text-special" />
            </div>
            <div>
              <p className="text-sm text-slate-500">System Uptime</p>
              <p className="text-2xl font-bold text-slate-900">{systemStats.uptime}</p>
              <p className="text-xs text-success">Last 30 days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Roles Breakdown */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
            <CardDescription>Distribution by role type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-danger/5 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-danger" />
                  <span className="font-medium text-slate-900">Super Admin</span>
                </div>
                <Badge variant="danger">{userStats.admins}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning/5 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-warning" />
                  <span className="font-medium text-slate-900">Editor</span>
                </div>
                <Badge variant="warning">{userStats.editors}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="font-medium text-slate-900">Viewer</span>
                </div>
                <Badge variant="primary">{userStats.viewers}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start" leftIcon={<Users className="w-4 h-4" />}>
                  Manage Users
                </Button>
              </Link>
              <Link to="/admin/roles">
                <Button variant="outline" className="w-full justify-start" leftIcon={<Shield className="w-4 h-4" />}>
                  Role Permissions
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="outline" className="w-full justify-start" leftIcon={<Settings className="w-4 h-4" />}>
                  System Settings
                </Button>
              </Link>
              <Link to="/reports">
                <Button variant="outline" className="w-full justify-start" leftIcon={<FileText className="w-4 h-4" />}>
                  View All Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Service status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemHealth.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(service.status)}
                    <span className="text-sm font-medium text-slate-900">{service.name}</span>
                  </div>
                  <span className="text-xs text-slate-600">{service.latency}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system events and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(activity.status)}
                  <div>
                    <p className="font-medium text-slate-900">{activity.user}</p>
                    <p className="text-sm text-slate-600">
                      {activity.action} - <span className="font-medium">{activity.type}</span>
                    </p>
                  </div>
                </div>
                <span className="text-sm text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
