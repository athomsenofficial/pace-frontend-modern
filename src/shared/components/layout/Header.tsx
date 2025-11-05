import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Shield } from 'lucide-react'
import { Menu } from '@headlessui/react'
import { useAuthStore } from '@/stores/useAuthStore'

export function Header() {
  const location = useLocation()
  const { hasPermission } = useAuthStore()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const isMELActive = () => {
    return location.pathname === '/initial-mel' || location.pathname === '/final-mel'
  }

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src="/air_force_no_bg_navy.png" alt="Air Force Logo" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-slate-900">PACE</h1>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {/* Dashboard */}
            <Link
              to="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              Dashboard
            </Link>

            {/* MEL Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                  isMELActive()
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                }`}
              >
                <span>Master Eligibility List</span>
                <ChevronDown className="w-4 h-4" />
              </Menu.Button>
              <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/initial-mel"
                        className={`${
                          active ? 'bg-slate-50' : ''
                        } ${
                          isActive('/initial-mel') ? 'bg-primary/5 text-primary' : 'text-slate-700'
                        } block px-4 py-2 text-sm`}
                      >
                        Initial MEL
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/final-mel"
                        className={`${
                          active ? 'bg-slate-50' : ''
                        } ${
                          isActive('/final-mel') ? 'bg-primary/5 text-primary' : 'text-slate-700'
                        } block px-4 py-2 text-sm`}
                      >
                        Final MEL
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>

            {/* Document Generator */}
            <Link
              to="/document-generator"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/document-generator')
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              Document Generator
            </Link>

            {/* How To Guide */}
            <Link
              to="/how-to"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/how-to')
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              How To
            </Link>

            {/* Memorandum Generator - Hidden */}
            {/* <Link
              to="/memo-generator"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/memo-generator')
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              Memorandum
            </Link> */}

            {/* Reports - Hidden */}
            {/* <Link
              to="/reports"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/reports')
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              Reports
            </Link> */}

            {/* Admin Dashboard - Only for admins */}
            {hasPermission('admin') && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                  isActive('/admin')
                    ? 'bg-danger/10 text-danger'
                    : 'text-slate-600 hover:text-danger hover:bg-slate-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Right Actions - Hidden for now */}
          {/* <div className="flex items-center space-x-2"> */}
            {/* Settings - Hidden */}
            {/* <Link to="/settings">
              <Button
                variant="ghost"
                size="icon"
                className={isActive('/settings') ? 'bg-primary/10 text-primary' : ''}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </Link> */}

            {/* User Menu Dropdown - Hidden */}
            {/* <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                {user && (
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-slate-500">{user.rank}</p>
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </Menu.Button>

              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {user && (
                    <div className="px-4 py-3 border-b border-slate-200">
                      <p className="text-sm font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <div className="mt-2">
                        <Badge variant="warning" className="text-xs">{user.role.replace('_', ' ').toUpperCase()}</Badge>
                      </div>
                    </div>
                  )}

                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/account"
                        className={`${
                          active ? 'bg-slate-50' : ''
                        } flex items-center space-x-2 px-4 py-2 text-sm text-slate-700`}
                      >
                        <User className="w-4 h-4" />
                        <span>Account Settings</span>
                      </Link>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={`${
                          active ? 'bg-slate-50' : ''
                        } flex items-center space-x-2 px-4 py-2 text-sm text-slate-700`}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Preferences</span>
                      </Link>
                    )}
                  </Menu.Item>

                  <div className="border-t border-slate-200 my-1"></div>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          logout()
                          navigate('/')
                        }}
                        className={`${
                          active ? 'bg-slate-50' : ''
                        } flex items-center space-x-2 px-4 py-2 text-sm text-danger w-full text-left`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu> */}
          {/* </div> */}
        </div>
      </div>
    </header>
  )
}
