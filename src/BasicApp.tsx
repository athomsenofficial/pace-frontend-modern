function BasicApp() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
          PACE System v2.0 - Test Page
        </h1>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            React App is Running!
          </h2>

          <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
            If you can see this message, the React app is loading correctly.
          </p>

          <button style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
          onClick={() => alert('Button clicked! React is working!')}>
            Test Button
          </button>

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.25rem' }}>
            <p style={{ color: '#1e40af' }}>
              <strong>Next Steps:</strong><br/>
              1. This basic app is working<br/>
              2. We'll add Tailwind CSS next<br/>
              3. Then add the UI components
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicApp