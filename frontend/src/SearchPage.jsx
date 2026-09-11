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

  return (
    <div className="min-h-screen bg-bg text-text px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search for Problems</h1>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g. Agriculture, Healthcare, Climate..."
            className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:border-accent"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-accent hover:bg-accent-hover text-bg font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <p className="text-accent mb-6">{error}</p>}

        <div className="flex flex-col gap-4">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface border border-border rounded-lg p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="text-lg font-semibold text-text">{problem.title}</h2>
                <div className="flex shrink-0 gap-2">
                  {problem.severity && (
                    <span
                      className={`text-xs border rounded-full px-3 py-1 ${getSeverityStyles(
                        problem.severity
                      )}`}
                    >
                      {problem.severity}
                    </span>
                  )}
                  <span className="text-xs bg-accent/10 text-accent border border-accent/30 rounded-full px-3 py-1">
                    {problem.article_count} source{problem.article_count !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {problem.summary && (
                <p className="text-text-muted text-sm mb-4 italic">
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
                    className="block border border-border rounded-lg p-3 hover:border-accent transition"
                  >
                    {article.description && (
                      <p className="text-text-muted text-sm mb-2">{article.description}</p>
                    )}
                    <div className="text-xs text-text-muted">
                      {article.source} ·{" "}
                      {article.published_at && new Date(article.published_at).toLocaleDateString()}
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {!loading && problems.length === 0 && !error && (
          <p className="text-text-muted">
            Search a domain or industry to see real, recent problem signals.
          </p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
