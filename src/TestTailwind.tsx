function TestTailwind() {
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Testing Tailwind</h1>

      {/* Test with inline styles first */}
      <div style={{ backgroundColor: 'lightblue', padding: '20px', marginBottom: '10px' }}>
        This box uses inline styles (should always work)
      </div>

      {/* Test with basic HTML colors */}
      <div style={{ backgroundColor: 'red', color: 'white', padding: '20px', marginBottom: '10px' }}>
        Red box with white text (inline)
      </div>

      {/* Test with Tailwind classes */}
      <div className="bg-blue-500 text-white p-4 mb-4">
        If this has blue background, Tailwind is working
      </div>

      <div className="bg-green-500 text-white p-4 mb-4">
        If this has green background, Tailwind is working
      </div>

      <button
        style={{ backgroundColor: 'purple', color: 'white', padding: '10px 20px', borderRadius: '4px' }}
        onClick={() => alert('Button works!')}
      >
        Test Button (inline style)
      </button>
    </div>
  )
}

export default TestTailwind