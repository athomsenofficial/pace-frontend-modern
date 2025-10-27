import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge } from '@/shared/components/ui'
import { FileText, Download, Eye, Calendar, Users } from 'lucide-react'

export function Reports() {
  const reports = [
    {
      id: 1,
      type: 'Initial MEL',
      cycle: 'SSG',
      year: 2024,
      date: '2024-10-15',
      members: 245,
      status: 'completed',
      fileSize: '2.4 MB',
    },
    {
      id: 2,
      type: 'Final MEL',
      cycle: 'TSG',
      year: 2024,
      date: '2024-10-12',
      members: 189,
      status: 'completed',
      fileSize: '3.1 MB',
    },
    {
      id: 3,
      type: 'Initial MEL',
      cycle: 'MSG',
      year: 2024,
      date: '2024-10-08',
      members: 156,
      status: 'completed',
      fileSize: '1.9 MB',
    },
    {
      id: 4,
      type: 'Final MEL',
      cycle: 'SRA',
      year: 2024,
      date: '2024-10-05',
      members: 412,
      status: 'completed',
      fileSize: '4.8 MB',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Generated Reports</h2>
        <p className="text-slate-600">View and download processed MEL documents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Reports</p>
                <p className="text-xl font-bold text-slate-900">{reports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Users className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Members</p>
                <p className="text-xl font-bold text-slate-900">
                  {reports.reduce((sum, r) => sum + r.members, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-special/10 rounded-lg">
                <Calendar className="w-5 h-5 text-special" />
              </div>
              <div>
                <p className="text-sm text-slate-600">This Month</p>
                <p className="text-xl font-bold text-slate-900">{reports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Download className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Downloads</p>
                <p className="text-xl font-bold text-slate-900">142</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} variant="bordered" className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {report.type} - {report.cycle} {report.year}
                      </h3>
                      <Badge variant="success">Completed</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{report.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{report.members} members</span>
                      </div>
                      <span>{report.fileSize}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                    Preview
                  </Button>
                  <Button variant="primary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Reports State */}
      {reports.length === 0 && (
        <Card variant="bordered" className="text-center py-12">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-slate-100 rounded-full">
                <FileText className="w-12 h-12 text-slate-400" />
              </div>
            </div>
            <CardTitle>No Reports Generated Yet</CardTitle>
            <CardDescription>
              Upload and process roster files to generate MEL reports
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
