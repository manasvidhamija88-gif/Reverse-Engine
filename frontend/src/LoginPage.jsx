import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "./api"
import boyImage from "./assets/reverse-engine-boy.png"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }

    setLoading(true)

    try {
      const result = await loginUser(email, password)

      if (result?.access_token) {
        localStorage.setItem("token", result.access_token)
        navigate("/dashboard")
      } else if (typeof result?.error === "string") {
        setError(result.error)
      } else {
        setError("Login failed. Please check your credentials.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="re-login">

      {/* Background */}
      <div className="re-noise" />
      <div className="re-grid" />

      {/* Navbar */}
      <nav className="re-nav">
        <button
          className="re-logo"
          onClick={() => navigate("/")}
        >
          REVERSE<span>ENGINE</span>
        </button>

        <button
          className="re-create"
          onClick={() => navigate("/register")}
        >
          CREATE ACCOUNT <span>↗</span>
        </button>
      </nav>


      <main className="re-login-main">

        {/* LEFT — CHARACTER */}
        <section className="re-character-section">

          <div className="re-small-label">
            <span className="re-dot" />
            AI-POWERED DISCOVERY SYSTEM
          </div>

          <h1 className="re-heading">
            Don't search
            <br />
            for <span>answers.</span>
            <br />
            Find problems.
          </h1>

          <p className="re-description">
            Reverse Engine analyzes real-world signals
            to uncover problems worth solving.
          </p>


          {/* CHARACTER SCENE */}
          <div className="re-character-scene">

            <div className="re-orbit re-orbit-1" />
            <div className="re-orbit re-orbit-2" />
            <div className="re-orbit re-orbit-3" />

            <div className="re-glow" />

            <img
              src={boyImage}
              alt="Reverse Engine AI"
              className="re-boy"
            />

            {/* Floating UI */}

            <div className="re-float-card re-card-1">
              <span>LIVE SIGNAL</span>
              <strong>Healthcare</strong>
              <small>+ 24 patterns detected</small>
            </div>

            <div className="re-float-card re-card-2">
              <span>PROBLEM FOUND</span>
              <strong>Water scarcity</strong>
              <small>High severity</small>
            </div>

            <div className="re-float-card re-card-3">
              <span>AI CONFIDENCE</span>
              <strong>82%</strong>
            </div>

            <div className="re-particle particle-1" />
            <div className="re-particle particle-2" />
            <div className="re-particle particle-3" />

          </div>

        </section>


        {/* RIGHT — FORM */}
        <section className="re-form-section">

          <div className="re-form-card">

            <div className="re-form-top">
              <span>01 / AUTHENTICATION</span>

              <div>
                <i />
                ONLINE
              </div>
            </div>


            <div className="re-form-heading">
              <p>WELCOME BACK</p>

              <h2>
                Log in<span>.</span>
              </h2>

              <span>
                Continue your discovery journey.
              </span>
            </div>


            <form onSubmit={handleLogin}>

              {/* EMAIL */}
              <div className="re-field">

                <label>
                  <span>01</span>
                  EMAIL ADDRESS
                </label>

                <div className="re-input">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <span>↗</span>
                </div>

              </div>


              {/* PASSWORD */}
              <div className="re-field">

                <label>
                  <span>02</span>
                  PASSWORD
                </label>

                <div className="re-input">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <span>↗</span>
                </div>

              </div>


              {error && (
                <div className="re-error">
                  <span>!</span>
                  {error}
                </div>
              )}


              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="re-login-button"
              >
                <span>
                  {loading
                    ? "AUTHENTICATING..."
                    : "ENTER REVERSE ENGINE"}
                </span>

                <b>↗</b>

                <i />
              </button>

            </form>


            <div className="re-form-footer">

              <span>
                Don't have an account?
              </span>

              <button onClick={() => navigate("/register")}>
                REGISTER <b>↗</b>
              </button>

            </div>

          </div>

        </section>

      </main>


      <footer className="re-footer">
        <span>REVERSE ENGINE © 2026</span>
        <span>DISCOVER / ANALYZE / SOLVE</span>
      </footer>

    </div>
  )
}

export default LoginPage