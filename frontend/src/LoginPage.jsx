import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from './api'

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }

    const result = await loginUser(email, password)

    if (result.access_token) {
      localStorage.setItem("token", result.access_token)
      navigate("/dashboard")
    } else if (typeof result.error === "string") {
      setError(result.error)
    } else {
      setError("Login failed. Please check your credentials.")
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-semibold text-text mb-1">Welcome back</h1>
        <p className="text-text-muted mb-8">Log in to your Reverse Engine account.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent-hover text-bg font-medium px-4 py-2.5 rounded-md transition-colors"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-text-muted mt-6 text-center">
          Need an account?{" "}
          <button onClick={() => navigate("/register")} className="text-accent hover:text-accent-hover">
            Register
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginPage