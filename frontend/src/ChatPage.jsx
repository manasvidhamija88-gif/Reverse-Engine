import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./api";

const formatAIResponse = (text) => {
  if (!text) return null;

  const cleanText = text
    .replace(/\*\*/g, "")
    .replace(/###/g, "")
    .trim();

  // Check whether the response contains numbered problems
  const numberedParts = cleanText.split(/\n(?=\s*\d+\.\s)/);

  if (numberedParts.length <= 1) {
    return (
      <div className="re-ai-text">
        {cleanText}
      </div>
    );
  }

  const intro = numberedParts[0].trim();

  return (
    <div className="re-ai-response">
      {intro && (
        <div className="re-ai-intro">
          {intro}
        </div>
      )}

      {numberedParts.slice(1).map((section, index) => {
        const lines = section
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        if (lines.length === 0) return null;

        const firstLine = lines[0];

        const title = firstLine
          .replace(/^\d+\.\s*/, "")
          .replace(/^Title:\s*/i, "")
          .trim();

        const severityLine = lines.find((line) =>
          /^severity\s*:/i.test(line)
        );

        const summaryLine = lines.find((line) =>
          /^summary\s*:/i.test(line)
        );

        const otherLines = lines.filter(
          (line) =>
            !/^severity\s*:/i.test(line) &&
            !/^summary\s*:/i.test(line) &&
            line !== firstLine
        );

        const severity = severityLine
          ? severityLine.replace(/^severity\s*:/i, "").trim()
          : null;

        const summary = summaryLine
          ? summaryLine.replace(/^summary\s*:/i, "").trim()
          : null;

        return (
          <div className="re-problem-card" key={index}>
            <div className="re-problem-number">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="re-problem-content">
              <div className="re-problem-top">
                <h3>{title}</h3>

                {severity && (
                  <span
                    className={`re-problem-severity ${
                      Number(severity) >= 25
                        ? "severity-high"
                        : Number(severity) >= 12
                        ? "severity-medium"
                        : "severity-low"
                    }`}
                  >
                    Severity {severity}
                  </span>
                )}
              </div>

              {summary && (
                <div className="re-problem-summary">
                  <span>SUMMARY</span>
                  <p>{summary}</p>
                </div>
              )}

              {otherLines.length > 0 && (
                <div className="re-problem-extra">
                  {otherLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

function ChatPage() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text:
        "Hi! I'm Reverse Engine AI. Tell me about a problem, industry, or idea you want to explore.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          data.error || "Something went wrong"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.response,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            "Sorry, I couldn't connect to the AI right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="re-chat-page">

      {/* NAVBAR */}

      <nav className="re-chat-nav">
        <div className="re-chat-logo">
          REVERSE<span> ENGINE</span>
        </div>

        <button
          className="re-chat-dashboard"
          onClick={() => navigate("/dashboard")}
        >
          DASHBOARD →
        </button>
      </nav>

      {/* MAIN */}

      <main className="re-chat-main">

        {/* HEADER */}

        <div className="re-chat-header">
          <div className="re-chat-eyebrow">
            <span className="re-chat-dot"></span>
            AI DISCOVERY CORE
          </div>

          <h1>
            Talk to <span>Reverse AI</span>
          </h1>

          <p>
            Explore problems, industries and startup opportunities.
          </p>
        </div>

        {/* CHAT BOX */}

        <div className="re-chat-container">

          <div className="re-chat-messages">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`re-message-row ${
                  message.role === "user"
                    ? "re-message-user"
                    : "re-message-ai"
                }`}
              >

                {message.role === "ai" && (
                  <div className="re-ai-avatar">
                    AI
                  </div>
                )}

                <div
                  className={
                    message.role === "user"
                      ? "re-user-message"
                      : "re-ai-message"
                  }
                >
                  {message.role === "ai"
                    ? formatAIResponse(message.text)
                    : (
                      <div className="re-user-text">
                        {message.text}
                      </div>
                    )}
                </div>

              </div>
            ))}

            {/* LOADING */}

            {loading && (
              <div className="re-message-row re-message-ai">

                <div className="re-ai-avatar">
                  AI
                </div>

                <div className="re-ai-message re-thinking">
                  <span></span>
                  <span></span>
                  <span></span>

                  <p>
                    Reverse AI is thinking...
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* INPUT */}

          <div className="re-chat-input-area">

            <textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask Reverse AI anything..."
              rows="1"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "..." : "SEND"}
            </button>

          </div>

          <div className="re-chat-hint">
            Press ENTER to send · SHIFT + ENTER for a new line
          </div>

        </div>

      </main>

    </div>
  );
}

export default ChatPage;