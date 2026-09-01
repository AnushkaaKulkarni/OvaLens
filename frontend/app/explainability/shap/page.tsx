"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
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
  prediction: number
  result: string
  pcos_probability: number
  explanation: Explanation[]
}

export default function Explainability() {

  const searchParams = useSearchParams()

  const analysisId =
    searchParams.get("id")

  const [result, setResult] =
    useState<PredictionResult | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")


  // ============================================================
  // FETCH ANALYSIS
  // ============================================================

  useEffect(() => {

    async function fetchResult() {

      try {

        // ------------------------------------------------------
        // IF NO ID → USE CURRENT SESSION RESULT
        // ------------------------------------------------------

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

          return
        }


        // ------------------------------------------------------
        // FETCH FROM MONGODB
        // ------------------------------------------------------

        const token = sessionStorage.getItem("token")

if (!token) {
  throw new Error("Please sign in first.")
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const response = await fetch(
  `${API_BASE}/history/${analysisId}`,
  {
    headers: {
      Accept: "application/json",
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

        setResult(data)

      } catch (error) {

        console.error(
          "Explainability error:",
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
        title="SHAP Explainability"
        eyebrow="Explainability"
      >

        <PageTitle
          kicker="Patient-level explanation"
          title="Loading explanation..."
          desc="Fetching the analysis from the OVALENS database."
        />

      </AppShell>
    )
  }


  // ============================================================
  // NO RESULT
  // ============================================================

    if (!result || error) {

    return (

      <AppShell
        title="SHAP Explainability"
        eyebrow="Explainability"
      >

        <PageTitle
          kicker="Patient-level explanation"
          title="No analysis available."
          desc="Unable to load the requested SHAP explanation."
        />

        <section className="panel form-panel">

          <p className="muted">
            {error ||
              "No prediction result was found."}
          </p>

          <div className="form-actions">

            <Link
              className="button ghost"
              href="/history"
            >
              ← Back to History
            </Link>

            <Link
              className="button primary"
              href="/clinical"
            >
              Start New Analysis
            </Link>

          </div>

        </section>

      </AppShell>
    )
  }


  // ============================================================
  // DATA
  // ============================================================

  const positiveFactors =
    result.explanation
      .filter((item) => item.impact > 0)
      .sort(
        (a, b) =>
          b.impact - a.impact
      )

  const negativeFactors =
    result.explanation
      .filter((item) => item.impact < 0)
      .sort(
        (a, b) =>
          a.impact - b.impact
      )


  const maxImpact =
    Math.max(
      ...result.explanation.map(
        (item) =>
          Math.abs(item.impact)
      ),
      0.001
    )


  // ============================================================
  // FEATURE DESCRIPTION
  // ============================================================

  const getDescription = (
    feature: string,
    direction: string
  ) => {

    const descriptions: Record<
      string,
      string
    > = {

      "Follicle_No._R":
        "Right ovarian follicle count contributed to the prediction.",

      "Follicle_No._L":
        "Left ovarian follicle count contributed to the prediction.",

      "Weight_gainY/N":
        "Reported weight gain contributed to the model decision.",

      "Skin_darkening_Y/N":
        "Skin darkening status contributed to the model decision.",

      "hair_growthY/N":
        "Hair growth status contributed to the model decision.",

      "AMHng/mL":
        "AMH level contributed to the model decision.",

      "CycleR/I":
        "Cycle regularity contributed to the model decision.",

      "Cycle_lengthdays":
        "Cycle length contributed to the model decision.",

      "BMI":
        "BMI contributed to the model decision.",

      "Age_yrs":
        "Age contributed to the model decision.",
    }

    return (
      descriptions[feature] ??
      `${feature} contributed ${direction.toLowerCase()} to the model prediction.`
    )
  }


  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (

    <AppShell
      title="SHAP Explainability"
      eyebrow="Explainability"
    >

      <PageTitle
        kicker="Patient-level explanation"
        title="Why did the model make this prediction?"
        desc="SHAP values show how individual clinical features influenced the Random Forest prediction."
      />

      <DemoNotice />


      {/* ====================================================== */}
      {/* RESULT SUMMARY */}
      {/* ====================================================== */}

      <section
        className="panel"
        style={{
          marginBottom: "24px",
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >

          <div>

            <p className="muted">
              Model prediction
            </p>

            <h2
              style={{
                marginTop: "6px",
                marginBottom: "4px",
              }}
            >
              {result.result}
            </h2>

            <p className="muted">
              Random Forest classification
            </p>

          </div>


          <div
            style={{
              textAlign: "right",
            }}
          >

            <p className="muted">
              PCOS Probability
            </p>

            <strong
              style={{
                fontSize: "36px",
              }}
            >
              {result.pcos_probability}%
            </strong>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* HOW TO READ SHAP */}
      {/* ====================================================== */}

      <section
        className="panel"
        style={{
          marginBottom: "24px",
        }}
      >

        <h2>
          How to read this explanation
        </h2>

        <p
          className="muted"
          style={{
            lineHeight: 1.7,
            maxWidth: "800px",
          }}
        >
          Each SHAP value represents the contribution
          of a feature to this individual prediction.
          A positive value pushes the model toward PCOS,
          while a negative value pushes the model toward
          Non-PCOS. Larger absolute values indicate
          stronger influence.
        </p>

      </section>


      {/* ====================================================== */}
      {/* SHAP GRAPH */}
      {/* ====================================================== */}

      <section
        className="panel"
        style={{
          marginBottom: "24px",
        }}
      >

        <h2>
          Feature Impact
        </h2>

        <p className="muted">
          Top {result.explanation.length} features ranked
          by their individual contribution.
        </p>


        <div
          style={{
            marginTop: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >

          {result.explanation.map(
            (item, index) => {

              const magnitude =
                Math.abs(item.impact)

              const width =
                (magnitude / maxImpact) *
                100

              const isPositive =
                item.impact > 0

              return (

                <div key={item.feature}>

                  {/* Header */}

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
                          marginLeft: "12px",
                        }}
                      >
                        Value: {item.value}
                      </span>

                    </div>


                    <strong
                      style={{
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {item.impact > 0
                        ? "+"
                        : ""}
                      {item.impact.toFixed(3)}
                    </strong>

                  </div>


                  {/* Bar */}

                  <div
                    style={{
                      height: "12px",
                      background:
                        "#eee7ef",
                      borderRadius: "20px",
                      marginTop: "9px",
                      overflow: "hidden",
                    }}
                  >

                    <div
                      style={{
                        width: `${width}%`,
                        height: "100%",
                        background:
                          isPositive
                            ? "#c44b72"
                            : "#6c9bd2",
                        borderRadius:
                          "20px",
                        transition:
                          "width 0.4s ease",
                      }}
                    />

                  </div>


                  {/* Direction */}

                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "13px",
                    }}
                  >

                    <span className="muted">

                      {isPositive
                        ? "↑ Towards PCOS"
                        : "↓ Towards Non-PCOS"}

                    </span>

                  </div>

                </div>
              )
            }
          )}

        </div>

      </section>


      {/* ====================================================== */}
      {/* POSITIVE / NEGATIVE */}
      {/* ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >

        {/* POSITIVE */}

        <section className="panel">

          <h2>
            Factors increasing PCOS score
          </h2>

          <p className="muted">
            Features with positive SHAP contributions.
          </p>


          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >

            {positiveFactors.length === 0 ? (

              <p className="muted">
                No top features pushed the prediction
                towards PCOS.
              </p>

            ) : (

              positiveFactors.map(
                (item) => (

                  <div key={item.feature}>

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                      }}
                    >

                      <strong>
                        {item.feature}
                      </strong>

                      <span>
                        +
                        {item.impact.toFixed(3)}
                      </span>

                    </div>

                    <p
                      className="muted"
                      style={{
                        fontSize: "13px",
                        marginTop: "5px",
                      }}
                    >
                      {getDescription(
                        item.feature,
                        "towards PCOS"
                      )}
                    </p>

                  </div>

                )
              )
            )}

          </div>

        </section>


        {/* NEGATIVE */}

        <section className="panel">

          <h2>
            Factors reducing PCOS score
          </h2>

          <p className="muted">
            Features with negative SHAP contributions.
          </p>


          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >

            {negativeFactors.length === 0 ? (

              <p className="muted">
                No top features pushed the prediction
                towards Non-PCOS.
              </p>

            ) : (

              negativeFactors.map(
                (item) => (

                  <div key={item.feature}>

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                      }}
                    >

                      <strong>
                        {item.feature}
                      </strong>

                      <span>
                        {item.impact.toFixed(3)}
                      </span>

                    </div>

                    <p
                      className="muted"
                      style={{
                        fontSize: "13px",
                        marginTop: "5px",
                      }}
                    >
                      {getDescription(
                        item.feature,
                        "towards Non-PCOS"
                      )}
                    </p>

                  </div>

                )
              )
            )}

          </div>

        </section>

      </div>


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
          href="/results"
        >
          ← Back to Results
        </Link>


        <Link
          className="button primary"
          href="/clinical"
        >
          Start New Analysis →
        </Link>

      </div>

    </AppShell>
  )
}