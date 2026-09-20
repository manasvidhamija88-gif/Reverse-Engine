import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function OpportunityPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const problem = location.state?.problem;

  // =========================================================
  // STATES
  // =========================================================

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const [noveltyLoading, setNoveltyLoading] = useState(false);
  const [novelty, setNovelty] = useState(null);

  const [relationshipLoading, setRelationshipLoading] = useState(false);
  const [relationships, setRelationships] = useState(null);


  // =========================================================
  // ANALYZE STARTUP OPPORTUNITY
  // =========================================================

  const analyzeOpportunity = async () => {
    if (!problem) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/analyze-opportunity",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            problem_id: problem.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          data.error || "Analysis failed"
        );
      }

      setAnalysis(data.analysis);

    } catch (err) {
      console.error(
        "Opportunity analysis error:",
        err
      );

      setError(
        "Unable to generate opportunity analysis."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // ASSESS NOVELTY
  // =========================================================

  const assessNovelty = async () => {
    if (!problem) return;

    setNoveltyLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/assess-novelty",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            problem_id: problem.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          data.error ||
          "Novelty assessment failed"
        );
      }

      setNovelty(data.novelty);

    } catch (err) {
      console.error(
        "Novelty assessment error:",
        err
      );

      setError(
        err.message ||
        "Unable to assess novelty."
      );

    } finally {
      setNoveltyLoading(false);
    }
  };


  // =========================================================
  // PROBLEM RELATIONSHIP MAP
  // =========================================================

  const loadRelationships = async () => {
    if (!problem) return;

    setRelationshipLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/problem-relationships",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            problem_id: problem.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          data.error ||
          "Unable to find related problems"
        );
      }

      setRelationships(data);

    } catch (err) {
      console.error(
        "Relationship map error:",
        err
      );

      setError(
        err.message ||
        "Unable to load related problems."
      );

    } finally {
      setRelationshipLoading(false);
    }
  };


  // =========================================================
  // PROBLEM NOT FOUND
  // =========================================================

  if (!problem) {
    return (
      <div className="re-opportunity-page">

        <div className="re-opportunity-empty">

          <h2>
            Problem not found
          </h2>

          <button
            onClick={() => navigate("/search")}
          >
            BACK TO SEARCH
          </button>

        </div>

      </div>
    );
  }


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="re-opportunity-page">

      {/* =====================================================
          NAVBAR
         ===================================================== */}

      <nav className="re-opportunity-nav">

        <div className="re-opportunity-logo">
          REVERSE<span> ENGINE</span>
        </div>

        <button
          onClick={() => navigate("/search")}
          className="re-opportunity-back"
        >
          ← BACK TO SEARCH
        </button>

      </nav>


      {/* =====================================================
          MAIN
         ===================================================== */}

      <main className="re-opportunity-main">

        {/* PAGE LABEL */}

        <div className="re-opportunity-label">
          AI OPPORTUNITY ENGINE
        </div>


        {/* PROBLEM TITLE */}

        <h1>
          {problem.title}
        </h1>


        {/* META */}

        <div className="re-opportunity-meta">

          <span>
            {problem.severity} SEVERITY
          </span>

          <span>
            {problem.article_count} SOURCES
          </span>

        </div>


        {/* PROBLEM SUMMARY */}

        {problem.summary && (
          <div className="re-opportunity-problem">

            <div>
              THE PROBLEM
            </div>

            <p>
              {problem.summary}
            </p>

          </div>
        )}


        {/* =====================================================
            ANALYZE BUTTON
           ===================================================== */}

        {!analysis && !loading && (
          <button
            className="re-analyze-button"
            onClick={analyzeOpportunity}
          >
            ANALYZE STARTUP OPPORTUNITY →
          </button>
        )}


        {/* =====================================================
            NOVELTY BUTTON
           ===================================================== */}

        {analysis && (
          <button
            className="re-novelty-button"
            onClick={assessNovelty}
            disabled={noveltyLoading}
          >
            {noveltyLoading
              ? "ASSESSING NOVELTY..."
              : "ASSESS NOVELTY →"}
          </button>
        )}


        {/* =====================================================
            RELATIONSHIP BUTTON
           ===================================================== */}

        {analysis && (
          <button
            className="re-relationship-button"
            onClick={loadRelationships}
            disabled={relationshipLoading}
          >
            {relationshipLoading
              ? "FINDING RELATIONSHIPS..."
              : "EXPLORE RELATED PROBLEMS →"}
          </button>
        )}


        {/* =====================================================
            LOADING
           ===================================================== */}

        {loading && (
          <div className="re-opportunity-loading">

            <div className="re-loading-orbit"></div>

            <p>
              Reverse AI is analyzing this problem...
            </p>

          </div>
        )}


        {/* =====================================================
            ERROR
           ===================================================== */}

        {error && (
          <div className="re-opportunity-error">
            {error}
          </div>
        )}


        {/* =====================================================
            OPPORTUNITY ANALYSIS
           ===================================================== */}

        {analysis && (
          <div className="re-opportunity-results">

            {/* 01 */}

            <section>

              <span>
                01
              </span>

              <div>

                <h2>
                  Who is affected?
                </h2>

                <p>
                  {analysis.affected_users}
                </p>

              </div>

            </section>


            {/* 02 */}

            <section>

              <span>
                02
              </span>

              <div>

                <h2>
                  Existing solutions
                </h2>

                <p>
                  {analysis.existing_solutions}
                </p>

              </div>

            </section>


            {/* 03 */}

            <section>

              <span>
                03
              </span>

              <div>

                <h2>
                  Unsolved gap
                </h2>

                <p>
                  {analysis.unsolved_gap}
                </p>

              </div>

            </section>


            {/* 04 */}

            <section className="re-opportunity-highlight">

              <span>
                04
              </span>

              <div>

                <h2>
                  Startup idea
                </h2>

                <p>
                  {analysis.startup_idea}
                </p>

              </div>

            </section>


            {/* 05 */}

            <section>

              <span>
                05
              </span>

              <div>

                <h2>
                  Target users
                </h2>

                <p>
                  {analysis.target_users}
                </p>

              </div>

            </section>


            {/* 06 */}

            <section>

              <span>
                06
              </span>

              <div>

                <h2>
                  Revenue model
                </h2>

                <p>
                  {analysis.revenue_model}
                </p>

              </div>

            </section>


            {/* 07 */}

            <section>

              <span>
                07
              </span>

              <div>

                <h2>
                  Technology
                </h2>

                <p>
                  {analysis.technology}
                </p>

              </div>

            </section>


            {/* 08 */}

            <section>

              <span>
                08
              </span>

              <div>

                <h2>
                  Potential impact
                </h2>

                <p>
                  {analysis.impact}
                </p>

              </div>

            </section>

          </div>
        )}


        {/* =====================================================
            NOVELTY ASSESSMENT
           ===================================================== */}

        {novelty && (
          <div className="re-novelty-panel">

            {/* HEADER */}

            <div className="re-novelty-header">

              <div>

                <span>
                  AI-BASED ASSESSMENT
                </span>

                <h2>
                  Problem Novelty
                </h2>

              </div>

              <div className="re-novelty-disclaimer">
                AI assessment · Not scientifically validated
              </div>

            </div>


            {/* METRICS */}

            <div className="re-novelty-metrics">

              {/* UNIQUENESS */}

              <div className="re-novelty-metric">

                <span>
                  UNIQUENESS
                </span>

                <strong>
                  {novelty.uniqueness}%
                </strong>

                <div className="re-novelty-bar">

                  <div
                    style={{
                      width: `${novelty.uniqueness}%`,
                    }}
                  />

                </div>

              </div>


              {/* MARKET GAP */}

              <div className="re-novelty-metric">

                <span>
                  MARKET GAP
                </span>

                <strong>
                  {novelty.market_gap}%
                </strong>

                <div className="re-novelty-bar">

                  <div
                    style={{
                      width: `${novelty.market_gap}%`,
                    }}
                  />

                </div>

              </div>


              {/* EXISTING OVERLAP */}

              <div className="re-novelty-metric">

                <span>
                  EXISTING OVERLAP
                </span>

                <strong>
                  {novelty.existing_overlap}%
                </strong>

                <div className="re-novelty-bar">

                  <div
                    style={{
                      width: `${novelty.existing_overlap}%`,
                    }}
                  />

                </div>

              </div>

            </div>


            {/* ASSESSMENT */}

            <div className="re-novelty-assessment">

              <span>
                AI ASSESSMENT
              </span>

              <p>
                {novelty.assessment}
              </p>

            </div>

          </div>
        )}


        {/* =====================================================
            PROBLEM RELATIONSHIP MAP
           ===================================================== */}

        {relationships && (
          <div className="re-relationship-panel">

            {/* HEADER */}

            <div className="re-relationship-header">

              <div>

                <span>
                  PROBLEM NETWORK
                </span>

                <h2>
                  Related Problems
                </h2>

              </div>

              <div className="re-relationship-count">
                {relationships.relationships.length} CONNECTIONS
              </div>

            </div>


            {/* MAP */}

            <div className="re-relationship-map">

              {/* CURRENT PROBLEM */}

              <div className="re-relationship-center">

                <div className="re-relationship-node-main">

                  <span>
                    CURRENT PROBLEM
                  </span>

                  <h3>
                    {relationships.problem.title}
                  </h3>

                  <small>
                    {relationships.problem.severity} SEVERITY
                  </small>

                </div>

              </div>


              {/* RELATED PROBLEMS */}

              <div className="re-relationship-list">

                {relationships.relationships.length === 0 ? (

                  <div className="re-no-relationships">
                    No closely related problems found.
                  </div>

                ) : (

                  relationships.relationships.map(
                    (item) => (

                      <div
                        className="re-relationship-card"
                        key={item.id}
                      >

                        <div className="re-relationship-line"></div>

                        <div className="re-relationship-node">

                          <div className="re-relationship-score">
                            {item.similarity}%
                          </div>

                          <div className="re-relationship-info">

                            <h3>
                              {item.title}
                            </h3>

                            <span>
                              {item.severity} SEVERITY
                            </span>

                            {item.summary && (
                              <p>
                                {item.summary}
                              </p>
                            )}

                          </div>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default OpportunityPage;