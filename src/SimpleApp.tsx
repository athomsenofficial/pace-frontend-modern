import { Button } from '@/shared/components/ui'

function SimpleApp() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          PACE System v2.0
        </h1>
        <p className="text-gray-600 mb-8">
          If you can see this, the app is working!
        </p>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Test Components</h2>

          <div className="space-y-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>

            <div className="p-4 bg-blue-50 rounded">
              <p className="text-blue-800">
                Tailwind CSS is working if this box is blue!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleApp