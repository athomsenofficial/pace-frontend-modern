import { useState, useEffect } from 'react'
import { supabase, auth, db } from '@/lib/supabase'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Badge } from '@/shared/components/ui'
import { CheckCircle, XCircle, Loader2, Database, User, Shield, HardDrive } from 'lucide-react'

// Export for browser testing
if (typeof window !== 'undefined') {
  (window as any).supabase = supabase
}

export function TestSupabase() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing')
  const [testResults, setTestResults] = useState<any>({})
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userStatus, setUserStatus] = useState<any>(null)

  useEffect(() => {
    testConnection()
    checkAuthStatus()
  }, [])

  const testConnection = async () => {
    setConnectionStatus('testing')
    const results: any = {}

    try {
      // Test 1: Basic connection
      const { error: pingError } = await supabase.from('profiles').select('count').single()
      results.connection = !pingError

      // Test 2: Check if tables exist
      const tables = [
        'profiles', 'units', 'roster_sessions', 'roster_members',
        'senior_raters', 'reports', 'audit_logs'
      ]

      for (const table of tables) {
        try {
          await supabase.from(table).select('count').single()
          results[`table_${table}`] = true
        } catch {
          results[`table_${table}`] = false
        }
      }

      setTestResults(results)
      setConnectionStatus(results.connection ? 'connected' : 'failed')
    } catch (error) {
      console.error('Connection test failed:', error)
      setConnectionStatus('failed')
    }
  }

  const checkAuthStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      setUserStatus(session.user)
    }
  }

  const testSignUp = async () => {
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }

    const { data, error } = await auth.signUp(email, password, {
      full_name: 'Test User',
      username: email.split('@')[0]
    })

    if (error) {
      alert(`Sign up failed: ${error.message}`)
    } else {
      alert('Sign up successful! Check your email for confirmation.')
      console.log('Sign up data:', data)
    }
  }

  const testSignIn = async () => {
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }

    const { data, error } = await auth.signIn(email, password)

    if (error) {
      alert(`Sign in failed: ${error.message}`)
    } else {
      alert('Sign in successful!')
      setUserStatus(data.user)
    }
  }

  const testSignOut = async () => {
    await auth.signOut()
    setUserStatus(null)
    alert('Signed out successfully')
  }

  const createTestData = async () => {
    if (!userStatus) {
      alert('Please sign in first')
      return
    }

    try {
      // Create a test unit
      const { data: unit, error: unitError } = await supabase
        .from('units')
        .insert({
          name: 'Test Unit',
          pascode: `TEST-${Date.now()}`,
          is_active: true
        } as any)
        .select()
        .single()

      if (unitError) throw unitError

      // Create a test roster session
      const { data: session, error: sessionError } = await db.rosterSessions.create({
        session_type: 'initial_mel',
        cycle: 'SSG',
        year: 2024,
        status: 'draft',
        unit_id: unit!.id,
        created_by: userStatus.id
      })

      if (sessionError) throw sessionError

      alert('Test data created successfully!')
      console.log('Created unit:', unit)
      console.log('Created session:', session)
    } catch (error: any) {
      alert(`Failed to create test data: ${error.message}`)
      console.error(error)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Supabase Connection Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center gap-3">
              <span className="font-medium">Connection Status:</span>
              {connectionStatus === 'testing' && (
                <Badge variant="warning" className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Testing...
                </Badge>
              )}
              {connectionStatus === 'connected' && (
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Connected
                </Badge>
              )}
              {connectionStatus === 'failed' && (
                <Badge variant="danger" className="flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Failed
                </Badge>
              )}
            </div>

            {/* Project Info */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Project Info:</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-slate-600">URL:</span>{' '}
                  <code className="bg-white px-2 py-1 rounded">
                    {import.meta.env.VITE_SUPABASE_URL}
                  </code>
                </div>
                <div>
                  <span className="text-slate-600">Project Ref:</span>{' '}
                  <code className="bg-white px-2 py-1 rounded">swvkaqrdhyoccwtzqabg</code>
                </div>
              </div>
            </div>

            {/* Table Status */}
            {Object.keys(testResults).length > 0 && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Database Tables:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(testResults).map(([key, value]) => {
                    if (key.startsWith('table_')) {
                      const tableName = key.replace('table_', '')
                      return (
                        <div key={key} className="flex items-center gap-2">
                          {value ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <XCircle className="w-4 h-4 text-danger" />
                          )}
                          <span>{tableName}</span>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            )}

            <Button onClick={testConnection} variant="outline">
              Retest Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Authentication Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current User Status */}
            <div className="flex items-center gap-3">
              <span className="font-medium">Auth Status:</span>
              {userStatus ? (
                <Badge variant="success">
                  Signed in as: {userStatus.email}
                </Badge>
              ) : (
                <Badge variant="default">Not signed in</Badge>
              )}
            </div>

            {/* Auth Forms */}
            {!userStatus ? (
              <div className="space-y-4">
                <Input
                  type="email"
                  label="Email"
                  placeholder="test@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex gap-3">
                  <Button onClick={testSignUp} variant="outline">
                    Sign Up
                  </Button>
                  <Button onClick={testSignIn} variant="primary">
                    Sign In
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">User Info:</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-slate-600">ID:</span> {userStatus.id}
                    </div>
                    <div>
                      <span className="text-slate-600">Email:</span> {userStatus.email}
                    </div>
                    <div>
                      <span className="text-slate-600">Created:</span>{' '}
                      {new Date(userStatus.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={testSignOut} variant="outline">
                    Sign Out
                  </Button>
                  <Button onClick={createTestData} variant="success">
                    Create Test Data
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Setup Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              {testResults.connection ? (
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-danger mt-0.5" />
              )}
              <div>
                <p className="font-medium">Database Connection</p>
                <p className="text-sm text-slate-600">
                  {testResults.connection
                    ? 'Successfully connected to Supabase'
                    : 'Not connected - check your credentials'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {Object.keys(testResults).filter(k => k.startsWith('table_') && testResults[k]).length > 0 ? (
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-danger mt-0.5" />
              )}
              <div>
                <p className="font-medium">Database Schema</p>
                <p className="text-sm text-slate-600">
                  {Object.keys(testResults).filter(k => k.startsWith('table_') && testResults[k]).length > 0
                    ? `${Object.keys(testResults).filter(k => k.startsWith('table_') && testResults[k]).length} tables found`
                    : 'No tables found - run the schema.sql in Supabase SQL Editor'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HardDrive className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="font-medium">Storage Buckets</p>
                <p className="text-sm text-slate-600">
                  Create buckets in Supabase Dashboard: logos, rosters, reports
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}