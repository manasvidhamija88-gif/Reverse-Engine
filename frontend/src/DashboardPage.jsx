import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from './api'

function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }
    getCurrentUser(token).then((userData) => {
      if (userData.email) {
        setUser(userData)
      } else {
        localStorage.removeItem("token")
        navigate("/login")
      }
      setLoading(false)
    })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted">Loading...</p>
      </div>
    )
  }

  const suggestedDomains = ["Agriculture", "Healthcare", "Education", "Climate", "Rural Development"]

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="text-text font-semibold">Reverse Engine</span>
        <button
          onClick={handleLogout}
          className="text-sm text-text-muted hover:text-text transition-colors"
        >
          Log Out
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-text mb-2">
          Welcome, {user.email.split("@")[0]}
        </h1>
        <p className="text-text-muted mb-10">
          Search for a domain or problem area to get started.
        </p>

        <button
          onClick={() => navigate("/search")}
          className="bg-accent hover:bg-accent-hover text-bg font-medium px-6 py-3 rounded-md transition-colors mb-16"
        >
          Go to Search
        </button>

        {/* Suggested domains */}
        <div className="mb-16">
          <h2 className="text-sm text-text-muted uppercase tracking-widest mb-4">
            Try a domain
          </h2>
          <div className="flex flex-wrap gap-2">
            {suggestedDomains.map((domain) => (
              <button
                key={domain}
                onClick={() => navigate("/search")}
                className="border border-border hover:border-accent text-text text-sm px-4 py-2 rounded-full transition-colors"
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          <div className="border border-border rounded-lg p-5">
            <p className="text-2xl font-semibold text-text mb-1">0</p>
            <p className="text-sm text-text-muted">Searches run</p>
          </div>
          <div className="border border-border rounded-lg p-5">
            <p className="text-2xl font-semibold text-text mb-1">0</p>
            <p className="text-sm text-text-muted">Problems saved</p>
          </div>
          <div className="border border-border rounded-lg p-5">
            <p className="text-2xl font-semibold text-text mb-1">0</p>
            <p className="text-sm text-text-muted">Domains explored</p>
          </div>
        </div>

        {/* Empty state for recent activity */}
        <div>
          <h2 className="text-sm text-text-muted uppercase tracking-widest mb-4">
            Recent activity
          </h2>
          <div className="border border-dashed border-border rounded-lg p-10 text-center">
            <p className="text-text-muted text-sm">
              Your search history and saved problems will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage