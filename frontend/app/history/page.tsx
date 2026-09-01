"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AppShell,
  PageTitle,
} from "@/components/app-shell"

type Explanation = {
  feature: string
  value: number
  impact: number
  direction: string
}

type HistoryItem = {
  id: string
  created_at: string
  prediction: number
  result: string
  pcos_probability: number
  explanation: Explanation[]
}

export default function History() {

  const [history, setHistory] =
    useState<HistoryItem[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")


  // ============================================================
  // FETCH HISTORY FROM MONGODB
  // ============================================================

  useEffect(() => {

    async function fetchHistory() {

      try {

  const token = sessionStorage.getItem("token")

  if (!token) {
    setError("Please sign in to view your history.")
    return
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

  setHistory(data.history || [])

} catch (error) {

  console.error(
    "History error:",
    error
  )

  setError(
    "Unable to load analysis history."
  )

} finally {

  setLoading(false)

}
    }

    fetchHistory()

  }, [])


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (
      <AppShell
        title="History"
        eyebrow="Past analyses"
      >

        <PageTitle
          kicker="Analysis history"
          title="Loading history..."
          desc="Fetching your previous analyses."
        />

      </AppShell>
    )
  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error) {

    return (
      <AppShell
        title="History"
        eyebrow="Past analyses"
      >

        <PageTitle
          kicker="Analysis history"
          title="Unable to load history."
          desc={error}
        />

        <section className="panel form-panel">

          <p className="muted">
            Make sure the backend is running on
            port 8000.
          </p>

          <div className="form-actions">

            <Link
              href="/clinical"
              className="button primary"
            >
              Start New Analysis →
            </Link>

          </div>

        </section>

      </AppShell>
    )
  }


  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (

    <AppShell
      title="History"
      eyebrow="Past analyses"
    >

      <PageTitle
        kicker="Analysis history"
        title="Previous predictions."
        desc="Review analyses permanently saved in the OVALENS database."
      />


      {history.length === 0 ? (

        <section className="panel form-panel">

          <h2>
            No analyses yet
          </h2>

          <p className="muted">
            Completed predictions will appear here.
          </p>

          <div className="form-actions">

            <Link
              href="/clinical"
              className="button primary"
            >
              Start New Analysis →
            </Link>

          </div>

        </section>

      ) : (

        <section className="panel">

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

              <h2>
                Analysis History
              </h2>

              <p className="muted">
                {history.length} completed{" "}
                {history.length === 1
                  ? "analysis"
                  : "analyses"}
              </p>

            </div>

          </div>


          {/* ================================================== */}
          {/* HISTORY CARDS */}
          {/* ================================================== */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginTop: "24px",
            }}
          >

            {history.map(
              (item, index) => (

                <div
                  key={item.id}
                  style={{
                    border:
                      "1px solid #eadfea",
                    borderRadius: "12px",
                    padding: "20px",
                  }}
                >

                  {/* ======================================== */}
                  {/* TOP */}
                  {/* ======================================== */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >

                    <div>

                      <strong>
                        Analysis #{history.length - index}
                      </strong>

                      <p
                        className="muted"
                        style={{
                          marginTop: "6px",
                        }}
                      >
                        {new Date(
                          item.created_at
                        ).toLocaleString()}
                      </p>

                    </div>


                    {/* RESULT */}

                    <div
                      style={{
                        textAlign: "right",
                      }}
                    >

                      <strong>
                        {item.result}
                      </strong>

                      <p
                        className="muted"
                        style={{
                          marginTop: "6px",
                        }}
                      >
                        PCOS probability:{" "}
                        {item.pcos_probability}%
                      </p>

                    </div>

                  </div>


                  {/* ======================================== */}
                  {/* DETAILS */}
                  {/* ======================================== */}

                  <div
                    style={{
                      marginTop: "18px",
                      paddingTop: "16px",
                      borderTop:
                        "1px solid #eee7ef",
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: "15px",
                      flexWrap: "wrap",
                    }}
                  >

                    <span className="muted">

                      {item.explanation.length}{" "}
                      SHAP features

                    </span>


                    <Link
  href={`/results?id=${item.id}`}
  className="button ghost"
>
  View Result →
</Link>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

      )}

    </AppShell>
  )
}