import { useState } from 'react'

function TailwindApp() {
  const [showTest, setShowTest] = useState(false)
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-slate-900">PACE System v2.0</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTest(!showTest)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Toggle Test Section
              </button>
            </div>
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
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-slate-500">Files Uploaded</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">24</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-slate-500">Total Members</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">1,428</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-slate-500">Eligible</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">892</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-slate-500">Completed</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">12</p>
          </div>
        </div>

        {/* Interactive Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Interactive Test</h3>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCount(count + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Count: {count}
            </button>

            <button
              onClick={() => setCount(0)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Test Section (Toggleable) */}
        {showTest && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Test Section</h3>
            <p className="text-yellow-700">
              This section appears when you click "Toggle Test Section" in the header.
              Tailwind CSS is working properly if you see all the colors and styling!
            </p>
          </div>
        )}

        {/* Color Palette Demo */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Color Palette</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-indigo-600 text-white p-4 rounded-lg text-center">
              Primary
            </div>
            <div className="bg-teal-600 text-white p-4 rounded-lg text-center">
              Success
            </div>
            <div className="bg-amber-500 text-white p-4 rounded-lg text-center">
              Warning
            </div>
            <div className="bg-rose-500 text-white p-4 rounded-lg text-center">
              Danger
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TailwindApp