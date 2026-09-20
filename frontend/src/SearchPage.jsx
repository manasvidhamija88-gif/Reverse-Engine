import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { searchProblems } from "./api";

function getSeverityStyles(severity) {
  switch (severity) {
    case "High":
      return "bg-red-500/10 text-red-400 border-red-500/30";
    case "Medium":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    case "Low":
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/30";
  }
}

function SearchPage() {
  const [query, setQuery] = useState("");
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setProblems([]);

    const result = await searchProblems(query, token);

    setLoading(false);

    if (result.error) {
      setError(
        typeof result.error === "string"
          ? result.error
          : "Something went wrong. Please try again."
      );
      return;
    }

    setProblems(result.problems || []);
  };

  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / rect.height) * -8;
    const rotateY = ((x - rect.width / 2) / rect.width) * 8;

    card.style.setProperty("--rotate-x", `${rotateX}deg`);
    card.style.setProperty("--rotate-y", `${rotateY}deg`);
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleCardLeave = (e) => {
    const card = e.currentTarget;

    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.setProperty("--mouse-x", "50%");
    card.style.setProperty("--mouse-y", "50%");
  };

  return (
    <div className="min-h-screen bg-bg text-text px-6 py-12 re-search-page">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 re-search-title">
          Search for Problems
        </h1>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSearch()
            }
            placeholder="e.g. Agriculture, Healthcare, Climate..."
            className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:border-accent re-search-input"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-accent hover:bg-accent-hover text-bg font-semibold px-6 py-3 rounded-lg disabled:opacity-50 re-search-button"
          >
            {loading ? "Searching..." : "Search"}
          </button>
          <button
  onClick={() => navigate("/chat")}
  style={{
    background: "#ff6a00",
    color: "#000",
    border: "none",
    padding: "12px 18px",
    fontWeight: "700",
    cursor: "pointer",
    marginLeft: "10px"
  }}
>
  AI CHAT →
</button>
        </div>

        {error && (
          <p className="text-accent mb-6">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-5">

          {problems.map((problem, i) => (
            <motion.div
              key={problem.id}
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                delay: i * 0.07,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="re-problem-card"
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
            >

              <div className="re-card-glow" />

              <div className="re-card-content">

                <div className="flex items-start justify-between gap-3 mb-3">

                  <h2 className="text-lg font-semibold text-text re-problem-title">
                    {problem.title}
                  </h2>

                  <div className="flex shrink-0 gap-2">

                    {problem.severity && (
                      <span
                        className={`text-xs border rounded-full px-3 py-1 ${getSeverityStyles(
                          problem.severity
                        )} re-severity`}
                      >
                        {problem.severity}
                      </span>
                    )}

                    <span className="text-xs bg-accent/10 text-accent border border-accent/30 rounded-full px-3 py-1 re-source-count">
                      {problem.article_count} source
                      {problem.article_count !== 1 ? "s" : ""}
                    </span>

                  </div>
                </div>

                {problem.summary && (
                  <p className="text-text-muted text-sm mb-4 italic re-problem-summary">
                    {problem.summary}
                  </p>
                )}
                

                <div className="flex flex-col gap-2">

                  {problem.articles.map((article) => (
                    <a
                      key={article.id}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border border-border rounded-lg p-3 hover:border-accent transition re-article-card"
                    >

                      <div className="re-article-line" />

                      {article.description && (
                        <p className="text-text-muted text-sm mb-2">
                          {article.description}
                        </p>
                      )}

                      <div className="text-xs text-text-muted">
                        {article.source} ·{" "}
                        {article.published_at &&
                          new Date(
                            article.published_at
                          ).toLocaleDateString()}
                      </div>

                    </a>
                  ))}

                </div>
                <div className="re-opportunity-action">
  <button
    type="button"
    className="re-analyze-opportunity-btn"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();

      navigate("/opportunity", {
        state: {
          problem: problem,
        },
      });
    }}
  >
    ANALYZE OPPORTUNITY →
  </button>
</div>

              </div>

              <div className="re-card-corner re-card-corner-tl" />
              <div className="re-card-corner re-card-corner-br" />

            </motion.div>
          ))}

        </div>

        {!loading &&
          problems.length === 0 &&
          !error && (
            <p className="text-text-muted">
              Search a domain or industry to see real, recent problem signals.
            </p>
          )}

      </div>
    </div>
  );
}

export default SearchPage;