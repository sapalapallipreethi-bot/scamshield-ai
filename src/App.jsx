
import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Send message to FastAPI backend
  async function analyzeMessage(e) {
    e.preventDefault();

    if (!message.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Backend request failed"
        );
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to backend. Please make sure your Python server is running."
          : err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  // Clear the input and result
  function clearForm() {
    setMessage("");
    setResult(null);
    setError("");
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <a className="logo" href="#">
          <span className="logo-icon">🛡️</span>
          ScamShield
          <span className="logo-ai">AI</span>
        </a>

        <div className="nav-links">
          <a href="#analyzer">Analyzer</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#safety">Safety Tips</a>
        </div>

        <a className="nav-button" href="#analyzer">
          Try Analyzer ↗
        </a>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-badge">
          <span className="status-dot"></span>
          AI-POWERED DIGITAL SAFETY
        </div>

        <h1>
          Think Before You
          <br />
          <span>Trust.</span> Stay Safe.
        </h1>

        <p className="hero-description">
          Suspicious job offer? Unexpected payment request?
          Analyze messages, understand warning signs, and
          make informed decisions online.
        </p>

        <a className="primary-button" href="#analyzer">
          Analyze a Message <span>→</span>
        </a>

        <div className="hero-note">
          <span>🔒</span> Your safety starts with awareness.
        </div>
      </header>

      <main>
        {/* Message Analyzer */}
        <section
          className="analyzer-section"
          id="analyzer"
        >
          <div className="section-heading">
            <span className="eyebrow">
              SMART MESSAGE ANALYZER
            </span>

            <h2>Is this message safe?</h2>

            <p>
              Paste a suspicious message below to explore
              potential warning signs.
            </p>
          </div>

          <div className="analyzer-card">
            <div className="card-top">
              <div>
                <span className="card-icon">✳</span>
                <strong>Message Analysis</strong>
              </div>

              <span className="demo-tag">
                BACKEND CONNECTED
              </span>
            </div>

            <form onSubmit={analyzeMessage}>
              <label htmlFor="message">
                Paste your message here
              </label>

              <textarea
                id="message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setResult(null);
                  setError("");
                }}
                placeholder="Example: Congratulations! You are selected for a job. Pay ₹1,500 as a registration fee..."
                rows={6}
                maxLength={5000}
              />

              <div className="input-footer">
                <span>
                  {message.length}/5000 characters
                </span>

                <button
                  type="button"
                  className="clear-button"
                  onClick={clearForm}
                >
                  Clear
                </button>
              </div>

              <button
                className="analyze-button"
                type="submit"
                disabled={!message.trim() || loading}
              >
                {loading
                  ? "Analyzing..."
                  : "✳ Analyze Message →"}
              </button>
            </form>

            {/* Loading Message */}
            {loading && (
              <div className="demo-result" aria-live="polite">
                <h3>Analyzing your message...</h3>
                <p>
                  Please wait while ScamShield AI processes
                  your request.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                className="demo-result"
                role="alert"
              >
                <h3>Connection Error</h3>
                <p>{error}</p>
              </div>
            )}

            {/* Backend Analysis Result */}
            {result && (
              <div
                className="demo-result"
                aria-live="polite"
              >
                <h3>Analysis Result</h3>

                <div className="risk-summary">
  <div>
    <span className="result-label">Risk Level</span>
    <span
      className={`risk-badge ${
        result.risk_level?.toLowerCase().includes("high")
          ? "high"
          : result.risk_level?.toLowerCase().includes("medium")
          ? "medium"
          : "low"
      }`}
    >
      {result.risk_level || "Under Review"}
    </span>
  </div>

  {typeof result.risk_score === "number" && (
    <div className="risk-score">
      <span className="result-label">Risk Score</span>
      <strong>{result.risk_score}/100</strong>
    </div>
  )}
</div>
                <p>
                  {result.analysis ||
                    "No analysis details returned."}
                </p>

                {/* Warning Signs */}
                {result.warning_signs?.length > 0 && (
                  <>
                    <h4>Warning Signs</h4>

                    <ul>
                      {result.warning_signs.map(
                        (sign, index) => (
                          <li key={index}>{sign}</li>
                        )
                      )}
                    </ul>
                  </>
                )}

                {/* Safety Tips */}
                {result.safety_tips?.length > 0 && (
                  <>
                    <h4>Safety Tips</h4>

                    <ul>
                      {result.safety_tips.map(
                        (tip, index) => (
                          <li key={index}>{tip}</li>
                        )
                      )}
                    </ul>
                  </>
                )}

                <p>
                  <strong>Important:</strong> This is a
                  demo analysis, not a verified fraud
                  determination. Always verify suspicious
                  messages independently.
                </p>

                <button
                  type="button"
                  className="clear-button"
                  onClick={clearForm}
                >
                  Try another message
                </button>
              </div>
            )}

            <p className="privacy-note">
              🔒 Your message is sent to your local backend.
              Real AI analysis is not connected yet.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section
          className="how-section"
          id="how-it-works"
        >
          <div className="section-heading">
            <span className="eyebrow">
              SIMPLE. SMART. SAFE.
            </span>

            <h2>How it works</h2>

            <p>
              Three simple steps toward safer digital
              decisions.
            </p>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <div className="step-icon">📋</div>

              <h3>Paste the Message</h3>

              <p>
                Enter a suspicious job offer, email, or
                payment request.
              </p>
            </article>

            <article className="step-card">
              <span className="step-number">02</span>
              <div className="step-icon">🔍</div>

              <h3>Analyze Warning Signs</h3>

              <p>
                The backend processes your message and
                returns potential risk indicators.
              </p>
            </article>

            <article className="step-card">
              <span className="step-number">03</span>
              <div className="step-icon">🛡️</div>

              <h3>Make Informed Choices</h3>

              <p>
                Review explanations and verification
                steps before taking action.
              </p>
            </article>
          </div>
        </section>

        {/* Safety Tips */}
        <section
          className="safety-banner"
          id="safety"
        >
          <div className="safety-icon">💡</div>

          <div>
            <h3>Stay alert. Stay informed.</h3>

            <p>
              Never share OTPs, passwords, or banking
              details with unverified sources.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <a className="logo footer-logo" href="#">
          🛡️ ScamShield
          <span className="logo-ai">AI</span>
        </a>

        <p>
          Built for a safer digital community · 2026
        </p>

        <span className="footer-note">
          Educational prototype · Not a verified fraud
          detector
        </span>
      </footer>
    </div>
  );
}

export default App;