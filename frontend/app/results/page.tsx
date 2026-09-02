"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  AppShell,
  PageTitle,
  DemoNotice,
} from "@/components/app-shell"

type Explanation = {
  feature: string
  value: number
  impact: number
  direction: "towards PCOS" | "towards Non-PCOS"
}

type PredictionResult = {
  id?: string
  created_at?: string
  prediction: number
  result: string
  pcos_probability: number
  explanation: Explanation[]
}

type UltrasoundResult = {
  prediction: number
  result: string
  pcos_probability: number
  non_pcos_probability: number
  gradcam: string
}

function ResultsContent() {

  const searchParams = useSearchParams()
  const analysisId = searchParams.get("id")

  const [result, setResult] =
    useState<PredictionResult | null>(null)

  const [ultrasoundResult, setUltrasoundResult] =
    useState<UltrasoundResult | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")


  // ============================================================
  // FETCH RESULT
  // ============================================================

  useEffect(() => {

  async function fetchResult() {

    try {

      // ======================================================
      // CURRENT ANALYSIS
      // ======================================================

      if (!analysisId) {

        const savedResult =
          sessionStorage.getItem(
            "predictionResult"
          )

        if (savedResult) {

          setResult(
            JSON.parse(savedResult)
          )

        } else {

          setError(
            "No prediction result was found."
          )

        }


        // Ultrasound result belongs to current session
        const savedUltrasound =
          sessionStorage.getItem(
            "ultrasoundResult"
          )

        if (savedUltrasound) {

          try {

            setUltrasoundResult(
              JSON.parse(savedUltrasound)
            )

          } catch {

            console.error(
              "Unable to read ultrasound result"
            )

          }

        }

        return
      }


      // ======================================================
      // HISTORY ANALYSIS
      // ======================================================

      const token = sessionStorage.getItem("token")

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const response = await fetch(
  `${API_BASE}/history/${analysisId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)

      if (!response.ok) {

        throw new Error(
          "Failed to fetch analysis"
        )

      }


      const data =
        await response.json()


      // Clinical result
      setResult(data)


      // Ultrasound result saved in MongoDB
      if (data.ultrasound) {

        setUltrasoundResult(
          data.ultrasound
        )

      } else {

        setUltrasoundResult(null)

      }


    } catch (error) {

      console.error(
        "Result error:",
        error
      )

      setError(
        "Unable to load this analysis."
      )

    } finally {

      setLoading(false)

    }

  }

  fetchResult()

}, [analysisId])


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <AppShell
        title="Results"
        eyebrow="Analysis"
      >

        <PageTitle
          kicker="Step 3 of 3"
          title="Loading prediction..."
          desc="Fetching the analysis result."
        />

      </AppShell>
    )
  }


  // ============================================================
  // ERROR / NO RESULT
  // ============================================================

  if (!result || error) {

    return (

      <AppShell
        title="Results"
        eyebrow="Analysis"
      >

        <PageTitle
          kicker="Step 3 of 3"
          title="No prediction available."
          desc="Run an analysis first to view the prediction."
        />

        <section className="panel form-panel">

          <p className="muted">
            {error ||
              "No prediction result was found for this analysis."}
          </p>

          <div className="form-actions">

            <Link
              className="button primary"
              href="/clinical"
            >
              Start New Analysis
            </Link>

            <Link
              href={`/results?id=${analysisId}`} 
              className="button ghost"
            >
              View Result →
            </Link>

          </div>

        </section>

      </AppShell>
    )
  }


  // ============================================================
  // HELPERS
  // ============================================================

  const isPCOS =
    result.prediction === 1

  const probability =
    result.pcos_probability


  const getImpactWidth = (
    impact: number
  ) => {

    const maxImpact =
      Math.max(
        ...result.explanation.map(
          (x) =>
            Math.abs(x.impact)
        ),
        0.001
      )

    return Math.min(
      (Math.abs(impact) /
        maxImpact) *
        100,
      100
    )
  }


  // ============================================================
  // MAIN RESULTS PAGE
  // ============================================================

  return (

    <AppShell
      title="Results"
      eyebrow="Analysis complete"
    >

      <PageTitle
        kicker="Step 3 of 3"
        title={
          isPCOS
            ? "Likely PCOS"
            : "Likely Non-PCOS"
        }
        desc="Prediction generated using the trained Random Forest model."
      />

      <DemoNotice />


      {/* ====================================================== */}
      {/* TOP CARDS */}
      {/* ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >

        {/* Probability */}

        <section className="panel">

          <p className="muted">
            PCOS Probability
          </p>

          <div
            style={{
              fontSize: "42px",
              fontWeight: 600,
              marginTop: "8px",
            }}
          >
            {probability}%
          </div>

          <p className="muted">
            Estimated probability from the model
          </p>

        </section>


        {/* Prediction */}

        <section className="panel">

          <p className="muted">
            Prediction
          </p>

          <div
            style={{
              fontSize: "30px",
              fontWeight: 600,
              marginTop: "8px",
            }}
          >
            {result.result}
          </div>

          <p className="muted">
            Random Forest classification
          </p>

        </section>


        {/* Explanation count */}

        <section className="panel">

          <p className="muted">
            Contributing Features
          </p>

          <div
            style={{
              fontSize: "42px",
              fontWeight: 600,
              marginTop: "8px",
            }}
          >
            {result.explanation.length}
          </div>

          <p className="muted">
            Top SHAP features
          </p>

        </section>

      </div>


      {/* ====================================================== */}
      {/* PREDICTION SUMMARY */}
      {/* ====================================================== */}

      <section
        className="panel"
        style={{
          marginBottom: "24px",
        }}
      >

        <h2>
          Prediction Summary
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            marginTop: "24px",
            flexWrap: "wrap",
          }}
        >

          {/* Probability circle */}

          <div
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              border: "10px solid #ead8ec",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >

            <strong
              style={{
                fontSize: "30px",
              }}
            >
              {probability}%
            </strong>

            <span className="muted">
              PCOS
            </span>

          </div>


          {/* Explanation */}

          <div>

            <h3
              style={{
                marginBottom: "8px",
              }}
            >
              {isPCOS
                ? "Pattern is consistent with PCOS"
                : "Pattern is not strongly indicative of PCOS"}
            </h3>

            <p
              className="muted"
              style={{
                maxWidth: "650px",
                lineHeight: 1.6,
              }}
            >
              The prediction is based on the
              clinical features provided and the
              learned patterns of the trained
              Random Forest model.
            </p>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* SHAP FEATURES */}
      {/* ====================================================== */}

      <section className="panel">

        <h2>
          Contributing Features
        </h2>

        <p className="muted">
          Features ranked by their SHAP contribution
          to this individual prediction.
        </p>


        <div
          style={{
            marginTop: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >

          {result.explanation.map(
            (item, index) => {

              const width =
                getImpactWidth(
                  item.impact
                )

              const towardsPCOS =
                item.impact > 0

              return (

                <div
                  key={item.feature}
                >

                  {/* Feature header */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >

                    <div>

                      <strong>
                        {index + 1}.{" "}
                        {item.feature}
                      </strong>

                      <span
                        className="muted"
                        style={{
                          marginLeft: "10px",
                        }}
                      >
                        Value: {item.value}
                      </span>

                    </div>


                    <span
                      style={{
                        fontWeight: 600,
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {item.impact > 0
                        ? "+"
                        : ""}
                      {item.impact.toFixed(3)}
                    </span>

                  </div>


                  {/* Bar */}

                  <div
                    style={{
                      height: "8px",
                      background:
                        "#eee7ef",
                      borderRadius: "10px",
                      marginTop: "8px",
                      overflow: "hidden",
                    }}
                  >

                    <div
                      style={{
                        width:
                          `${width}%`,
                        height: "100%",
                        background:
                          towardsPCOS
                            ? "#c44b72"
                            : "#6c9bd2",
                        borderRadius:
                          "10px",
                      }}
                    />

                  </div>


                  {/* Direction */}

                  <p
                    className="muted"
                    style={{
                      marginTop: "5px",
                      fontSize: "13px",
                    }}
                  >
                    {towardsPCOS
                      ? "↑ Contributes towards PCOS"
                      : "↓ Contributes towards Non-PCOS"}
                  </p>

                </div>

              )
            }
          )}

        </div>

      </section>

      {/* ====================================================== */}
{/* ULTRASOUND DEEP LEARNING */}
{/* ====================================================== */}

{ultrasoundResult && (
  <section
    className="panel"
    style={{
      marginTop: "24px",
    }}
  >

    <div className="kicker">
      Ultrasound Deep Learning
    </div>

    <h2>
      Ultrasound Analysis
    </h2>

    <p className="muted">
      ResNet50 prediction with Grad-CAM
      visualization.
    </p>


    {/* Prediction cards */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        marginTop: "24px",
      }}
    >

      <div className="panel">

        <p className="muted">
          Prediction
        </p>

        <div
          style={{
            fontSize: "28px",
            fontWeight: 600,
            marginTop: "8px",
          }}
        >
          {ultrasoundResult.result}
        </div>

        <p className="muted">
          ResNet50 classification
        </p>

      </div>


      <div className="panel">

        <p className="muted">
          PCOS Probability
        </p>

        <div
          style={{
            fontSize: "36px",
            fontWeight: 600,
            marginTop: "8px",
          }}
        >
          {ultrasoundResult.pcos_probability}%
        </div>

        <p className="muted">
          Ultrasound-based probability
        </p>

      </div>


      <div className="panel">

        <p className="muted">
          Non-PCOS Probability
        </p>

        <div
          style={{
            fontSize: "36px",
            fontWeight: 600,
            marginTop: "8px",
          }}
        >
          {ultrasoundResult.non_pcos_probability}%
        </div>

        <p className="muted">
          Ultrasound-based probability
        </p>

      </div>

    </div>


    {/* Grad-CAM */}

    <div
      style={{
        marginTop: "32px",
      }}
    >

      <h3>
        Grad-CAM Explanation
      </h3>

      <p
        className="muted"
        style={{
          marginTop: "6px",
          lineHeight: 1.6,
        }}
      >
        Grad-CAM highlights the image regions
        that contributed most strongly to the
        ResNet50 prediction.
      </p>


      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >

        <img
          src={`data:image/png;base64,${ultrasoundResult.gradcam}`}
          alt="Ultrasound Grad-CAM visualization"
          style={{
            width: "100%",
            maxWidth: "650px",
            borderRadius: "12px",
            border: "1px solid #eee7ef",
          }}
        />

      </div>

    </div>

  </section>
)}

{/* ====================================================== */}
{/* MULTIMODAL ASSESSMENT */}
{/* ====================================================== */}

{result && ultrasoundResult && (
  <section
    className="panel"
    style={{
      marginTop: "24px",
    }}
  >
    <div className="kicker">
      Multimodal Assessment
    </div>

    <h2>
      Clinical + Ultrasound Comparison
    </h2>

    <p
      className="muted"
      style={{
        marginTop: "6px",
        lineHeight: 1.6,
      }}
    >
      This section compares the predictions from
      the clinical machine-learning model and the
      ultrasound deep-learning model.
    </p>


    {/* MODEL COMPARISON */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        marginTop: "24px",
      }}
    >

      {/* Clinical */}

      <div className="panel">

        <div className="kicker">
          Clinical Model
        </div>

        <h3>
          {result.result}
        </h3>

        <p className="muted">
          PCOS probability
        </p>

        <strong
          style={{
            fontSize: "28px",
          }}
        >
          {result.pcos_probability}%
        </strong>

        <p
          className="muted"
          style={{
            marginTop: "8px",
          }}
        >
          Random Forest + SHAP
        </p>

      </div>


      {/* Ultrasound */}

      <div className="panel">

        <div className="kicker">
          Ultrasound Model
        </div>

        <h3>
          {ultrasoundResult.result}
        </h3>

        <p className="muted">
          PCOS probability
        </p>

        <strong
          style={{
            fontSize: "28px",
          }}
        >
          {ultrasoundResult.pcos_probability}%
        </strong>

        <p
          className="muted"
          style={{
            marginTop: "8px",
          }}
        >
          ResNet50 + Grad-CAM
        </p>

      </div>

    </div>


    {/* ================================================== */}
    {/* AGREEMENT / CONFLICT */}
    {/* ================================================== */}

    <div
      style={{
        marginTop: "24px",
        padding: "18px",
        borderRadius: "10px",
        border: "1px solid #e5dce7",
      }}
    >

      {result.result ===
ultrasoundResult.result ? (

        <>
          <h3>
            Models are in agreement
          </h3>

          <p className="muted">
            Both the clinical and ultrasound
            models produced the same prediction:
            <strong>
              {" "}
              {result.result}
            </strong>.
          </p>
        </>

      ) : (

        <>
          <h3>
            Conflicting Model Predictions
          </h3>

          <p className="muted">
            The clinical and ultrasound models
            produced different predictions.
          </p>

          <p className="muted">
            Clinical model:
            <strong>
              {" "}
              {result.result}
            </strong>
          </p>

          <p className="muted">
            Ultrasound model:
            <strong>
              {" "}
              {ultrasoundResult.result}
            </strong>
          </p>

          <p
            className="muted"
            style={{
              marginTop: "12px",
            }}
          >
            The two model outputs should be
            interpreted together with clinical
            assessment rather than treating either
            model as a standalone diagnosis.
          </p>
        </>

      )}

    </div>

  </section>
)}


      {/* ====================================================== */}
      {/* ACTIONS */}
      {/* ====================================================== */}

      <div
        className="form-actions"
        style={{
          marginTop: "24px",
        }}
      >

        <Link
          className="button ghost"
          href="/history"
        >
          ← Back to History
        </Link>

        <Link
          className="button ghost"
          href="/clinical"
        >
          Start New Analysis
        </Link>

        <Link
  className="button primary"
  href={
    result.id
      ? `/explainability/shap?id=${result.id}`
      : "/explainability/shap"
  }
>
  View Full Explainability →
</Link>

      </div>

    </AppShell>
  )
}

export default function Results() {
  return (
    <Suspense
      fallback={
        <AppShell
          title="Results"
          eyebrow="Analysis"
        >
          <PageTitle
            kicker="Step 3 of 3"
            title="Loading prediction..."
            desc="Fetching the analysis result."
          />
        </AppShell>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}