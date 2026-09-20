import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const signals = [
    "AGRICULTURE",
    "HEALTHCARE",
    "CLIMATE",
    "EDUCATION",
    "RURAL",
  ];

  return (
    <div className="re-landing">

      {/* BACKGROUND */}
      <div className="re-landing-noise" />
      <div className="re-landing-grid" />

      {/* AMBIENT GLOW */}
      <div className="re-landing-glow re-glow-left" />
      <div className="re-landing-glow re-glow-right" />

      {/* NAVBAR */}
      <nav className="re-landing-nav">

        <motion.button
          className="re-landing-logo"
          onClick={() => navigate("/")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          REVERSE<span>ENGINE</span>
        </motion.button>

        <div className="re-landing-nav-links">
          <span>DISCOVER</span>
          <span>ANALYZE</span>
          <span>SOLVE</span>

          <button onClick={() => navigate("/login")}>
            LOGIN ↗
          </button>
        </div>

      </nav>

      {/* HERO */}
      <main className="re-landing-hero">

        {/* LEFT CONTENT */}
        <section className="re-landing-content">

          <motion.div
            className="re-landing-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span />
            AI-POWERED PROBLEM DISCOVERY
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Search for
            <br />

            <span className="re-heading-orange">
              problems.
            </span>

            <br />

            <span className="re-heading-outline">
              Not answers.
            </span>
          </motion.h1>

          <motion.p
            className="re-landing-description"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            Reverse Engine analyzes real-world signals,
            <br />
            data and emerging patterns to uncover
            <br />
            problems worth solving.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <button
              className="re-landing-button"
              onClick={() => navigate("/register")}
            >
              <span />
              <span />
              <span />
              <span />

              <strong>START DISCOVERING</strong>
              <b>↗</b>
            </button>
          </motion.div>

        </section>


        {/* AI VISUAL */}
        <motion.section
          className="re-discovery-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        >

          {/* ORBIT SYSTEM */}
          <div className="re-discovery-orbit orbit-one" />
          <div className="re-discovery-orbit orbit-two" />
          <div className="re-discovery-orbit orbit-three" />

          {/* CENTER CORE */}
          <div className="re-discovery-core">

            <div className="re-core-glow" />

            <div className="re-core-inner">
              <span />
              <span />
              <span />
              <span />
            </div>

          </div>


          {/* SIGNAL NODES */}
          <motion.div
            className="re-discovery-node node-a"
            animate={{ y: [-8, 8, -8] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <i />
            <span>HEALTHCARE</span>
          </motion.div>

          <motion.div
            className="re-discovery-node node-b"
            animate={{ y: [8, -8, 8] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <i />
            <span>AGRICULTURE</span>
          </motion.div>

          <motion.div
            className="re-discovery-node node-c"
            animate={{ y: [-6, 6, -6] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <i />
            <span>CLIMATE</span>
          </motion.div>

          <motion.div
            className="re-discovery-node node-d"
            animate={{ y: [5, -5, 5] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <i />
            <span>EDUCATION</span>
          </motion.div>


          {/* CONNECTION LINES */}
          <div className="re-discovery-line line-a" />
          <div className="re-discovery-line line-b" />
          <div className="re-discovery-line line-c" />
          <div className="re-discovery-line line-d" />


          {/* FLOATING INFORMATION */}
          <motion.div
            className="re-discovery-card card-a"
            animate={{ y: [-5, 5, -5] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <small>LIVE SIGNAL</small>
            <strong>24</strong>
            <span>PATTERNS DETECTED</span>
          </motion.div>


          <motion.div
            className="re-discovery-card card-b"
            animate={{ y: [5, -5, 5] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <small>AI CONFIDENCE</small>
            <strong>82%</strong>
            <span>HIGH RELEVANCE</span>
          </motion.div>


          {/* SCANNING RING */}
          <div className="re-discovery-scan" />

          {/* RANDOM PARTICLES */}
          <span className="re-particle p1" />
          <span className="re-particle p2" />
          <span className="re-particle p3" />
          <span className="re-particle p4" />
          <span className="re-particle p5" />
          <span className="re-particle p6" />

        </motion.section>

      </main>


      {/* SIGNAL TICKER */}
      <div className="re-signal-ticker">

        <div className="re-ticker-track">

          {[...signals, ...signals].map((signal, index) => (
            <div key={index}>
              <span>✦</span>
              {signal}
            </div>
          ))}

        </div>

      </div>


      {/* BOTTOM INFO */}
      <div className="re-landing-bottom">

        <span>
          01 / REVERSE ENGINE
        </span>

        <span>
          FIND THE PROBLEM
        </span>

        <span>
          SCROLL TO EXPLORE ↓
        </span>

      </div>

    </div>
  );
}

export default LandingPage;