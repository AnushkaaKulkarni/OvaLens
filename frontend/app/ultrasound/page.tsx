"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AppShell,
  PageTitle,
  DemoNotice,
} from "@/components/app-shell"

type ClinicalData = {
  [key: string]: string
}

type UltrasoundResult = {
  prediction: number
  result: string
  pcos_probability: number
  non_pcos_probability: number
  gradcam: string
}

export default function Ultrasound() {
  const router = useRouter()

  const [clinicalData, setClinicalData] =
    useState<ClinicalData | null>(null)

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [previewUrl, setPreviewUrl] =
    useState("")

  const [result, setResult] =
    useState<UltrasoundResult | null>(null)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")


  // ============================================================
  // LOAD CLINICAL DATA
  // ============================================================

  useEffect(() => {
    const savedData =
      sessionStorage.getItem("clinicalData")

    if (savedData) {
      try {
        setClinicalData(JSON.parse(savedData))
      } catch {
        setError("Unable to read saved clinical data.")
      }
    }
  }, [])


  // ============================================================
  // IMAGE SELECT
  // ============================================================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid ultrasound image.")
      return
    }

    setSelectedFile(file)

    setPreviewUrl(URL.createObjectURL(file))

    setResult(null)
    setError("")
  }


  // ============================================================
  // ANALYZE ULTRASOUND
  // ============================================================

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please upload an ultrasound image first.")
      return
    }

    if (!clinicalData) {
      setError("Clinical data is missing.")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const payload: Record<string, number | null> = {}

      Object.entries(clinicalData).forEach(([key, value]) => {
        payload[key] = value === "" ? null : Number(value)
      })

      const token = sessionStorage.getItem("token")

      if (!token) throw new Error("Please sign in first.")

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

      // 1) Clinical prediction
      const clinicalResponse = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!clinicalResponse.ok) {
        const errorText = await clinicalResponse.text()
        throw new Error(`Clinical model error ${clinicalResponse.status}: ${errorText}`)
      }

      const clinicalResult = await clinicalResponse.json()

      // 2) Ultrasound prediction (file upload)
      const formData = new FormData()
      formData.append("file", selectedFile)

      const ultrasoundResponse = await fetch(
        `${API_BASE}/ultrasound/predict?analysis_id=${clinicalResult.id}`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!ultrasoundResponse.ok) {
        const errorText = await ultrasoundResponse.text()
        throw new Error(`Ultrasound model error ${ultrasoundResponse.status}: ${errorText}`)
      }

      const ultrasoundResult: UltrasoundResult = await ultrasoundResponse.json()

      // persist session results
      sessionStorage.setItem("predictionResult", JSON.stringify(clinicalResult))
      sessionStorage.setItem("ultrasoundResult", JSON.stringify(ultrasoundResult))

      // navigate to results page (current behavior)
      if (clinicalResult.id) {
        router.push(`/results?id=${clinicalResult.id}`)
      } else {
        router.push(`/results`)
      }

    } catch (err) {
      console.error("Ultrasound error:", err)
      setError(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setLoading(false)
    }
  }


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <AppShell title="Ultrasound DL" eyebrow="Imaging">
      <PageTitle
        kicker="Ultrasound"
        title="Upload ultrasound image"
        desc="Run Grad-CAM over an ultrasound frame to visualize model attention."
      />

      <DemoNotice />

      <section className="panel form-panel">
        <label>
          Upload an ultrasound image
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        {previewUrl && (
          <div style={{ marginTop: 12 }}>
            <img src={previewUrl} alt="preview" style={{ maxWidth: 320 }} />
          </div>
        )}

        {error && <p style={{ color: "#9b2c2c" }}>{error}</p>}

        <div className="form-actions">
          <button className="button primary" onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing…" : "Analyze image →"}
          </button>

          <Link href="/clinical" className="button ghost">
            Back to clinical
          </Link>
        </div>
      </section>
    </AppShell>
  )
}
