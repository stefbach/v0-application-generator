"use client"

import { useState, useCallback } from "react"

export interface PatientData {
  // Personal Information
  firstName: string
  lastName: string
  dateOfBirth: string
  sex: string
  nhsNumber: string
  nationalInsurance: string
  phone: string
  email: string
  address: string
  postcode: string

  // GP Information
  gpName: string
  gpPractice: string
  gpAddress: string
  gpConsultationDate: string

  // Medical Information
  height: string
  weight: string
  bmi: string
  diagnosis: string
  comorbidities: string[]
  medications: string[]
  treatmentHistory: string
  surgicalProcedure: string

  // Treatment Details - PRE-FILLED
  treatmentDate: string
  hospitalName: string
  hospitalAddress: string
  surgeonName: string
  hospitalPhone: string
  hospitalEmail: string
  hospitalDirector: string
  hospitalDirectorTitle: string

  // Application Details - PRE-FILLED
  applicantName: string
  applicantTitle: string
  applicantPhone: string
  applicantEmail: string
  applicantAddress: string
}

const initialData: PatientData = {
  // Personal Information
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  sex: "",
  nhsNumber: "",
  nationalInsurance: "",
  phone: "",
  email: "",
  address: "",
  postcode: "",

  // GP Information
  gpName: "",
  gpPractice: "",
  gpAddress: "",
  gpConsultationDate: "",

  // Medical Information
  height: "",
  weight: "",
  bmi: "",
  diagnosis: "Morbid obesity",
  comorbidities: [],
  medications: [],
  treatmentHistory: "",
  surgicalProcedure: "Sleeve gastrectomy",

  // Treatment Details - PRE-FILLED
  treatmentDate: "",
  hospitalName: "Hôpital de La Tour",
  hospitalAddress: "Avenue J.-D. Maillard 3, 1217 Meyrin, Switzerland",
  surgeonName: "Dr Jean-Marie Mégevand",
  hospitalPhone: "+41 22 719 63 65",
  hospitalEmail: "direction@latour.ch",
  hospitalDirector: "Olivier SCHMITT",
  hospitalDirectorTitle: "Directeur General/CEO",

  // Application Details - PRE-FILLED
  applicantName: "Dr Stéphane Bach",
  applicantTitle: "Doctor",
  applicantPhone: "+447458114333",
  applicantEmail: "sbach@obesity-care-clinic.com",
  applicantAddress:
    "Quad Central Q3, Level 1, Office 5 Triq l-Esportaturi (Zona Industrijali, Mriehel) Mriehel Industrial Zone CBD 1040 Malta",
}

export function usePatientData() {
  const [patientData, setPatientData] = useState<PatientData>(() => {
    // Try to load from localStorage on initialization
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("s2-patient-data")
      if (saved) {
        try {
          return { ...initialData, ...JSON.parse(saved) }
        } catch (error) {
          console.error("Failed to parse saved patient data:", error)
        }
      }
    }
    return initialData
  })

  const updatePatientData = useCallback((field: keyof PatientData, value: any) => {
    setPatientData((prev) => {
      const updated = { ...prev, [field]: value }

      // Auto-calculate BMI when height or weight changes
      if (field === "height" || field === "weight") {
        const height = field === "height" ? Number.parseFloat(value) : Number.parseFloat(prev.height)
        const weight = field === "weight" ? Number.parseFloat(value) : Number.parseFloat(prev.weight)

        if (height && weight && height > 0) {
          const heightM = height / 100
          const bmi = (weight / (heightM * heightM)).toFixed(1)
          updated.bmi = bmi
        }
      }

      return updated
    })
  }, [])

  const updateArrayField = useCallback((field: keyof PatientData, index: number, value: string) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => (i === index ? value : item)),
    }))
  }, [])

  const addArrayItem = useCallback((field: keyof PatientData, value = "") => {
    setPatientData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value],
    }))
  }, [])

  const removeArrayItem = useCallback((field: keyof PatientData, index: number) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }))
  }, [])

  const resetData = useCallback(() => {
    setPatientData(initialData)
    if (typeof window !== "undefined") {
      localStorage.removeItem("s2-patient-data")
    }
  }, [])

  const isValid = useCallback(() => {
    return !!(
      patientData.firstName &&
      patientData.lastName &&
      patientData.dateOfBirth &&
      patientData.nhsNumber &&
      patientData.height &&
      patientData.weight &&
      patientData.bmi
    )
  }, [patientData])

  return {
    patientData,
    updatePatientData,
    updateArrayField,
    addArrayItem,
    removeArrayItem,
    resetData,
    isValid,
  }
}
