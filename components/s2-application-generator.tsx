"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Save, User, Stethoscope, Calendar, CheckCircle, Shield } from "lucide-react"
import { PatientForm } from "./forms/patient-form"
import { MedicalForm } from "./forms/medical-form"
import { GPForm } from "./forms/gp-form"
import { TreatmentForm } from "./forms/treatment-form"
import { ApplicantForm } from "./forms/applicant-form"
import { DocumentGenerator } from "./document-generator"
import { usePatientData } from "@/hooks/use-patient-data"
import { useAutoSave } from "@/hooks/use-auto-save"

interface TabConfig {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  required: boolean
}

const tabs: TabConfig[] = [
  {
    id: "patient",
    label: "Patient Details",
    icon: User,
    description: "Personal information and contact details",
    required: true,
  },
  {
    id: "medical",
    label: "Medical Information",
    icon: Stethoscope,
    description: "Clinical data, diagnosis, and treatment history",
    required: true,
  },
  {
    id: "gp",
    label: "GP Information",
    icon: User,
    description: "General practitioner details and consultation",
    required: true,
  },
  {
    id: "treatment",
    label: "Treatment Plan",
    icon: Calendar,
    description: "Surgery details and hospital information",
    required: true,
  },
  {
    id: "applicant",
    label: "Applicant Details",
    icon: Shield,
    description: "S2 application representative information",
    required: false,
  },
  {
    id: "documents",
    label: "Generate Documents",
    icon: FileText,
    description: "Create and download S2 application documents",
    required: false,
  },
]

export function S2ApplicationGenerator() {
  const [activeTab, setActiveTab] = useState("patient")
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set())
  const { patientData, updatePatientData, resetData, isValid } = usePatientData()
  const { saveStatus, lastSaved } = useAutoSave(patientData)

  // Calculate completion progress
  const requiredTabs = tabs.filter((tab) => tab.required)
  const completedRequiredTabs = requiredTabs.filter((tab) => completedTabs.has(tab.id))
  const progress = (completedRequiredTabs.length / requiredTabs.length) * 100

  // Check tab completion
  const checkTabCompletion = useCallback(
    (tabId: string) => {
      switch (tabId) {
        case "patient":
          return !!(
            patientData.firstName &&
            patientData.lastName &&
            patientData.dateOfBirth &&
            patientData.nhsNumber &&
            patientData.address &&
            patientData.postcode
          )
        case "medical":
          return !!(
            patientData.height &&
            patientData.weight &&
            patientData.bmi &&
            patientData.diagnosis &&
            patientData.surgicalProcedure
          )
        case "gp":
          return !!(patientData.gpName && patientData.gpPractice && patientData.gpAddress)
        case "treatment":
          return !!(patientData.treatmentDate && patientData.hospitalName && patientData.surgeonName)
        default:
          return false
      }
    },
    [patientData],
  )

  // Update completed tabs when data changes
  useEffect(() => {
    const newCompletedTabs = new Set<string>()
    tabs.forEach((tab) => {
      if (checkTabCompletion(tab.id)) {
        newCompletedTabs.add(tab.id)
      }
    })
    setCompletedTabs(newCompletedTabs)
  }, [patientData, checkTabCompletion])

  const getTabStatus = (tabId: string) => {
    if (completedTabs.has(tabId)) return "completed"
    if (activeTab === tabId) return "active"
    return "inactive"
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  const handleNextTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id)
    }
  }

  const handlePreviousTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id)
    }
  }

  const currentTab = tabs.find((tab) => tab.id === activeTab)
  const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">S2 Medical Generator</h1>
                  <p className="text-sm text-muted-foreground">NHS Bariatric Surgery Funding Application</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Progress indicator */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">Progress:</div>
                <div className="w-32">
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="text-sm font-medium text-foreground">{Math.round(progress)}%</div>
              </div>

              {/* Save status */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Save className="w-4 h-4" />
                <span>{saveStatus}</span>
                {lastSaved && <span className="text-xs">{new Date(lastSaved).toLocaleTimeString()}</span>}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="medical-card sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Application Steps</CardTitle>
                <CardDescription>Complete all required sections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon
                  const status = getTabStatus(tab.id)

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                        status === "active"
                          ? "bg-primary/10 border border-primary/20 text-primary"
                          : status === "completed"
                            ? "bg-primary/5 text-foreground hover:bg-primary/10"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <div className={`progress-step ${status}`}>
                        {status === "completed" ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{tab.label}</span>
                          {tab.required && (
                            <Badge variant="secondary" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tab.description}</p>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Current Step Header */}
              {currentTab && (
                <Card className="medical-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <currentTab.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{currentTab.label}</CardTitle>
                          <CardDescription className="text-base">{currentTab.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={currentTab.required ? "default" : "secondary"}>
                        {currentTab.required ? "Required" : "Optional"}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              )}

              {/* Form Content */}
              <div className="fade-in">
                {activeTab === "patient" && <PatientForm data={patientData} onUpdate={updatePatientData} />}
                {activeTab === "medical" && <MedicalForm data={patientData} onUpdate={updatePatientData} />}
                {activeTab === "gp" && <GPForm data={patientData} onUpdate={updatePatientData} />}
                {activeTab === "treatment" && <TreatmentForm data={patientData} onUpdate={updatePatientData} />}
                {activeTab === "applicant" && <ApplicantForm data={patientData} onUpdate={updatePatientData} />}
                {activeTab === "documents" && <DocumentGenerator data={patientData} />}
              </div>

              {/* Navigation Footer */}
              <Card className="medical-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePreviousTab}
                      disabled={currentIndex === 0}
                      className="flex items-center space-x-2 bg-transparent"
                    >
                      <span>Previous</span>
                    </Button>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Step {currentIndex + 1} of {tabs.length}
                      </span>
                    </div>

                    <Button
                      onClick={handleNextTab}
                      disabled={currentIndex === tabs.length - 1}
                      className="medical-button-primary flex items-center space-x-2"
                    >
                      <span>Next</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
