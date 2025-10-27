import { useState } from 'react'

function StepByStepApp() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">PACE System - Step by Step Build</h1>

      <div className="mb-4">
        <p className="text-gray-600">If you see this text, basic Tailwind is working!</p>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Count: {count}
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <p>This is a simple test box</p>
      </div>
    </div>
  )
}

export default StepByStepApp