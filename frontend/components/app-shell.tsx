'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useState } from 'react'

const nav = [
  ['Home', '/'],
  ['Dashboard', '/dashboard'],
  ['Clinical ML', '/clinical'],
  ['Ultrasound DL', '/ultrasound'],
  ['Predictions', '/results'],
  ['Explainability · SHAP', '/explainability/shap'],
  ['Explainability · Grad-CAM', '/explainability/grad-cam'],
  ['Model Comparison', '/comparison'],
  ['History', '/history'],
  ['Methodology', '/methodology'],
  ['About', '/about'],
]

export function Logo() {
  return (
    <Link href="/" className="logo">
      <span className="logo-mark">✦</span>
      <span>
        Ovalens <b>AI</b>
      </span>
    </Link>
  )
}

export function AppShell({
  children,
  title,
  eyebrow,
}: {
  children: ReactNode
  title?: string
  eyebrow?: string
}) {
  const path = usePathname()

  return (
    <div className="app-bg">
      <aside className="sidebar">
        <Logo />

        <div className="workspace">
          <span className="avatar">RW</span>

          <span>
            <b>Research Workspace</b>
            <small>Academic prototype</small>
          </span>

          <span className="chevron">⌄</span>
        </div>

        <nav className="nav">
          {nav.map(([label, href]) => (
            <Link
              className={
                path === href ||
                path.startsWith(href + '/')
                  ? 'active'
                  : ''
              }
              href={href}
              key={href}
            >
              <span className="nav-dot" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <Link href="/methodology">
            Documentation
          </Link>

          <Link href="/auth">
            Sign out
          </Link>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="Open navigation"
          >
            ☰
          </button>

          <div className="crumb">
            Workspace <span>/</span>{' '}
            <b>{title || 'Overview'}</b>
          </div>

          <div className="top-actions">
            <span className="status">
              <i /> System operational
            </span>

            <button
              className="icon-button"
              aria-label="Notifications"
            >
              ◌
            </button>

            <span className="avatar small">
              RW
            </span>
          </div>
        </header>

        <div className="content">
          {eyebrow && (
            <div className="eyebrow">
              {eyebrow}
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  )
}

export function Stat({
  label,
  value,
  change,
}: {
  label: string
  value: string
  change?: string
}) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {change && <em>{change}</em>}
    </div>
  )
}

export function DemoNotice() {
  return (
    <div className="notice">
      <span className="notice-icon">i</span>

      <span>
        <b>Research prototype</b>
        &nbsp; Predictions shown are illustrative
        reference data and not a clinical diagnosis.
        Connect your validated model API to enable
        live inference.
      </span>

      <Link href="/methodology">
        Learn more →
      </Link>
    </div>
  )
}

export function PageTitle({
  kicker,
  title,
  desc,
  action,
}: {
  kicker: string
  title: string
  desc: string
  action?: ReactNode
}) {
  return (
    <div className="page-title">
      <div>
        <div className="kicker">{kicker}</div>

        <h1>{title}</h1>

        <p>{desc}</p>
      </div>

      {action}
    </div>
  )
}

export function Dashboard() {
  return (
    <AppShell title="Dashboard">
      <PageTitle
        kicker="Research workspace"
        title="Compare the signals that matter."
        desc="Explore the ovalens ai research architecture across clinical machine learning and ultrasound deep learning."
        action={
          <Link
            className="button primary"
            href="/clinical"
          >
            ＋ New analysis
          </Link>
        }
      />

      <DemoNotice />

      <div className="grid stats">
        <Stat
          label="Clinical ML models"
          value="04"
          change="Research information"
        />

        <Stat
          label="Ultrasound DL pipeline"
          value="01"
          change="Research information"
        />

        <Stat
          label="Explainability methods"
          value="02"
          change="SHAP + Grad-CAM"
        />

        <Stat
          label="Clinical dataset"
          value="541"
          change="Patients · project data"
        />
      </div>

      <div className="grid two">
        <section className="panel research-card clinical-card">
          <div className="kicker">
            Clinical ML
          </div>

          <h2>
            Clinical data → prediction → SHAP
          </h2>

          <p>
            Analyze clinical parameters using
            machine learning and understand feature
            contributions with SHAP.
          </p>

          <Link
            href="/clinical"
            className="text-link"
          >
            Open Clinical ML →
          </Link>
        </section>

        <section className="panel research-card ultrasound-card">
          <div className="kicker">
            Ultrasound DL
          </div>

          <h2>
            Ultrasound image → prediction → Grad-CAM
          </h2>

          <p>
            Analyze ultrasound images using deep
            learning and visualize model attention
            using Grad-CAM.
          </p>

          <Link
            href="/ultrasound"
            className="text-link"
          >
            Open Ultrasound DL →
          </Link>
        </section>
      </div>

      <section className="panel pipeline-panel">
        <div className="panel-head">
          <div>
            <div className="kicker">
              Core novelty
            </div>

            <h2>Research pipeline</h2>

            <p>
              Two parallel modeling paths, compared
              through complementary explanations.
            </p>
          </div>

          <Link
            href="/comparison"
            className="text-link"
          >
            Compare models →
          </Link>
        </div>

        <div className="pipeline-row">
          <b>Clinical</b>
          <span>Clinical Data</span>
          <i>→</i>
          <span>Preprocessing</span>
          <i>→</i>
          <span>ML</span>
          <i>→</i>
          <span>Prediction</span>
          <i>→</i>

          <Link href="/explainability/shap">
            SHAP
          </Link>
        </div>

        <div className="pipeline-row">
          <b>Ultrasound</b>
          <span>Ultrasound Image</span>
          <i>→</i>
          <span>Preprocessing</span>
          <i>→</i>
          <span>CNN</span>
          <i>→</i>
          <span>Prediction</span>
          <i>→</i>

          <Link href="/explainability/grad-cam">
            Grad-CAM
          </Link>
        </div>
      </section>

      <div className="grid two">
        <section className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h2>Analysis activity</h2>

              <p>
                Completed assessments over the
                last 30 days
              </p>
            </div>

            <select aria-label="Chart period">
              <option>Last 30 days</option>
            </select>
          </div>

          <div className="chart">
            <div className="ylabels">
              <span>12</span>
              <span>8</span>
              <span>4</span>
              <span>0</span>
            </div>

            <div className="bars">
              {[
                4, 7, 5, 8, 6,
                10, 8, 11, 7, 9,
                12, 10, 8, 9, 11,
                8, 10, 12, 9, 11,
              ].map((h, i) => (
                <i
                  style={{
                    height: `${h * 7}%`,
                  }}
                  key={i}
                />
              ))}
            </div>
          </div>

          <div className="chart-legend">
            <span>
              <i className="dot plum" />
              Assessments
            </span>

            <span>
              Reference activity
            </span>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Recent analyses</h2>
              <p>Illustrative model runs</p>
            </div>

            <Link
              href="/history"
              className="text-link"
            >
              View all →
            </Link>
          </div>

          <div className="analysis-list">
            {[
              [
                'A-240618',
                'Case 0184',
                'Likely PCOS',
                '92%',
                'high',
              ],
              [
                'A-240617',
                'Case 0183',
                'Unlikely PCOS',
                '88%',
                'low',
              ],
              [
                'A-240615',
                'Case 0182',
                'Likely PCOS',
                '95%',
                'high',
              ],
              [
                'A-240614',
                'Case 0181',
                'Review needed',
                '71%',
                'review',
              ],
            ].map((a) => (
              <Link
                href="/results"
                className="analysis"
                key={a[0]}
              >
                <span
                  className={`risk ${a[4]}`}
                >
                  {a[4] === 'high'
                    ? '!'
                    : a[4] === 'low'
                    ? '✓'
                    : '?'}
                </span>

                <span>
                  <b>{a[1]}</b>
                  <small>
                    {a[0]} · Reference result
                  </small>
                </span>

                <strong>{a[3]}</strong>

                <span className="arrow">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="grid two">
        <section className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h2>Analysis activity</h2>

              <p>
                Completed assessments over the
                last 30 days
              </p>
            </div>

            <select aria-label="Chart period">
              <option>Last 30 days</option>
            </select>
          </div>

          <div className="chart">
            <div className="ylabels">
              <span>12</span>
              <span>8</span>
              <span>4</span>
              <span>0</span>
            </div>

            <div className="bars">
              {[
                4, 7, 5, 8, 6,
                10, 8, 11, 7, 9,
                12, 10, 8, 9, 11,
                8, 10, 12, 9, 11,
              ].map((h, i) => (
                <i
                  style={{
                    height: `${h * 7}%`,
                  }}
                  key={i}
                />
              ))}
            </div>
          </div>

          <div className="chart-legend">
            <span>
              <i className="dot plum" />
              Assessments
            </span>

            <span>
              Jun 01 — Jun 30, 2024
            </span>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Recent analyses</h2>
              <p>Your latest model runs</p>
            </div>

            <Link
              href="/history"
              className="text-link"
            >
              View all →
            </Link>
          </div>

          <div className="analysis-list">
            {[
              [
                'A-240618',
                'Case 0184',
                'Likely PCOS',
                '92%',
                'high',
              ],
              [
                'A-240617',
                'Case 0183',
                'Unlikely PCOS',
                '88%',
                'low',
              ],
              [
                'A-240615',
                'Case 0182',
                'Likely PCOS',
                '95%',
                'high',
              ],
              [
                'A-240614',
                'Case 0181',
                'Review needed',
                '71%',
                'review',
              ],
            ].map((a) => (
              <Link
                href="/results"
                className="analysis"
                key={a[0]}
              >
                <span
                  className={`risk ${a[4]}`}
                >
                  {a[4] === 'high'
                    ? '!'
                    : a[4] === 'low'
                    ? '✓'
                    : '?'}
                </span>

                <span>
                  <b>{a[1]}</b>

                  <small>
                    {a[0]} · Today, 10:
                    {a[0].slice(-1)} AM
                  </small>
                </span>

                <strong>{a[3]}</strong>

                <span className="arrow">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}

export function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Logo />

        <nav>
          <Link href="/#how-it-works">
            How it works
          </Link>

          <Link href="/#research">
            Research
          </Link>

          <Link href="/#about">
            About
          </Link>
        </nav>

        <div>
          <Link
            className="login-link"
            href="/auth"
          >
            Sign in
          </Link>

          <Link
            className="button primary"
            href="/auth"
          >
            Get started →
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="pill">
            <span /> AI-assisted clinical research
          </div>

          <h1>
            Better insights.
            <br />
            <i>Better understanding.</i>
            <br />
            Better care.
          </h1>

          <p>
            Ovalens ai brings clinical data and
            ultrasound imaging together with
            explainable AI to help uncover meaningful
            patterns in women's health — showing not
            only what the model predicts, but why.
          </p>

          <div className="hero-actions">
            <Link
              className="button primary large"
              href="/auth"
            >
              Start an analysis →
            </Link>

            <Link
              className="button ghost large"
              href="/methodology"
            >
              Explore the methodology
            </Link>
          </div>

          <div className="trust">
            <span>Built for careful inquiry</span>
            <span>•</span>
            <span>Evidence-aware</span>
            <span>•</span>
            <span>Human-led</span>
          </div>
        </div>

        <div className="hero-art">
          <div className="orbital">
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />

            <div className="core">
              <span>PCOS</span>
              <b>insight</b>
            </div>

            <div className="node n1">US</div>
            <div className="node n2">CL</div>
            <div className="node n3">AI</div>
          </div>
        </div>
      </section>

      <section
        className="home-research"
        id="how-it-works"
      >
        <div className="section-intro">
          <div className="kicker">
            How it works
          </div>

          <h2>
            Two lenses. One research question.
          </h2>

          <p>
            Ovalens ai keeps clinical machine
            learning and ultrasound deep learning
            distinct, then makes their reasoning
            visible for comparison.
          </p>
        </div>

        <div className="home-cards">
          <Link
            href="/clinical"
            className="home-card"
          >
            <span className="card-index">01</span>

            <h3>Clinical ML</h3>

            <p>
              Clinical data is preprocessed, modeled,
              and explained with SHAP feature
              attribution.
            </p>

            <b>
              Explore clinical pipeline →
            </b>
          </Link>

          <Link
            href="/ultrasound"
            className="home-card"
          >
            <span className="card-index">02</span>

            <h3>Ultrasound DL</h3>

            <p>
              Ultrasound imagery moves through CNN or
              transfer learning models and Grad-CAM
              visualization.
            </p>

            <b>
              Explore imaging pipeline →
            </b>
          </Link>

          <Link
            href="/comparison"
            className="home-card"
          >
            <span className="card-index">03</span>

            <h3>Model comparison</h3>

            <p>
              Compare what each modality learns and
              where their predictions agree or differ.
            </p>

            <b>
              View comparison →
            </b>
          </Link>
        </div>
      </section>

      <section
        className="home-research research-section"
        id="research"
      >
        <div className="section-intro">
          <div className="kicker">
            Research
          </div>

          <h2>
            Evidence closer to decisions.
          </h2>

          <p>
            Our work studies complementary model
            families, transparent metrics, and
            explanations that invite expert review
            rather than replace it.
          </p>

          <Link
            href="/methodology"
            className="button outline"
          >
            Read the methodology →
          </Link>
        </div>
      </section>

      <section
        className="home-about"
        id="about"
      >
        <div>
          <div className="kicker">
            Research, not diagnosis
          </div>

          <h2>
            Built for careful inquiry.
          </h2>
        </div>

        <p>
          This research prototype explores
          explainable multimodal AI for PCOS analysis.
          Every value in this interface is illustrative
          or a literature reference, not a trained model
          performance claim.
        </p>

        <Link
          href="/about"
          className="button outline"
        >
          Read about the project →
        </Link>
      </section>

      <section className="landing-footer">
        <span>
          Designed for researchers who ask better
          questions.
        </span>

        <span>
          Prototype · v0.1
        </span>
      </section>
    </div>
  )
}

export function Auth() {
  const [isSignup, setIsSignup] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError("")
    setSuccess("")

    if (!email || !password || (isSignup && !name)) {
      setError("Please fill in all required fields.")
      return
    }

    setLoading(true)

    try {
      const endpoint = isSignup
        ? "http://localhost:8000/auth/signup"
        : "http://localhost:8000/auth/login"

      let response: Response

      if (isSignup) {
        // ==============================
        // CREATE ACCOUNT
        // ==============================

        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        })
      } else {
        // ==============================
        // LOGIN
        // ==============================

        const formData = new URLSearchParams()

        formData.append("username", email)
        formData.append("password", password)

        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        })
      }

      const data = await response.json()

      if (!response.ok) {
        const message = Array.isArray(data.detail)
          ? data.detail
              .map(
                (item: { msg?: string }) =>
                  item.msg || "Validation error"
              )
              .join(", ")
          : data.detail ||
            (isSignup
              ? "Unable to create account."
              : "Invalid email or password.")

        throw new Error(message)
      }

      // ==============================
      // SIGNUP SUCCESS
      // ==============================

      if (isSignup) {
        setSuccess(
          "Account created successfully. Please sign in."
        )

        setIsSignup(false)
        setPassword("")

        return
      }

      // ==============================
      // LOGIN SUCCESS
      // ==============================

      sessionStorage.setItem(
        "token",
        data.access_token
      )

      sessionStorage.setItem(
        "user",
        JSON.stringify(data.user)
      )

      window.location.href = "/dashboard"

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">

      {/* ========================================= */}
      {/* LEFT SIDE */}
      {/* ========================================= */}

      <div className="auth-left">

        <Logo />

        <div className="auth-quote">

          <div className="kicker">
            A more considered lens
          </div>

          <h1>
            Understand the signal
            <br />
            <i>behind the data.</i>
          </h1>

          <p>
            Explore multimodal PCOS research with
            transparent, explainable AI tools built
            for clinical inquiry.
          </p>

        </div>

        <span className="auth-foot">
          Ovalens ai · Research prototype
        </span>

      </div>


      {/* ========================================= */}
      {/* RIGHT SIDE */}
      {/* ========================================= */}

      <div className="auth-right">

        <div className="auth-form">

          <div className="kicker">
            {isSignup
              ? "Create your workspace"
              : "Welcome back"}
          </div>


          <h1>
            {isSignup
              ? "Create your account"
              : "Sign in to your workspace"}
          </h1>


          <p>
            {isSignup
              ? "Create an account to keep your analyses private and accessible to you."
              : "Continue your research where you left off."}
          </p>


          {/* ===================================== */}
          {/* NAME — SIGNUP ONLY */}
          {/* ===================================== */}

          {isSignup && (
            <label>
              Full name

              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </label>
          )}


          {/* ===================================== */}
          {/* EMAIL */}
          {/* ===================================== */}

          <label>
            Email address

            <input
              type="email"
              placeholder="you@institution.edu"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </label>


          {/* ===================================== */}
          {/* PASSWORD */}
          {/* ===================================== */}

          <label>
            Password

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </label>


          {/* ===================================== */}
          {/* ERROR */}
          {/* ===================================== */}

          {error && (
            <p
              style={{
                color: "#9b2c2c",
                marginTop: "8px",
              }}
            >
              {error}
            </p>
          )}


          {/* ===================================== */}
          {/* SUCCESS */}
          {/* ===================================== */}

          {success && (
            <p
              style={{
                color: "#2f7d4a",
                marginTop: "8px",
              }}
            >
              {success}
            </p>
          )}


          {/* ===================================== */}
          {/* LOGIN OPTIONS */}
          {/* ===================================== */}

          {!isSignup && (
            <div className="form-row">

              <label className="check">
                <input type="checkbox" />
                Remember me
              </label>

              <Link href="/auth">
                Forgot password?
              </Link>

            </div>
          )}


          {/* ===================================== */}
          {/* MAIN BUTTON */}
          {/* ===================================== */}

          <button
            type="button"
            className="button primary full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? isSignup
                ? "Creating account..."
                : "Signing in..."
              : isSignup
                ? "Create account →"
                : "Sign in →"}
          </button>


          {/* ===================================== */}
          {/* SSO — LOGIN ONLY */}
          {/* ===================================== */}

          {!isSignup && (
            <>
              <div className="divider">
                <span>or</span>
              </div>

              <button
                type="button"
                className="button outline full"
              >
                Continue with institution SSO
              </button>
            </>
          )}


          {/* ===================================== */}
          {/* TOGGLE LOGIN / SIGNUP */}
          {/* ===================================== */}

          <p className="signup">

            {isSignup
              ? "Already have an account? "
              : "New to OvaLens? "}

            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup)
                setError("")
                setSuccess("")
              }}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                font: "inherit",
                color: "inherit",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {isSignup
                ? "Sign in"
                : "Create an account"}
            </button>

          </p>

        </div>

      </div>

    </div>
  )
}
  
