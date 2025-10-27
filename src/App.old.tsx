import { useState } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, Select, Badge, Modal } from '@/shared/components/ui'
import { Upload, FileText, Users, BarChart3, Settings, CheckCircle, AlertCircle, Database } from 'lucide-react'
import { TestSupabase } from './TestSupabase'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showTest, setShowTest] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cycle: '',
  })

  const cycleOptions = [
    { value: 'SRA', label: 'Senior Airman (SRA)' },
    { value: 'SSG', label: 'Staff Sergeant (SSG)' },
    { value: 'TSG', label: 'Technical Sergeant (TSG)' },
    { value: 'MSG', label: 'Master Sergeant (MSG)' },
    { value: 'SMS', label: 'Senior Master Sergeant (SMS)' },
    { value: 'CMS', label: 'Chief Master Sergeant (CMS)' },
  ]

  if (showTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-slate-900">Supabase Connection Test</h1>
              <Button variant="ghost" onClick={() => setShowTest(false)}>
                Back to Demo
              </Button>
            </div>
          </div>
        </header>
        <TestSupabase />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">PACE System</h1>
              <Badge variant="primary">v2.0</Badge>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Dashboard</a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Rosters</a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Reports</a>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Database className="w-4 h-4" />}
                onClick={() => setShowTest(true)}
              >
                Test Supabase
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome to PACE Enhancement
          </h2>
          <p className="text-slate-600">
            Modern React application with Tailwind CSS and Supabase integration
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Files Uploaded</p>
                <p className="text-2xl font-bold text-slate-900">24</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <Users className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Members</p>
                <p className="text-2xl font-bold text-slate-900">1,428</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Eligible</p>
                <p className="text-2xl font-bold text-slate-900">892</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 bg-special/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-special" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-2xl font-bold text-slate-900">12</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Form */}
        <Card variant="bordered" className="mb-8">
          <CardHeader>
            <CardTitle>Component Demo</CardTitle>
            <CardDescription>
              Testing our custom Tailwind components with the modern color palette
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                leftIcon={<Users className="w-4 h-4" />}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                helperText="We'll never share your email"
              />

              <Select
                label="Promotion Cycle"
                placeholder="Select a cycle"
                options={cycleOptions}
                value={formData.cycle}
                onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
              />

              <div className="flex items-end">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full"
                >
                  Open Modal Demo
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="special">Special</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="link">Link</Button>
            </div>

            <div className="mt-6">
              <Button loading className="mr-3">
                Loading State
              </Button>
              <Button leftIcon={<Upload className="w-4 h-4" />}>
                With Icon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Roster Upload</CardTitle>
              <CardDescription>
                Upload and process military roster files with automatic eligibility checking
              </CardDescription>
            </CardHeader>
          </Card>

          <Card variant="elevated" className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="p-3 bg-success/10 rounded-lg w-fit mb-4">
                <Users className="w-8 h-8 text-success" />
              </div>
              <CardTitle>Member Management</CardTitle>
              <CardDescription>
                Edit, add, and manage roster members with full audit trail
              </CardDescription>
            </CardHeader>
          </Card>

          <Card variant="elevated" className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="p-3 bg-special/10 rounded-lg w-fit mb-4">
                <BarChart3 className="w-8 h-8 text-special" />
              </div>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Real-time statistics and trend analysis for promotion eligibility
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>

      {/* Modal Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modal Demo"
        description="This is a demonstration of our custom modal component"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-success/10 rounded-lg">
            <CheckCircle className="w-6 h-6 text-success" />
            <div>
              <p className="font-semibold text-slate-900">Setup Complete!</p>
              <p className="text-sm text-slate-600">
                Your new PACE frontend with Tailwind CSS is ready
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">Next Steps:</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Connect to Supabase database</span>
              </li>
              <li className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span>Configure VPS backend integration</span>
              </li>
              <li className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span>Implement authentication flow</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default App