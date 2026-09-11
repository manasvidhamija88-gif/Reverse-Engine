import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function LandingPage() {
  const navigate = useNavigate()

  const steps = [
    { num: "01", title: "Search a domain", desc: "Enter an industry or topic — agriculture, healthcare, education, anything you want to explore." },
    { num: "02", title: "We gather evidence", desc: "News, research papers, forums, and open datasets are collected and cross-referenced for recurring patterns." },
    { num: "03", title: "Discover real problems", desc: "Get ranked, evidence-backed problems with sources, severity, and potential opportunity areas." },
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center"
      >
        <span className="inline-block text-xs tracking-widest uppercase text-accent border border-accent/30 rounded-full px-3 py-1 mb-6">
          AI-Powered Problem Discovery
        </span>

        <h1 className="text-5xl md:text-6xl font-semibold text-text tracking-tight mb-4 max-w-3xl">
          Reverse Engine
        </h1>

        <p className="text-lg text-text-muted mb-10 leading-relaxed max-w-xl">
          Search for problems, not answers. Reverse Engine analyzes real-world
          data to surface the pain points and opportunities worth solving.
        </p>

        <div className="flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/register")}
            className="bg-accent hover:bg-accent-hover text-bg font-medium px-6 py-3 rounded-md transition-colors"
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            className="border border-border hover:border-accent text-text px-6 py-3 rounded-md transition-colors"
          >
            Log In
          </motion.button>
        </div>
      </motion.div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-6 py-20 border-t border-border">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-text text-center mb-2"
        >
          How it works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-muted text-center mb-14"
        >
          From a single search term to evidence-backed problems worth solving.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -4, borderColor: "var(--color-accent)" }}
              className="border border-border rounded-lg p-6"
            >
              <span className="text-accent text-sm font-mono mb-3 block">{step.num}</span>
              <h3 className="text-text font-medium mb-2">{step.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sample problem preview */}
      <div className="max-w-3xl mx-auto px-6 py-20 border-t border-border">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-text text-center mb-2"
        >
          What you'll find
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-muted text-center mb-10"
        >
          A preview of how a discovered problem looks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -4, borderColor: "var(--color-accent)" }}
          className="bg-surface border border-border rounded-lg p-6"
        >
          <span className="inline-block text-xs tracking-widest uppercase text-accent mb-3">
            Agriculture
          </span>
          <h3 className="text-xl font-semibold text-text mb-2">
            Water Scarcity in Agriculture
          </h3>
          <p className="text-text-muted text-sm leading-relaxed mb-4">
            Farmers across multiple regions report declining irrigation
            access, with research and government data confirming reduced
            agricultural productivity as a result.
          </p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span>4 sources</span>
            <span>•</span>
            <span>High severity</span>
            <span>•</span>
            <span>82% confidence</span>
          </div>
        </motion.div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-border px-6 py-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-text mb-6"
        >
          Start discovering problems worth solving.
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/register")}
          className="bg-accent hover:bg-accent-hover text-bg font-medium px-6 py-3 rounded-md transition-colors"
        >
          Get Started — It's Free
        </motion.button>
      </div>
    </div>
  )
}

export default LandingPage