export function GenericPage({
  kind,
  title,
  desc,
}: {
  kind: string
  title: string
  desc: string
}) {
  return (
    <AppShell
      title={title}
      eyebrow={kind}
    >
      <PageTitle
        kicker={kind}
        title={title}
        desc={desc}
      />

      <DemoNotice />

      <section className="panel empty-panel">
        <div className="empty-art">
          {kind === 'Ultrasound'
            ? '◉'
            : kind === 'Explainability'
            ? '≋'
            : '＋'}
        </div>

        <h2>
          {kind === 'Clinical Data'
            ? 'Start a new clinical analysis'
            : `Explore ${title.toLowerCase()}`}
        </h2>

        <p>
          This research workspace is ready for your
          validated data and model outputs. The
          interactive surface below uses reference
          values for demonstration.
        </p>

        <Link
          className="button primary"
          href="/clinical"
        >
          Open analysis workspace →
        </Link>
      </section>
    </AppShell>
  )
}

export function About() {
  return (
    <AppShell
      title="About"
      eyebrow="About the project"
    >
      <PageTitle
        kicker="About ovalens ai"
        title="A research workspace for explainable comparison."
        desc="We are exploring how clinical ML and ultrasound DL can be studied together without hiding the reasoning behind either model."
      />

      <section className="panel about-note">
        <h2>Our focus</h2>

        <p>
          The core novelty is comparison: clinical
          parameters flow through machine learning and
          SHAP, while ultrasound images flow through
          deep learning and Grad-CAM. The two
          perspectives can then be inspected side by
          side.
        </p>

        <p>
          This is a research prototype for academic
          purposes. AI predictions should not be
          considered a medical diagnosis.
        </p>
      </section>
    </AppShell>
  )
}

