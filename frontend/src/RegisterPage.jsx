import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { registerUser } from "./api";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const result = await registerUser(username, email, password);

    if (result?.user_id) {
      navigate("/login");
    } else if (typeof result?.detail === "string") {
      setError(result.detail);
    } else if (result?.error) {
      setError(result.error);
    } else {
      setError("Registration failed. Please check your details.");
    }
  };

  return (
    <div className="re-register">

      {/* BACKGROUND */}
      <div className="re-register-grid" />
      <div className="re-register-noise" />

      {/* NAVBAR */}
      <nav className="re-register-nav">

        <button
          className="re-register-logo"
          onClick={() => navigate("/")}
        >
          REVERSE<span>ENGINE</span>
        </button>

        <button
          className="re-register-login"
          onClick={() => navigate("/login")}
        >
          ALREADY A MEMBER <span>↗</span>
        </button>

      </nav>

      <main className="re-register-main">

        {/* LEFT SIDE */}
        <motion.section
          className="re-register-intro"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >

          <div className="re-register-label">
            <span />
            JOIN THE DISCOVERY SYSTEM
          </div>

          <h1>
            Start finding
            <br />
            <span>problems.</span>
          </h1>

          <p>
            Create your Reverse Engine account
            <br />
            and start discovering opportunities
            <br />
            hidden inside real-world signals.
          </p>

          {/* DECORATIVE CORE */}
          <div className="re-register-core">

            <div className="register-orbit register-orbit-one" />
            <div className="register-orbit register-orbit-two" />
            <div className="register-orbit register-orbit-three" />

            <div className="register-core-center">
              <span />
            </div>

            <div className="register-core-dot register-dot-one" />
            <div className="register-core-dot register-dot-two" />
            <div className="register-core-dot register-dot-three" />

          </div>

        </motion.section>

        {/* FORM */}
        <motion.section
          className="re-register-form-section"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
        >

          <div className="re-register-card">

            <div className="re-register-card-top">
              <span>02 / REGISTRATION</span>

              <div>
                <i />
                NEW USER
              </div>
            </div>

            <div className="re-register-heading">
              <small>CREATE ACCOUNT</small>

              <h2>
                Register<span>.</span>
              </h2>

              <p>
                Enter your details to begin.
              </p>
            </div>

            <form onSubmit={handleRegister}>

              {/* USERNAME */}
              <div className="re-register-field">

                <label>
                  <span>01</span>
                  USERNAME
                </label>

                <div className="re-register-input">
                  <input
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                  />

                  <span>↗</span>
                </div>

              </div>

              {/* EMAIL */}
              <div className="re-register-field">

                <label>
                  <span>02</span>
                  EMAIL ADDRESS
                </label>

                <div className="re-register-input">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />

                  <span>↗</span>
                </div>

              </div>

              {/* PASSWORD */}
              <div className="re-register-field">

                <label>
                  <span>03</span>
                  PASSWORD
                </label>

                <div className="re-register-input">
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />

                  <span>↗</span>
                </div>

              </div>

              {/* ERROR */}
              {error && (
                <motion.div
                  className="re-register-error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span>!</span>
                  {error}
                </motion.div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                className="re-register-button"
              >
                <span />
                <span />
                <span />
                <span />

                <strong>CREATE MY ACCOUNT</strong>

                <b>↗</b>
              </button>

            </form>

            <div className="re-register-footer">
              <span>Already have an account?</span>

              <button
                onClick={() => navigate("/login")}
              >
                LOG IN <b>↗</b>
              </button>
            </div>

          </div>

        </motion.section>

      </main>

      <footer className="re-register-bottom">
        <span>REVERSE ENGINE © 2026</span>
        <span>DISCOVER / ANALYZE / SOLVE</span>
      </footer>

    </div>
  );
}

export default RegisterPage;