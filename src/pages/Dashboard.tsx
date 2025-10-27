import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '@/shared/components/ui'
import { Upload, Users, FileText, BarChart3, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome to PACE
        </h2>
        <p className="text-slate-600">
          Personnel & Administrative Collaboration Engine - Process MEL rosters efficiently
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card variant="elevated" className="hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Initial MEL</CardTitle>
            <CardDescription>
              Upload roster file to generate Initial Master Eligibility Listing with automatic eligibility checks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/initial-mel">
              <Button className="w-full" leftIcon={<Upload className="w-4 h-4" />}>
                Start Initial MEL
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card variant="elevated" className="hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="p-3 bg-success/10 rounded-lg w-fit mb-4">
              <FileText className="w-8 h-8 text-success" />
            </div>
            <CardTitle>Final MEL</CardTitle>
            <CardDescription>
              Upload roster file to generate Final Master Eligibility Listing with senior rater signature block
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/final-mel">
              <Button variant="success" className="w-full" leftIcon={<FileText className="w-4 h-4" />}>
                Start Final MEL
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card variant="elevated" className="hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="p-3 bg-special/10 rounded-lg w-fit mb-4">
              <AlertCircle className="w-8 h-8 text-special" />
            </div>
            <CardTitle>How To Guide</CardTitle>
            <CardDescription>
              Step-by-step instructions for using the MEL generators and file preparation requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/how-to">
              <Button variant="outline" className="w-full" leftIcon={<AlertCircle className="w-4 h-4" />}>
                View Guide
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest roster processing sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'Initial MEL', cycle: 'SSG', year: 2025, status: 'completed', members: 187, time: '3 hours ago' },
              { type: 'Initial MEL', cycle: 'TSG', year: 2025, status: 'completed', members: 142, time: '8 hours ago' },
              { type: 'Initial MEL', cycle: 'TSG', year: 2025, status: 'completed', members: 139, time: '1 day ago' },
              { type: 'Initial MEL', cycle: 'SSG', year: 2025, status: 'completed', members: 203, time: '2 days ago' },
              { type: 'Initial MEL', cycle: 'SSG', year: 2025, status: 'completed', members: 198, time: '4 days ago' },
              { type: 'Initial MEL', cycle: 'TSG', year: 2025, status: 'completed', members: 156, time: '6 days ago' },
              { type: 'Initial MEL', cycle: 'TSG', year: 2025, status: 'completed', members: 151, time: '8 days ago' },
              { type: 'Initial MEL', cycle: 'SSG', year: 2025, status: 'completed', members: 215, time: '10 days ago' },
              { type: 'Initial MEL', cycle: 'SSG', year: 2025, status: 'completed', members: 209, time: '12 days ago' },
              { type: 'Initial MEL', cycle: 'TSG', year: 2025, status: 'completed', members: 164, time: '14 days ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.status === 'completed' ? 'bg-success/10' : 'bg-warning/10'
                }`}>
                  {activity.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <Clock className="w-5 h-5 text-warning" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{activity.type} - {activity.cycle} {activity.year}</p>
                  <p className="text-sm text-slate-600">{activity.members} members • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card variant="elevated">
          <CardHeader>
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Automated Processing</CardTitle>
            <CardDescription>
              Intelligent eligibility checks based on TIG, TIS, AFSC, and promotion policies
            </CardDescription>
          </CardHeader>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <div className="p-3 bg-success/10 rounded-lg w-fit mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <CardTitle>Compliance Ready</CardTitle>
            <CardDescription>
              CUI-compliant PDFs with proper headers, footers, and senior rater signatures
            </CardDescription>
          </CardHeader>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <div className="p-3 bg-special/10 rounded-lg w-fit mb-4">
              <AlertCircle className="w-8 h-8 text-special" />
            </div>
            <CardTitle>Discrepancy Tracking</CardTitle>
            <CardDescription>
              Automatic flagging of members requiring manual review with detailed reason codes
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
