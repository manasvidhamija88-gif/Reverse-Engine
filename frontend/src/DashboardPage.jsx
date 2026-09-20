import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getCurrentUser } from "./api";

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    getCurrentUser(token).then((userData) => {
      if (userData?.email) {
        setUser(userData);
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }

      setLoading(false);
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="re-dashboard-loading">
        <div className="re-loader-ring" />
        <p>INITIALIZING REVERSE ENGINE...</p>
      </div>
    );
  }

  const username = user?.email?.split("@")[0];

  const suggestedDomains = [
    "Agriculture",
    "Healthcare",
    "Education",
    "Climate",
    "Rural Development",
  ];

  const stats = [
    {
      number: "01",
      value: 0,
      label: "SEARCHES RUN",
    },
    {
      number: "02",
      value: 0,
      label: "PROBLEMS SAVED",
    },
    {
      number: "03",
      value: 0,
      label: "DOMAINS EXPLORED",
    },
  ];

  return (
    <div className="re-dashboard">

      {/* BACKGROUND */}
      <div className="re-dashboard-noise" />
      <div className="re-dashboard-grid" />

      <div className="re-dashboard-orb re-orb-one" />
      <div className="re-dashboard-orb re-orb-two" />

      {/* NAVBAR */}
      <nav className="re-dashboard-nav">

        <motion.button
          className="re-dashboard-logo"
          onClick={() => navigate("/")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          REVERSE<span>ENGINE</span>
        </motion.button>

        <div className="re-dashboard-nav-right">

          <div className="re-status">
            <span />
            SYSTEM ONLINE
          </div>

          <button
            className="re-dashboard-logout"
            onClick={handleLogout}
          >
            LOG OUT <span>↗</span>
          </button>

        </div>
      </nav>

      <main className="re-dashboard-main">

        {/* HERO */}
        <section className="re-dashboard-hero">

          <motion.div
            className="re-dashboard-label"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span />
            PERSONAL DISCOVERY CONSOLE
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <h1>
              Welcome,
              <br />
              <span>{username}</span>.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Your reverse-engineering workspace for discovering
            <br />
            real-world problems worth solving.
          </motion.p>

          {/* GLOWING SEARCH BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <button
              className="re-glow-button"
              onClick={() => navigate("/search")}
            >
              <span />
              <span />
              <span />
              <span />

              <strong>START DISCOVERING</strong>
              <b>↗</b>
            </button>
          </motion.div>

          {/* AI DISCOVERY CORE */}
<motion.div
  className="re-ai-core"
  initial={{ opacity: 0, scale: 0.7 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    duration: 1.2,
    delay: 0.4,
    ease: [0.16, 1, 0.3, 1],
  }}
>
  {/* ORBIT RINGS */}
  <div className="re-core-orbit re-core-orbit-1" />
  <div className="re-core-orbit re-core-orbit-2" />
  <div className="re-core-orbit re-core-orbit-3" />

  {/* CORE */}
  <div className="re-core-center">
    <div className="re-core-inner">
      <span />
      <span />
      <span />
    </div>
  </div>

  {/* SIGNAL NODES */}
  <div className="re-signal-node re-node-1">
    <span />
    <small>HEALTHCARE</small>
  </div>

  <div className="re-signal-node re-node-2">
    <span />
    <small>CLIMATE</small>
  </div>

  <div className="re-signal-node re-node-3">
    <span />
    <small>AGRICULTURE</small>
  </div>

  <div className="re-signal-node re-node-4">
    <span />
    <small>EDUCATION</small>
  </div>

  {/* CONNECTING LINES */}
  <div className="re-signal-line re-line-1" />
  <div className="re-signal-line re-line-2" />
  <div className="re-signal-line re-line-3" />
  <div className="re-signal-line re-line-4" />

  {/* FLOATING STATUS */}
  <motion.div
    className="re-core-status re-status-top"
    animate={{ y: [-4, 4, -4] }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <span />
    LIVE SIGNAL
  </motion.div>

  <motion.div
    className="re-core-status re-status-bottom"
    animate={{ y: [4, -4, 4] }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <strong>24</strong>
    <small>PATTERNS DETECTED</small>
  </motion.div>

  {/* SCANNING RING */}
  <div className="re-core-scan" />
</motion.div>

          <div className="re-hero-line" />

        </section>

        {/* DOMAIN SECTION */}
        <section className="re-dashboard-section">

          <motion.div
            className="re-dashboard-section-title"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span>01</span>

            <div>
              <small>DISCOVERY AREAS</small>
              <h2>Choose a domain</h2>
            </div>
          </motion.div>

          <div className="re-dashboard-domain-grid">

            {suggestedDomains.map((domain, i) => (
              <motion.button
                key={domain}
                className="re-dashboard-domain-card"
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.6,
                }}
                onClick={() => navigate("/search")}
              >
                <div className="re-domain-card-number">
                  0{i + 1}
                </div>

                <strong>{domain}</strong>

                <div className="re-domain-card-arrow">
                  ↗
                </div>

                <div className="re-domain-card-line" />
              </motion.button>
            ))}

          </div>

        </section>

        {/* STATS */}
        <section className="re-dashboard-section">

          <motion.div
            className="re-dashboard-section-title"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span>02</span>

            <div>
              <small>SYSTEM OVERVIEW</small>
              <h2>Your activity</h2>
            </div>
          </motion.div>

          <div className="re-dashboard-stats">

            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="re-dashboard-stat-card"
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                }}
                onMouseMove={(e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();

                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  const rotateX =
                    ((y - rect.height / 2) / rect.height) * -8;

                  const rotateY =
                    ((x - rect.width / 2) / rect.width) * 8;

                  card.style.setProperty(
                    "--rotate-x",
                    `${rotateX}deg`
                  );

                  card.style.setProperty(
                    "--rotate-y",
                    `${rotateY}deg`
                  );
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty(
                    "--rotate-x",
                    "0deg"
                  );

                  e.currentTarget.style.setProperty(
                    "--rotate-y",
                    "0deg"
                  );
                }}
              >

                <div className="re-stat-top">
                  <span>{stat.number}</span>
                  <i>↗</i>
                </div>

                <div className="re-stat-value">
                  {stat.value}
                </div>

                <p>{stat.label}</p>

                <div className="re-stat-glow" />

                <div className="re-stat-corner" />

              </motion.div>
            ))}

          </div>

        </section>

        {/* ACTIVITY */}
        <section className="re-dashboard-section">

          <motion.div
            className="re-dashboard-section-title"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span>03</span>

            <div>
              <small>INTELLIGENCE LOG</small>
              <h2>Recent activity</h2>
            </div>
          </motion.div>

          <motion.div
            className="re-dashboard-activity"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >

            <div className="re-activity-pulse">
              <span />
            </div>

            <div className="re-activity-text">
              <h3>No discoveries yet</h3>
              <p>
                Your search history and saved problems
                will appear here.
              </p>
            </div>

            <div className="re-activity-status">
              WAITING FOR INPUT
            </div>

          </motion.div>

        </section>

      </main>

      <footer className="re-dashboard-footer">
        <span>REVERSE ENGINE © 2026</span>
        <span>DISCOVER / ANALYZE / SOLVE</span>
      </footer>

    </div>
  );
}

export default DashboardPage;