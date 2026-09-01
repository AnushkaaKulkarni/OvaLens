"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell, PageTitle, DemoNotice } from "@/components/app-shell"

type PatientForm = {
  Age_yrs: string
  Weight_Kg: string
  HeightCm: string
  BMI: string
  Blood_Group: string
  Pulse_ratebpm: string
  RR_breaths_min: string
  Hbg_dl: string
  CycleR_I: string
  Cycle_lengthdays: string
  Marraige_Status_Yrs: string
  PregnantY_N: string
  No_of_aborptions: string
  I_beta_HCG: string
  II_beta_HCG: string
  FSHmIU_mL: string
  LHmIU_mL: string
  FSH_LH: string
  Hipinch: string
  Waistinch: string
  Waist_Hip_Ratio: string
  TSH_mIU_L: string
  AMHng_mL: string
  PRLng_mL: string
  Vit_D3_ng_mL: string
  PRGng_mL: string
  RBSmg_dl: string
  Weight_gainY_N: string
  hair_growthY_N: string
  Skin_darkening_Y_N: string
  Hair_lossY_N: string
  PimplesY_N: string
  Fast_foodY_N: string
  Reg_ExerciseY_N: string
  BP_Systolic_mmHg: string
  BP_Diastolic_mmHg: string
  Follicle_No_L: string
  Follicle_No_R: string
  Avg_F_size_L_mm: string
  Avg_F_size_R_mm: string
  Endometrium_mm: string
}

const initialFormData: PatientForm = {
  Age_yrs: "",
  Weight_Kg: "",
  HeightCm: "",
  BMI: "",
  Blood_Group: "",
  Pulse_ratebpm: "",
  RR_breaths_min: "",
  Hbg_dl: "",
  CycleR_I: "",
  Cycle_lengthdays: "",
  Marraige_Status_Yrs: "",
  PregnantY_N: "",
  No_of_aborptions: "",
  I_beta_HCG: "",
  II_beta_HCG: "",
  FSHmIU_mL: "",
  LHmIU_mL: "",
  FSH_LH: "",
  Hipinch: "",
  Waistinch: "",
  Waist_Hip_Ratio: "",
  TSH_mIU_L: "",
  AMHng_mL: "",
  PRLng_mL: "",
  Vit_D3_ng_mL: "",
  PRGng_mL: "",
  RBSmg_dl: "",
  Weight_gainY_N: "",
  hair_growthY_N: "",
  Skin_darkening_Y_N: "",
  Hair_lossY_N: "",
  PimplesY_N: "",
  Fast_foodY_N: "",
  Reg_ExerciseY_N: "",
  BP_Systolic_mmHg: "",
  BP_Diastolic_mmHg: "",
  Follicle_No_L: "",
  Follicle_No_R: "",
  Avg_F_size_L_mm: "",
  Avg_F_size_R_mm: "",
  Endometrium_mm: "",
}