export function Methodology() {
  return (
    <AppShell
      title="Methodology"
      eyebrow="About the project"
    >
      <PageTitle
        kicker="Transparent by design"
        title="A careful approach to clinical AI."
        desc="ovalens ai is a research prototype exploring how multimodal models can support — not replace — expert reasoning."
      />

      <div className="method-grid">
        <section className="panel">
          <div className="step">01</div>

          <h2>Multimodal by nature</h2>

          <p>
            Clinical features, lab markers, and
            ultrasound imagery each tell part of the
            story. Our framework keeps those signals
            distinct before bringing them together.
          </p>
        </section>

        <section className="panel">
          <div className="step">02</div>

          <h2>Explainable at every layer</h2>

          <p>
            SHAP feature attribution and Grad-CAM
            visualizations make model behavior
            inspectable, so you can ask not only what
            the model predicts, but why.
          </p>
        </section>

        <section className="panel">
          <div className="step">03</div>

          <h2>Human-led, always</h2>

          <p>
            Every output is framed as decision
            support. Results require clinical context,
            validation against local cohorts, and
            review by qualified professionals.
          </p>
        </section>
      </div>

      <div className="panel about-note">
        <h2>Research note</h2>

        <p>
          This interface contains illustrative data
          only. It is not validated for diagnosis,
          treatment, screening, or patient care.
          Connect a validated inference service and
          institutional governance process before any
          real-world use.
        </p>
      </div>
    </AppShell>
  )
}

