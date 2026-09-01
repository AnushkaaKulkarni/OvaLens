"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import {
  AppShell,
  PageTitle,
  DemoNotice,
  Stat,
} from "@/components/app-shell"

type HistoryItem = {
  id: string
  created_at: string
  prediction: number
  result: string
  pcos_probability: number
  explanation: any[]
}

export default function DashboardPage() {

  const [history, setHistory] =
    useState<HistoryItem[]>([])

  const [loading, setLoading] =
    useState(true)


  // ============================================================
  // FETCH HISTORY FROM MONGODB
  // ============================================================

  useEffect(() => {

    async function fetchHistory() {

      try {

        const token = sessionStorage.getItem("token")

if (!token) {
  throw new Error("Not authenticated")
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const response = await fetch(
  `${API_BASE}/history`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)

        if (!response.ok) {
          throw new Error(
            "Failed to fetch history"
          )
        }

        const data =
          await response.json()

        setHistory(
          data.history || []
        )

      } catch (error) {

        console.error(
          "Dashboard history error:",
          error
        )

      } finally {

        setLoading(false)

      }
    }

    fetchHistory()

  }, [])


  // ============================================================
  // STATS
  // ============================================================

  const totalAnalyses =
    history.length

  const pcosCases =
    history.filter(
      (item) => item.prediction === 1
    ).length

  const nonPcosCases =
    history.filter(
      (item) => item.prediction === 0
    ).length

  const averageProbability =
    totalAnalyses > 0
      ? (
          history.reduce(
            (sum, item) =>
              sum + item.pcos_probability,
            0
          ) / totalAnalyses
        ).toFixed(2)
      : "0.00"


  // ============================================================
  // PAGE
  // ============================================================

  return (

    <AppShell title="Dashboard">

      <PageTitle
        kicker="Research workspace"
        title="Compare the signals that matter."
        desc="Explore the OVALENS AI research architecture across clinical machine learning and ultrasound deep learning."
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


      {/* ====================================================== */}
      {/* REAL MONGODB STATS */}
      {/* ====================================================== */}

      <div className="grid stats">

        <Stat
          label="Total analyses"
          value={String(totalAnalyses)}
          change="Saved in MongoDB"
        />

        <Stat
          label="PCOS predictions"
          value={String(pcosCases)}
          change="Model predictions"
        />

        <Stat
          label="Non-PCOS predictions"
          value={String(nonPcosCases)}
          change="Model predictions"
        />

        <Stat
          label="Average PCOS probability"
          value={`${averageProbability}%`}
          change="Across saved analyses"
        />

      </div>


      {/* ====================================================== */}
      {/* RESEARCH CARDS */}
      {/* ====================================================== */}

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


      {/* ====================================================== */}
      {/* RESEARCH PIPELINE */}
      {/* ====================================================== */}

      <section className="panel pipeline-panel">

        <div className="panel-head">

          <div>

            <div className="kicker">
              Core novelty
            </div>

            <h2>
              Research pipeline
            </h2>

            <p>
              Two parallel modeling paths,
              compared through complementary
              explanations.
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


      {/* ====================================================== */}
      {/* ACTIVITY + RECENT ANALYSES */}
      {/* ====================================================== */}

      <div className="grid two">


        {/* ACTIVITY */}

        <section className="panel chart-panel">

          <div className="panel-head">

            <div>

              <h2>
                Analysis activity
              </h2>

              <p>
                Completed assessments
              </p>

            </div>

            <span className="muted">
              MongoDB
            </span>

          </div>


          <div
            style={{
              padding: "45px 0",
              textAlign: "center",
            }}
          >

            <strong
              style={{
                fontSize: "52px",
              }}
            >
              {loading
                ? "..."
                : totalAnalyses}
            </strong>

            <p className="muted">
              total completed analyses
            </p>

          </div>

        </section>


        {/* RECENT ANALYSES */}

        <section className="panel">

          <div className="panel-head">

            <div>

              <h2>
                Recent analyses
              </h2>

              <p>
                Your latest model runs
              </p>

            </div>

            <Link
              href="/history"
              className="text-link"
            >
              View all →
            </Link>

          </div>


          <div className="analysis-list">

            {loading ? (

              <p className="muted">
                Loading analyses...
              </p>

            ) : history.length === 0 ? (

              <p className="muted">
                No analyses yet.
              </p>

            ) : (

              history
                .slice(0, 4)
                .map((item) => (

                  <Link
                    key={item.id}
                    href={`/results?id=${item.id}`}
                    className="analysis"
                  >

                    <span
                      className={`risk ${
                        item.prediction === 1
                          ? "high"
                          : "low"
                      }`}
                    >
                      {item.prediction === 1
                        ? "!"
                        : "✓"}
                    </span>


                    <span>

                      <b>
                        {item.result}
                      </b>

                      <small>
                        {new Date(
                          item.created_at
                        ).toLocaleString()}
                      </small>

                    </span>


                    <strong>
                      {item.pcos_probability}%
                    </strong>


                    <span className="arrow">
                      →
                    </span>

                  </Link>

                ))

            )}

          </div>

        </section>

      </div>

    </AppShell>
  )
}