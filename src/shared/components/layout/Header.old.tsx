import { Link, useLocation } from 'react-router-dom'
import { Button, Badge } from '@/shared/components/ui'
import { FileText, Settings, User, LogOut } from 'lucide-react'

export function Header() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/initial-mel', label: 'Initial MEL' },
    { path: '/final-mel', label: 'Final MEL' },
    { path: '/members', label: 'Members' },
    { path: '/reports', label: 'Reports' },
  ]

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">PACE System</h1>
              <Badge variant="primary" className="text-xs">v2.0</Badge>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <Link to="/settings">
              <Button
                variant="ghost"
                size="icon"
                className={isActive('/settings') ? 'bg-primary/10 text-primary' : ''}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="sm" leftIcon={<LogOut className="w-4 h-4" />}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
