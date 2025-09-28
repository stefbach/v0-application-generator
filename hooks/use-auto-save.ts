"use client"

import { useEffect, useState } from "react"
import type { PatientData } from "./use-patient-data"

export function useAutoSave(data: PatientData) {
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSaveStatus("saving")

      try {
        localStorage.setItem("s2-patient-data", JSON.stringify(data))
        setSaveStatus("saved")
        setLastSaved(new Date())
      } catch (error) {
        console.error("Failed to save data:", error)
        setSaveStatus("error")
      }
    }, 1000) // Auto-save after 1 second of inactivity

    return () => clearTimeout(timeoutId)
  }, [data])

  return {
    saveStatus: saveStatus === "saving" ? "Saving..." : saveStatus === "error" ? "Save failed" : "All changes saved",
    lastSaved,
  }
}
