"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { PatientData } from "@/hooks/use-patient-data"
import { FileText, Download, Sparkles, Brain, Mail, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface DocumentGeneratorProps {
  data: PatientData
}

export function DocumentGenerator({ data }: DocumentGeneratorProps) {
  const [generatedDocuments, setGeneratedDocuments] = useState<Record<string, string>>({})
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false)
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null)

  const callDocumentAPI = async (messages: any[], maxTokens = 2000, documentType: string) => {
    const response = await fetch("/api/generate-document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        maxTokens,
        documentType,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to generate document")
    }

    const data = await response.json()
    return data.content
  }

  const checkApiKeyConfiguration = async () => {
    try {
      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: "test" }],
          maxTokens: 1,
          documentType: "test",
        }),
      })

      setApiKeyConfigured(response.ok)
      return response.ok
    } catch (error) {
      setApiKeyConfigured(false)
      return false
    }
  }

  const generateStandardDocuments = () => {
    const documents = {
      medicalReport: generateMedicalReport(),
      undueDelayLetter: generateUndueDelayLetter(),
      s2Form: generateS2Form(),
      providerDeclaration: generateProviderDeclaration(),
      emailTemplate: generateEmailTemplate(),
    }

    setGeneratedDocuments(documents)
  }

  const generateAIDocuments = async () => {
    // Check API key configuration if not already checked
    if (apiKeyConfigured === null) {
      const isConfigured = await checkApiKeyConfiguration()
      if (!isConfigured) {
        alert("OpenAI API key not configured. Please set OPENAI_API_KEY in your Vercel environment variables.")
        return
      }
    }

    setIsGeneratingWithAI(true)

    try {
      const documents = {
        medicalReport: await generateAIMedicalReport(),
        undueDelayLetter: await generateAIUndueDelayLetter(),
        s2Form: await generateAIS2Form(),
        providerDeclaration: await generateAIProviderDeclaration(),
        emailTemplate: await generateAIEmailTemplate(),
      }

      setGeneratedDocuments(documents)
    } catch (error) {
      console.error("AI generation error:", error)
      alert(`Error generating AI documents: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsGeneratingWithAI(false)
    }
  }

  const generateAIMedicalReport = async () => {
    const messages = [
      {
        role: "system",
        content:
          "You are a medical professional creating a comprehensive medical report for NHS S2 funding application for bariatric surgery. Use professional medical terminology and provide detailed clinical justification.",
      },
      {
        role: "user",
        content: `Create a detailed medical report for ${data.firstName} ${data.lastName}, DOB: ${data.dateOfBirth}, NHS: ${data.nhsNumber}, BMI: ${data.bmi}, with comorbidities: ${data.comorbidities || "None specified"}. Treatment date: ${data.treatmentDate}.`,
      },
    ]
    return await callDocumentAPI(messages, 2500, "medicalReport")
  }

  const generateAIUndueDelayLetter = async () => {
    const messages = [
      {
        role: "system",
        content:
          "You are a legal medical advisor creating an undue delay letter for NHS S2 funding. Reference EU regulations and patient rights. Be authoritative and legally sound.",
      },
      {
        role: "user",
        content: `Create an undue delay letter for ${data.firstName} ${data.lastName} with BMI ${data.bmi} and comorbidities: ${data.comorbidities || "None"}. Emphasize medical urgency and EU patient rights.`,
      },
    ]
    return await callDocumentAPI(messages, 2000, "undueDelayLetter")
  }

  const generateAIS2Form = async () => {
    const messages = [
      {
        role: "system",
        content:
          "You are completing an official NHS S2 application form. Be precise, factual, and follow NHS formatting requirements.",
      },
      {
        role: "user",
        content: `Complete S2 form for ${data.firstName} ${data.lastName}, NHS: ${data.nhsNumber}, treatment in ${data.treatmentCountry || "Belgium"} on ${data.treatmentDate}.`,
      },
    ]
    return await callDocumentAPI(messages, 1500, "s2Form")
  }

  const generateAIProviderDeclaration = async () => {
    const messages = [
      {
        role: "system",
        content:
          "You are a medical provider creating a professional declaration for bariatric surgery. Include surgeon credentials and hospital accreditation.",
      },
      {
        role: "user",
        content: `Create provider declaration for ${data.firstName} ${data.lastName}'s bariatric surgery with Dr. ${data.surgeonName || "Specialist Surgeon"} at ${data.hospitalName || "Accredited Medical Center"}.`,
      },
    ]
    return await callDocumentAPI(messages, 1200, "providerDeclaration")
  }

  const generateAIEmailTemplate = async () => {
    const messages = [
      {
        role: "system",
        content:
          "You are creating a professional email template for NHS S2 submission. Be formal, respectful, and include all necessary attachments references.",
      },
      {
        role: "user",
        content: `Create submission email for ${data.firstName} ${data.lastName}'s S2 application to NHS funding team.`,
      },
    ]
    return await callDocumentAPI(messages, 800, "emailTemplate")
  }

  const downloadDocument = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateMedicalReport = () => `Medical Report for ${data.firstName} ${data.lastName}...`
  const generateUndueDelayLetter = () => `Undue Delay Letter for ${data.firstName} ${data.lastName}...`
  const generateS2Form = () => `S2 Form for ${data.firstName} ${data.lastName}...`
  const generateProviderDeclaration = () => `Provider Declaration for ${data.firstName} ${data.lastName}...`
  const generateEmailTemplate = () => `Email Template for ${data.firstName} ${data.lastName}...`

  const documents = [
    {
      id: "medicalReport",
      title: "Medical Report",
      description: "Comprehensive clinical assessment and justification",
      icon: FileText,
      required: true,
    },
    {
      id: "undueDelayLetter",
      title: "Undue Delay Letter",
      description: "Legal justification for urgent treatment",
      icon: Shield,
      required: true,
    },
    {
      id: "s2Form",
      title: "S2 Application Form",
      description: "Official NHS S2 funding application",
      icon: FileText,
      required: true,
    },
    {
      id: "providerDeclaration",
      title: "Provider Declaration",
      description: "Hospital and surgeon attestation",
      icon: CheckCircle,
      required: true,
    },
    {
      id: "emailTemplate",
      title: "Submission Email",
      description: "Professional email template for NHS submission",
      icon: Mail,
      required: false,
    },
  ]

  const isDataComplete = !!(
    data.firstName &&
    data.lastName &&
    data.dateOfBirth &&
    data.nhsNumber &&
    data.height &&
    data.weight &&
    data.bmi &&
    data.treatmentDate
  )

  return (
    <div className="space-y-6">
      {!isDataComplete && (
        <Card className="medical-card border-destructive/20 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <CardTitle className="text-destructive">Incomplete Patient Data</CardTitle>
            </div>
            <CardDescription>
              Please complete all required patient information before generating documents.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card className="medical-card border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <CardTitle>AI-Enhanced Document Generation</CardTitle>
          </div>
          <CardDescription>
            Generate intelligent, professionally crafted medical documents with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>OpenAI API Key Status</Label>
              <div
                className={`p-3 rounded-lg border ${
                  apiKeyConfigured === true
                    ? "bg-primary/10 border-primary/20"
                    : apiKeyConfigured === false
                      ? "bg-destructive/10 border-destructive/20"
                      : "bg-muted border-border"
                }`}
              >
                {apiKeyConfigured === true ? (
                  <div className="flex items-center space-x-2 text-primary">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">API Key Configured</span>
                  </div>
                ) : apiKeyConfigured === false ? (
                  <div className="flex items-center space-x-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">API Key Not Configured</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">API Key Status Unknown</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {apiKeyConfigured === true
                  ? "AI enhancement available: Intelligent medical reasoning, enhanced clinical justifications, better legal arguments, and professional NHS-compliant formatting."
                  : "To enable AI features, add OPENAI_API_KEY (without NEXT_PUBLIC prefix) to your Vercel environment variables."}
              </p>
            </div>

            {apiKeyConfigured === true && (
              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="pt-4">
                  <h4 className="font-medium text-accent-foreground mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Enhancement Benefits
                  </h4>
                  <ul className="text-sm text-accent-foreground space-y-1">
                    <li>• Intelligent clinical reasoning based on patient's specific profile</li>
                    <li>• Enhanced medical literature references and evidence</li>
                    <li>• Sophisticated legal arguments with EU case law</li>
                    <li>• Patient-specific risk assessment and urgency justification</li>
                    <li>• Professional medical terminology and NHS-compliant formatting</li>
                    <li>• Stronger undue delay arguments with quantified risks</li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Document Generation</CardTitle>
          <CardDescription>Choose your preferred document generation method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={generateStandardDocuments}
              disabled={!isDataComplete}
              className="medical-button-secondary h-auto p-6 flex flex-col items-center space-y-2"
            >
              <FileText className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Generate Standard Documents</div>
                <div className="text-xs text-muted-foreground">Uses pre-built templates with your data</div>
              </div>
            </Button>

            <Button
              onClick={generateAIDocuments}
              disabled={!isDataComplete || isGeneratingWithAI}
              className="medical-button-primary h-auto p-6 flex flex-col items-center space-y-2"
            >
              {isGeneratingWithAI ? <Loader2 className="w-6 h-6 animate-spin" /> : <Brain className="w-6 h-6" />}
              <div className="text-center">
                <div className="font-medium flex items-center">
                  {isGeneratingWithAI ? "Generating with AI..." : "Generate AI-Enhanced Documents"}
                  <Sparkles className="w-4 h-4 ml-1" />
                </div>
                <div className="text-xs text-primary-foreground/80">
                  {apiKeyConfigured === true
                    ? "Intelligent medical reasoning & enhanced arguments"
                    : "API key configuration will be checked"}
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {Object.keys(generatedDocuments).length > 0 && (
        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Generated Documents</CardTitle>
            <CardDescription>Download your S2 application documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => {
                const Icon = doc.icon
                const hasContent = generatedDocuments[doc.id]

                return (
                  <Card
                    key={doc.id}
                    className={`p-4 ${hasContent ? "border-primary/20 bg-primary/5" : "border-border"}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${hasContent ? "bg-primary/10" : "bg-muted"}`}>
                        <Icon className={`w-4 h-4 ${hasContent ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-sm">{doc.title}</h3>
                          {doc.required && (
                            <Badge variant="secondary" className="text-xs">
                              Required
                            </Badge>
                          )}
                          {apiKeyConfigured && hasContent && (
                            <Badge variant="outline" className="text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{doc.description}</p>
                        <Button
                          size="sm"
                          onClick={() =>
                            downloadDocument(
                              generatedDocuments[doc.id],
                              `${doc.id}_${data.lastName}_${data.firstName}.md`,
                            )
                          }
                          disabled={!hasContent}
                          className="w-full"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
