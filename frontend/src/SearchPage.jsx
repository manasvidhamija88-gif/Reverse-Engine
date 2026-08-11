import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchProblems } from './api'

function SearchPage() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    setError("")
    setResult(null)

    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    if (!query) {
      setError("Please enter something to search for.")
      return
    }

    setLoading(true)
    const response = await searchProblems(query, token)
    setLoading(false)

    if (response.status === "received") {
      setResult(response)
    } else {
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="text-text font-semibold">Reverse Engine</span>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-text-muted hover:text-text transition-colors"
        >
          Back to Dashboard
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-text mb-2">Search</h1>
        <p className="text-text-muted mb-8">
          Search for a domain, industry, or problem area.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="e.g. Agriculture, Healthcare, Education"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-surface border border-border rounded-md px-3 py-2.5 text-text focus:outline-none focus:border-accent transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-accent-hover text-bg font-medium px-6 py-2.5 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        {result && (
          <div className="bg-surface border border-border rounded-lg p-5">
            <span className="inline-block text-xs tracking-widest uppercase text-accent mb-2">
              {result.query}
            </span>
            <p className="text-text-muted">{result.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage