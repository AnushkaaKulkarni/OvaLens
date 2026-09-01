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
        setError(
          "Unable to read saved clinical data."
        )
      }
    }
  }, [])


  // ============================================================
  // IMAGE SELECT
  // ============================================================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid ultrasound image."
      )
      return
    }

    setSelectedFile(file)

    setPreviewUrl(
      URL.createObjectURL(file)
    )

    setResult(null)
    setError("")
  }


  // ============================================================
  // ANALYZE ULTRASOUND
  // ============================================================

  const handleAnalyze = async () => {
  if (!selectedFile) {
    setError(
      "Please upload an ultrasound image first."
    )
    return
  }

  if (!clinicalData) {
    setError(
      "Clinical data is missing."
    )
    return
  }

  setLoading(true)
  setError("")
  setResult(null)

  try {

    // ========================================================
    // 1. CLINICAL ML PREDICTION
    // ========================================================

    const payload: Record<string, number | null> = {}

    Object.entries(clinicalData).forEach(
      ([key, value]) => {
        payload[key] =
          value === ""
            ? null
            : Number(value)
      }
    )

    console.log(
      "Sending clinical data:",
      payload
    )

    const clinicalResponse =
      await fetch(
        "http://localhost:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          body:
            JSON.stringify(payload),
        }
      )

    if (!clinicalResponse.ok) {
      const errorText =
        await clinicalResponse.text()

      throw new Error(
        `Clinical model error ${clinicalResponse.status}: ${errorText}`
      )
    }

    const clinicalResult =
      await clinicalResponse.json()

    console.log(
      "Clinical model response:",
      clinicalResult
    )


    // ========================================================
    // 2. ULTRASOUND DL PREDICTION
    // ========================================================

    const formData =
      new FormData()

    formData.append(
      "file",
      selectedFile
    )

    console.log(
      "Sending ultrasound image:",
      selectedFile.name
    )

    const ultrasoundResponse =
  await fetch(
    `http://localhost:8000/ultrasound/predict?analysis_id=${clinicalResult.id}`,
    {
      method: "POST",
      body: formData,
    }
  )

    if (!ultrasoundResponse.ok) {
      const errorText =
        await ultrasoundResponse.text()

      throw new Error(
        `Ultrasound model error ${ultrasoundResponse.status}: ${errorText}`
      )
    }

    const ultrasoundResult:
      UltrasoundResult =
      await ultrasoundResponse.json()

    console.log(
      "Ultrasound model response:",
      ultrasoundResult
    )


    // ========================================================
    // 3. SAVE CLINICAL RESULT
    // ========================================================

    sessionStorage.setItem(
      "predictionResult",
      JSON.stringify(
        clinicalResult
      )
    )


    // ========================================================
    // 4. SAVE ULTRASOUND RESULT
    // ========================================================

    sessionStorage.setItem(
      "ultrasoundResult",
      JSON.stringify(
        ultrasoundResult
      )
    )


    // ========================================================
    // 5. GO TO RESULTS PAGE
    // ========================================================

    if (clinicalResult.id) {

      router.push(
        `/results?id=${clinicalResult.id}`
      )

    } else {

      router.push(
        "/results"
      )

    }

  } catch (err) {

    console.error(
      "Analysis failed:",
      err
    )

    setError(
      err instanceof Error
        ? err.message
        : "Unable to complete the analysis."
    )

  } finally {

    setLoading(false)

  }
  }


  // ============================================================
  // NO CLINICAL DATA
  // ============================================================

  if (!clinicalData) {
    return (
      <AppShell
        title="Review Data"
        eyebrow="New analysis"
      >

        <PageTitle
          kicker="Step 2 of 3"
          title="No clinical data found."
          desc="Please complete the clinical assessment first."
        />

        <section className="panel form-panel">

          <p className="muted">
            We couldn't find the clinical
            information for this analysis.
          </p>

          <div className="form-actions">

            <Link
              className="button primary"
              href="/clinical"
            >
              Go to Clinical Data
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
      title="Review Data"
      eyebrow="New analysis"
    >

      <PageTitle
        kicker="Step 2 of 3"
        title="Review your clinical data."
        desc="Check the information and ultrasound image before running the PCOS analysis."
      />

      <DemoNotice />


      <section className="panel form-panel">

        <h2>
          Ultrasound & Clinical Review
        </h2>

        <p className="muted">
          These values were carried forward from
          the clinical assessment.
        </p>


        {/* ================================================= */}
        {/* ULTRASOUND IMAGE */}
        {/* ================================================= */}

        <h3 className="form-section-title">
          Ultrasound Image
        </h3>

        <div
          style={{
            border: "1px dashed #c9c2cc",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />


          {previewUrl && (
            <div
              style={{
                marginTop: "20px",
              }}
            >

              <img
                src={previewUrl}
                alt="Ultrasound preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "350px",
                  borderRadius: "10px",
                  objectFit: "contain",
                }}
              />

              <p className="muted">
                {selectedFile?.name}
              </p>

            </div>
          )}

        </div>


        {/* ================================================= */}
        {/* ULTRASOUND MEASUREMENTS */}
        {/* ================================================= */}

        <h3 className="form-section-title">
          Ultrasound Measurements
        </h3>

        <div className="form-grid">

          <label>
            Follicle Number — Left

            <input
              value={
                clinicalData.Follicle_No_L ?? ""
              }
              readOnly
            />
          </label>


          <label>
            Follicle Number — Right

            <input
              value={
                clinicalData.Follicle_No_R ?? ""
              }
              readOnly
            />
          </label>


          <label>
            Average Follicle Size — Left (mm)

            <input
              value={
                clinicalData.Avg_F_size_L_mm ?? ""
              }
              readOnly
            />
          </label>


          <label>
            Average Follicle Size — Right (mm)

            <input
              value={
                clinicalData.Avg_F_size_R_mm ?? ""
              }
              readOnly
            />
          </label>


          <label>
            Endometrium (mm)

            <input
              value={
                clinicalData.Endometrium_mm ?? ""
              }
              readOnly
            />
          </label>

        </div>


        {/* ================================================= */}
        {/* PATIENT SUMMARY */}
        {/* ================================================= */}

        <h3 className="form-section-title">
          Patient Summary
        </h3>

        <div className="form-grid">

          <label>
            Age

            <input
              value={
                clinicalData.Age_yrs ?? ""
              }
              readOnly
            />
          </label>


          <label>
            BMI

            <input
              value={
                clinicalData.BMI ?? ""
              }
              readOnly
            />
          </label>


          <label>
            Cycle Length (days)

            <input
              value={
                clinicalData.Cycle_lengthdays ?? ""
              }
              readOnly
            />
          </label>


          <label>
            AMH (ng/mL)

            <input
              value={
                clinicalData.AMHng_mL ?? ""
              }
              readOnly
            />
          </label>


          <label>
            LH (mIU/mL)

            <input
              value={
                clinicalData.LHmIU_mL ?? ""
              }
              readOnly
            />
          </label>


          <label>
            FSH (mIU/mL)

            <input
              value={
                clinicalData.FSHmIU_mL ?? ""
              }
              readOnly
            />
          </label>

        </div>


        {/* ================================================= */}
        {/* RESULT */}
        {/* ================================================= */}

        {result && (
          <div
            className="panel"
            style={{
              marginTop: "24px",
            }}
          >

            <div className="kicker">
              Ultrasound Analysis
            </div>

            <h2>
              {result.result}
            </h2>

            <p className="muted">
              PCOS probability:{" "}
              <strong>
                {result.pcos_probability}%
              </strong>
            </p>

            <p className="muted">
              Non-PCOS probability:{" "}
              <strong>
                {result.non_pcos_probability}%
              </strong>
            </p>


            {/* GRAD-CAM */}

            <h3
              style={{
                marginTop: "24px",
              }}
            >
              Grad-CAM Explanation
            </h3>

            <p className="muted">
              Regions highlighted by the model
              during prediction.
            </p>

            <img
              src={`data:image/png;base64,${result.gradcam}`}
              alt="Grad-CAM visualization"
              style={{
                width: "100%",
                maxWidth: "500px",
                borderRadius: "10px",
                marginTop: "12px",
              }}
            />

          </div>
        )}


        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px 16px",
              borderRadius: "8px",
              border: "1px solid #e5bcbc",
              background: "#fff5f5",
              color: "#9b2c2c",
            }}
          >

            <strong>
              Analysis failed
            </strong>

            <p
              style={{
                margin: "6px 0 0",
              }}
            >
              {error}
            </p>

          </div>
        )}


        {/* ================================================= */}
        {/* ACTIONS */}
        {/* ================================================= */}

        <div className="form-actions">

          <Link
            className="button ghost"
            href="/clinical"
          >
            ← Edit Clinical Data
          </Link>


          <button
            type="button"
            className="button primary"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading
              ? "Analyzing Ultrasound..."
              : "Analyze Ultrasound →"}
          </button>

        </div>

      </section>

    </AppShell>
  )
}