export default function Clinical() {
  const router = useRouter()
  const [formData, setFormData] =
    useState<PatientForm>(initialFormData)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleContinue = () => {
    sessionStorage.setItem(
      "clinicalData",
      JSON.stringify(formData)
    )

    router.push("/ultrasound")
  }

  return (
    <AppShell title="Clinical Data" eyebrow="New analysis">

      <PageTitle
        kicker="Step 1 of 3"
        title="Add clinical features."
        desc="Enter the available patient-level information for this analysis."
      />

      <DemoNotice />

      <section className="panel form-panel">

        <h2>Clinical Profile</h2>

        <p className="muted">
          Enter the available patient information.
          All fields are optional for this research prototype.
        </p>


        {/* ================================================= */}
        {/* 1. BASIC INFORMATION */}
        {/* ================================================= */}

        <h3 className="form-section-title">
          1. Basic Information
        </h3>

        <div className="form-grid">

          <label>
            Age (years)
            <input
              type="number"
              name="Age_yrs"
              value={formData.Age_yrs}
              onChange={handleChange}
              placeholder="e.g. 25"
            />
          </label>

          <label>
            Weight (Kg)
            <input
              type="number"
              name="Weight_Kg"
              value={formData.Weight_Kg}
              onChange={handleChange}
              placeholder="e.g. 52"
            />
          </label>

          <label>
            Height (cm)
            <input
              type="number"
              name="HeightCm"
              value={formData.HeightCm}
              onChange={handleChange}
              placeholder="e.g. 161"
            />
          </label>

          <label>
            BMI
            <input
              type="number"
              step="0.01"
              name="BMI"
              value={formData.BMI}
              onChange={handleChange}
              placeholder="e.g. 20.06"
            />
          </label>

          <label>
            Blood Group
            <input
              type="number"
              name="Blood_Group"
              value={formData.Blood_Group}
              onChange={handleChange}
              placeholder="e.g. 11"
            />
          </label>

        </div>


        {/* ================================================= */}
        {/* 2. VITAL PARAMETERS */}
        {/* ================================================= */}

        <h3 className="form-section-title">
          2. Vital Parameters
        </h3>

        <div className="form-grid">

          <label>
            Pulse Rate (bpm)
            <input
              type="number"
              name="Pulse_ratebpm"
              value={formData.Pulse_ratebpm}
              onChange={handleChange}
              placeholder="e.g. 72"
            />
          </label>

          <label>
            Respiratory Rate (breaths/min)
            <input
              type="number"
              name="RR_breaths_min"
              value={formData.RR_breaths_min}
              onChange={handleChange}
              placeholder="e.g. 18"
            />
          </label>

          <label>
            Hb (g/dl)
            <input
              type="number"
              step="0.1"
              name="Hbg_dl"
              value={formData.Hbg_dl}
              onChange={handleChange}
              placeholder="e.g. 12"
            />
          </label>

          <label>
            Systolic BP (mmHg)
            <input
              type="number"
              name="BP_Systolic_mmHg"
              value={formData.BP_Systolic_mmHg}
              onChange={handleChange}
              placeholder="e.g. 110"
            />
          </label>

          <label>
            Diastolic BP (mmHg)
            <input
              type="number"
              name="BP_Diastolic_mmHg"
              value={formData.BP_Diastolic_mmHg}
              onChange={handleChange}
              placeholder="e.g. 70"
            />
          </label>

          <label>
            RBS (mg/dl)
            <input
              type="number"
              name="RBSmg_dl"
              value={formData.RBSmg_dl}
              onChange={handleChange}
              placeholder="e.g. 90"
            />
          </label>

        </div>


        {/* ================================================= */}
        {/* 3. MENSTRUAL & REPRODUCTIVE */}
        {/* ================================================= */}

        <h3 className="form-section-title">
          3. Menstrual & Reproductive Profile
        </h3>

        <div className="form-grid">

          <label>
            Cycle Regularity
            <select
              name="CycleR_I"
              value={formData.CycleR_I}
              onChange={handleChange}
            >
              <option value="">
                Select an option
              </option>
              <option value="1">
                Regular
              </option>
              <option value="2">
                Irregular
              </option>
            </select>
          </label>

          <label>
            Cycle Length (days)
            <input
              type="number"
              name="Cycle_lengthdays"
              value={formData.Cycle_lengthdays}
              onChange={handleChange}
              placeholder="e.g. 5"
            />
          </label>

          <label>
            Marriage Status (years)
            <input
              type="number"
              name="Marraige_Status_Yrs"
              value={formData.Marraige_Status_Yrs}
              onChange={handleChange}
              placeholder="e.g. 0"
            />
          </label>

          <label>
            Pregnant
            <select
              name="PregnantY_N"
              value={formData.PregnantY_N}
              onChange={handleChange}
            >
              <option value="">
                Select an option
              </option>
              <option value="1">
                Yes
              </option>
              <option value="0">
                No
              </option>
            </select>
          </label>

          <label>
            Number of Abortions
            <input
              type="number"
              name="No_of_aborptions"
              value={formData.No_of_aborptions}
              onChange={handleChange}
              placeholder="e.g. 0"
            />
          </label>

          <label>
            I β-HCG (mIU/mL)
            <input
              type="number"
              step="0.01"
              name="I_beta_HCG"
              value={formData.I_beta_HCG}
              onChange={handleChange}
              placeholder="Enter value"
            />
          </label>

          <label>
            II β-HCG (mIU/mL)
            <input
              type="number"
              step="0.01"
              name="II_beta_HCG"
              value={formData.II_beta_HCG}
              onChange={handleChange}
              placeholder="Enter value"
            />
          </label>

        </div>


        {/* ================================================= */}
        {/* 4. HORMONAL PROFILE */}
        {/* ================================================= */}

        <h3 className="form-section-title">
          4. Hormonal Profile
        </h3>

        <div className="form-grid">

          <label>
            FSH (mIU/mL)
            <input
              type="number"
              step="0.01"
              name="FSHmIU_mL"
              value={formData.FSHmIU_mL}
              onChange={handleChange}
              placeholder="e.g. 5"
            />
          </label>

          <label>
            LH (mIU/mL)
            <input
              type="number"
              step="0.01"
              name="LHmIU_mL"
              value={formData.LHmIU_mL}
              onChange={handleChange}
              placeholder="e.g. 4"
            />
          </label>

          <label>
            FSH / LH
            <input
              type="number"
              step="0.01"
              name="FSH_LH"
              value={formData.FSH_LH}
              onChange={handleChange}
              placeholder="e.g. 1.25"
            />
          </label>

          <label>
            TSH (mIU/L)
            <input
              type="number"
              step="0.01"
              name="TSH_mIU_L"
              value={formData.TSH_mIU_L}
              onChange={handleChange}
              placeholder="Enter value"
            />
          </label>

          <label>
            AMH (ng/mL)
            <input
              type="number"
              step="0.01"
              name="AMHng_mL"
              value={formData.AMHng_mL}
              onChange={handleChange}
              placeholder="e.g. 5"
            />
          </label>

          <label>
            PRL (ng/mL)
            <input
              type="number"
              step="0.01"
              name="PRLng_mL"
              value={formData.PRLng_mL}
              onChange={handleChange}
              placeholder="Enter value"
            />
          </label>

          <label>
            Vitamin D3 (ng/mL)
            <input
              type="number"
              step="0.01"
              name="Vit_D3_ng_mL"
              value={formData.Vit_D3_ng_mL}
              onChange={handleChange}
              placeholder="Enter value"
            />
          </label>

          <label>
            PRG (ng/mL)
            <input
              type="number"
              step="0.01"
              name="PRGng_mL"
              value={formData.PRGng_mL}
              onChange={handleChange}
              placeholder="Enter value"
            />
          </label>

        </div>


        {/* ================================================= */}
        {/* 5. BODY & SYMPTOMS */}
        {/* ================================================= */}

        <h3 className="form-section-title">
          5. Body Measurements & Symptoms
        </h3>

        <div className="form-grid">

          <label>
            Hip (inch)
            <input
              type="number"
              step="0.1"
              name="Hipinch"
              value={formData.Hipinch}
              onChange={handleChange}
              placeholder="e.g. 36"
            />
          </label>

          <label>
            Waist (inch)
            <input
              type="number"
              step="0.1"
              name="Waistinch"
              value={formData.Waistinch}
              onChange={handleChange}
              placeholder="e.g. 30"
            />
          </label>

          <label>
            Waist : Hip Ratio
            <input
              type="number"
              step="0.01"
              name="Waist_Hip_Ratio"
              value={formData.Waist_Hip_Ratio}
              onChange={handleChange}
              placeholder="e.g. 0.83"
            />
          </label>

          <label>
            Weight Gain
            <select
              name="Weight_gainY_N"
              value={formData.Weight_gainY_N}
              onChange={handleChange}
            >
              <option value="">
                Select an option
              </option>
              <option value="1">
                Yes
              </option>
              <option value="0">
                No
              </option>
            </select>
          </label>

          <label>
            Hair Growth
            <select
              name="hair_growthY_N"
              value={formData.hair_growthY_N}
              onChange={handleChange}
            >
              <option value="">
                Select an option
              </option>
              <option value="1">
                Yes
              </option>
              <option value="0">
                No
              </option>
            </select>
          </label>

          <label>
            Skin Darkening
            <select
              name="Skin_darkening_Y_N"
              value={formData.Skin_darkening_Y_N}
              onChange={handleChange}
            >
              <option value="">
                Select an option
              </option>
              <option value="1">
                Yes
              </option>
              <option value="0">
                No
              </option>
            </select>
          </label>

          <label>
            Hair Loss
            <select
              name="Hair_lossY_N"
              value={formData.Hair_lossY_N}
              onChange={handleChange}
            >
              <option value="">
                Select an option
              </option>
              <option value="1">
                Yes
              </option>
              <option value="0">
                No
              </option>
            </select>
          </label>

          <label>
            Pimples
            <select
              name="PimplesY_N"
              value={formData.PimplesY_N}
              onChange={handleChange}
            >
              <option value="">
                Select an option
              </option>
              <option value="1">
                Yes
              </option>
              <option value="0">
                No
              </option>
            </select>
          </label>

        </div>


        {/* ================================================= */}
        {/* 6. LIFESTYLE */}
        {/* ================================================= */}

        <h3 className="form-section-title">
          6. Lifestyle
        </h3>

        <div className="form-grid">

          <label>
            Fast Food
            <select
              name="Fast_foodY_N"
              value={formData.Fast_foodY_N}
              onChange={handleChange}
            >
              <option value="">
                Select an option
              </option>
              <option value="1">
                Yes
              </option>
              <option value="0">
                No
              </option>
            </select>
          </label>

          <label>
            Regular Exercise
            <select
              name="Reg_ExerciseY_N"
              value={formData.Reg_ExerciseY_N}
              onChange={handleChange}
            >
              <option value="">
                Select an option
              </option>
              <option value="1">
                Yes
              </option>
              <option value="0">
                No
              </option>
            </select>
          </label>

        </div>


        {/* ================================================= */}
        {/* 7. ULTRASOUND MEASUREMENTS */}
        {/* ================================================= */}

        <h3 className="form-section-title">
          7. Ultrasound Measurements
        </h3>

        <div className="form-grid">

          <label>
            Follicle Number — Left
            <input
              type="number"
              name="Follicle_No_L"
              value={formData.Follicle_No_L}
              onChange={handleChange}
              placeholder="e.g. 3"
            />
          </label>

          <label>
            Follicle Number — Right
            <input
              type="number"
              name="Follicle_No_R"
              value={formData.Follicle_No_R}
              onChange={handleChange}
              placeholder="e.g. 3"
            />
          </label>

          <label>
            Average Follicle Size — Left (mm)
            <input
              type="number"
              step="0.1"
              name="Avg_F_size_L_mm"
              value={formData.Avg_F_size_L_mm}
              onChange={handleChange}
              placeholder="e.g. 16"
            />
          </label>

          <label>
            Average Follicle Size — Right (mm)
            <input
              type="number"
              step="0.1"
              name="Avg_F_size_R_mm"
              value={formData.Avg_F_size_R_mm}
              onChange={handleChange}
              placeholder="e.g. 16"
            />
          </label>

          <label>
            Endometrium (mm)
            <input
              type="number"
              step="0.1"
              name="Endometrium_mm"
              value={formData.Endometrium_mm}
              onChange={handleChange}
              placeholder="e.g. 8"
            />
          </label>

        </div>


        {/* ================================================= */}
        {/* ACTIONS */}
        {/* ================================================= */}

        <div className="form-actions">

          <Link
            className="button ghost"
            href="/dashboard"
          >
            Save draft
          </Link>

          <button
            type="button"
            className="button primary"
            onClick={handleContinue}
          >
            Continue to ultrasound →
          </button>

        </div>

      </section>

    </AppShell>
  )
}