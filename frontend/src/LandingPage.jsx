import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center">
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
          <button
            onClick={() => navigate("/register")}
            className="bg-accent hover:bg-accent-hover text-bg font-medium px-6 py-3 rounded-md transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="border border-border hover:border-accent text-text px-6 py-3 rounded-md transition-colors"
          >
            Log In
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-6 py-20 border-t border-border">
        <h2 className="text-2xl font-semibold text-text text-center mb-2">
          How it works
        </h2>
        <p className="text-text-muted text-center mb-14">
          From a single search term to evidence-backed problems worth solving.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="border border-border rounded-lg p-6">
            <span className="text-accent text-sm font-mono mb-3 block">01</span>
            <h3 className="text-text font-medium mb-2">Search a domain</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Enter an industry or topic — agriculture, healthcare, education,
              anything you want to explore.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6">
            <span className="text-accent text-sm font-mono mb-3 block">02</span>
            <h3 className="text-text font-medium mb-2">We gather evidence</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              News, research papers, forums, and open datasets are collected
              and cross-referenced for recurring patterns.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6">
            <span className="text-accent text-sm font-mono mb-3 block">03</span>
            <h3 className="text-text font-medium mb-2">Discover real problems</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Get ranked, evidence-backed problems with sources, severity,
              and potential opportunity areas.
            </p>
          </div>
        </div>
      </div>

      {/* Sample problem preview */}
      <div className="max-w-3xl mx-auto px-6 py-20 border-t border-border">
        <h2 className="text-2xl font-semibold text-text text-center mb-2">
          What you'll find
        </h2>
        <p className="text-text-muted text-center mb-10">
          A preview of how a discovered problem looks.
        </p>

        <div className="bg-surface border border-border rounded-lg p-6">
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
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-border px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold text-text mb-6">
          Start discovering problems worth solving.
        </h2>
        <button
          onClick={() => navigate("/register")}
          className="bg-accent hover:bg-accent-hover text-bg font-medium px-6 py-3 rounded-md transition-colors"
        >
          Get Started — It's Free
        </button>
      </div>
    </div>
  )
}

export default LandingPage