export function Comparison() {
  return (
    <AppShell
      title="Comparison"
      eyebrow="Model evaluation"
    >
      <PageTitle
        kicker="Model evaluation"
        title="Compare model behavior."
        desc="Inspect how the reference ensemble performs across available modalities."
      />

      <DemoNotice />

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>
              Performance by modality
            </h2>

            <p>
              Illustrative validation metrics ·
              reference cohort n=480
            </p>
          </div>
        </div>

        <div className="comparison">
          <div className="compare-head">
            <span>Metric</span>
            <b>Clinical only</b>
            <b>Ultrasound only</b>
            <b>Multimodal</b>
          </div>

          {[
            [
              'AUROC',
              '0.81',
              '0.84',
              '0.91',
            ],
            [
              'Sensitivity',
              '74%',
              '79%',
              '86%',
            ],
            [
              'Specificity',
              '78%',
              '76%',
              '89%',
            ],
            [
              'F1 score',
              '0.76',
              '0.77',
              '0.87',
            ],
          ].map((r) => (
            <div
              className="compare-row"
              key={r[0]}
            >
              <span>{r[0]}</span>
              <b>{r[1]}</b>
              <b>{r[2]}</b>
              <b className="best">
                {r[3]}
              </b>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  )
}

export function History() {
  return (
    <AppShell
      title="History"
      eyebrow="Your analyses"
    >
      <PageTitle
        kicker="Analysis history"
        title="A record of your inquiry."
        desc="Review, filter, and revisit previous model runs."
        action={
          <Link
            className="button primary"
            href="/clinical"
          >
            ＋ New analysis
          </Link>
        }
      />

      <section className="panel">
        <div className="filters">
          <input placeholder="Search by case ID..." />

          <select>
            <option>
              All outcomes
            </option>
          </select>

          <select>
            <option>
              All dates
            </option>
          </select>
        </div>

        <div className="history-table">
          <div className="table-head">
            <span>Analysis</span>
            <span>Outcome</span>
            <span>Confidence</span>
            <span>Status</span>
            <span>Date</span>
          </div>

          {[
            '0184',
            '0183',
            '0182',
            '0181',
            '0180',
          ].map((id, i) => (
            <Link
              href="/results"
              className="table-row"
              key={id}
            >
              <b>A-2406{18 - i}</b>

              <span>
                Case {id}
              </span>

              <span
                className={`badge ${
                  i % 2
                    ? 'low'
                    : 'high'
                }`}
              >
                {i % 2
                  ? 'UNLIKELY'
                  : 'LIKELY'}
              </span>

              <strong>
                {92 - i * 4}%
              </strong>

              <span>
                Jun {18 - i}, 2024
              </span>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  )
}

export function Explainability({
  grad = false,
}: {
  grad?: boolean
}) {
  return (
    <AppShell
      title="Explainability"
      eyebrow="Model interpretation"
    >
      <PageTitle
        kicker={
          grad
            ? 'Grad-CAM visualization'
            : 'SHAP feature attribution'
        }
        title={
          grad
            ? 'Where did the model look?'
            : 'Why this prediction?'
        }
        desc={
          grad
            ? 'Visualize image regions that influenced the ultrasound model.'
            : 'Understand which features contributed most to the prediction.'
        }
      />

      <div className="tabs">
        <Link
          className={
            !grad ? 'selected' : ''
          }
          href="/explainability/shap"
        >
          Feature attribution
        </Link>

        <Link
          className={
            grad ? 'selected' : ''
          }
          href="/explainability/grad-cam"
        >
          Image attention
        </Link>
      </div>

      {grad ? (
        <section className="panel gradcam">
          <div className="scan">
            <div className="scan-label">
              ULTRASOUND · CASE 0184
            </div>

            <div className="scan-blob" />

            <div className="heat heat-one" />

            <div className="heat heat-two" />

            <span className="scan-caption">
              Grad-CAM overlay · illustrative
            </span>
          </div>

          <div>
            <h2>
              Attention regions
            </h2>

            <p>
              The overlay highlights regions
              associated with the model's output.
              Attention is not equivalent to clinical
              relevance.
            </p>

            <div className="legend">
              <span>
                <i className="heat-dot high-dot" />
                High attention
              </span>

              <span>
                <i className="heat-dot mid-dot" />
                Moderate attention
              </span>
            </div>
          </div>
        </section>
      ) : (
        <section className="panel shap">
          <div className="shap-summary">
            <div className="prob-ring">
              <strong>92%</strong>
              <span>likely PCOS</span>
            </div>

            <p>
              Positive values push the prediction
              toward likely PCOS. Negative values push
              away from it.
            </p>
          </div>

          <div className="shap-bars">
            {[
              [
                'Irregular cycles',
                '+0.31',
              ],
              [
                'AMH level',
                '+0.24',
              ],
              [
                'Follicle count',
                '+0.20',
              ],
              [
                'BMI',
                '+0.11',
              ],
              [
                'Age',
                '−0.04',
              ],
            ].map((x, i) => (
              <div
                className="shap-row"
                key={x[0]}
              >
                <span>{x[0]}</span>

                <div>
                  <i
                    style={{
                      width: `${90 - i * 13}%`,
                    }}
                  />
                </div>

                <b>{x[1]}</b>
              </div>
            ))}
          </div>
        </section>
      )}
    </AppShell>
  )
}

export function AppRouterPage() {
  const path =
    typeof window !== 'undefined'
      ? window.location.pathname
      : '/'

  if (path === '/')
    return <Landing />

  if (path === '/auth')
    return <Auth />

  if (path === '/dashboard')
    return <Dashboard />

  if (path === '/clinical')
    return <Clinical />

  if (path === '/ultrasound')
    return <Ultrasound />

  if (path === '/results')
    return <Results />

  if (path === '/comparison')
    return <Comparison />

  if (path === '/history')
    return <History />

  if (path === '/methodology')
    return <Methodology />

  if (path === '/about')
    return <About />

  if (
    path ===
    '/explainability/grad-cam'
  )
    return (
      <Explainability grad />
    )

  if (
    path ===
    '/explainability/shap'
  )
    return <Explainability />

  return <Dashboard />
}

export default AppRouterPage