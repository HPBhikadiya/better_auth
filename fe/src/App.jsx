import { useState, useEffect } from 'react'
import { getSession } from './auth-client'
import Login from './components/Login'
import UserProfile from './components/UserProfile'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const session = await getSession()
      setUser(session?.user || null)
    } catch (error) {
      console.error('Error checking auth status:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = (result) => {
    setUser(result.user)
  }

  const handleSignOut = () => {
    setUser(null)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Better Auth Demo</h1>
        <p>Google Authentication with Better Auth</p>
      </header>
      
      <main className="app-main">
        {user ? (
          <UserProfile user={user} onSignOut={handleSignOut} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </main>
    </div>
  )
}

export default App
