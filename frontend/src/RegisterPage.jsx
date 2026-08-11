import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from './api'

function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (!username || !email || !password) {
      setError("Please fill in all fields.")
      return
    }

    const result = await registerUser(username, email, password)

    if (result.user_id) {
      navigate("/login")
    } else if (typeof result.detail === "string") {
      setError(result.detail)
    } else if (result.error) {
      setError(result.error)
    } else {
      setError("Registration failed. Please check your details.")
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-semibold text-text mb-1">Create your account</h1>
        <p className="text-text-muted mb-8">Start discovering real-world problems.</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:border-accent transition-colors"
            />
          </div>

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
            Register
          </button>
        </form>

        <p className="text-sm text-text-muted mt-6 text-center">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-accent hover:text-accent-hover">
            Log In
          </button>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage