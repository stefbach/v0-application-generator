"use client"

import { useState } from 'react'
import Link from 'next/link'

const DOCUMENT_TYPES = [
  { key: 'medical_report', label: 'Medical Report', icon: '📋' },
  { key: 'undue_delay_letter', label: 'Undue Delay Letter', icon: '⚕️' },
  { key: 'provider_declaration', label: 'Provider Declaration', icon: '🏥' },
  { key: 's2_application_form', label: 'S2 Application Form', icon: '📄' },
  { key: 'legal_justification_letter', label: 'Legal Justification', icon: '⚖️' }
]

export default function TestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [selectedDocType, setSelectedDocType] = useState('medical_report')

  // Simplified test data - only essential fields to avoid build issues
  const getTestData = () => ({
    fullName: "Karen Griffin",
    dateOfBirth: "14/07/1972",
    age: 53,
    sex: "Female",
    nhsNumber: "6085748752",
    nationalInsurance: "NY513105D",
    address: "51 Bridgeman Rd, Radford, Coventry CV6 1NQ",
    phone: "+44 7760 884352",
    email: "griffin_karen@sky.com",
    height: 157,
    weight: 116,
    bmi: 47.1,
    diagnosis: "Morbid obesity",
    primaryDiagnosis: "Morbid obesity",
    proposedTreatment: "Sleeve gastrectomy",
    surgeryDate: "05/11/2025",
    treatmentCountry: "Switzerland",
    facilityName: "Hôpital de La Tour",
    surgeonName: "Dr Jean-Marie Megevand",
    gpName: "Dr Keane",
    gpPractice: "Engleton House Surgery",
    comorbidities: [
      "Familial hypercholesterolemia",
      "Hypertension",
      "Osteoarthritis and osteoporosis",
      "Depression/PTSD",
      "Ulcerative colitis"
    ],
    medications: [
      "HRT (Estradiol 1mg daily)",
      "Gabapentin 300mg TDS",
      "Sertraline 100mg daily",
      "Amlodipine 10mg daily"
    ]
  })

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: selectedDocType,
          patientData: getTestData(),
          treatmentDate: '2025-11-05',
          maxTokens: 4000
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Generation error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Document Generation API Test</h1>
              <p className="text-gray-600 mt-1">Test the document generation system</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Select Document Type</h3>
              <div className="space-y-2">
                {DOCUMENT_TYPES.map(type => (
                  <button
                    key={type.key}
                    onClick={() => setSelectedDocType(type.key)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      selectedDocType === type.key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{type.icon}</span>
                      <span className="font-medium text-sm">{type.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Document'
                )}
              </button>
            </div>

            {/* Test Data Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Test Data Summary</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-600">Patient:</span> Karen Griffin</div>
                <div><span className="text-gray-600">NHS:</span> 6085748752</div>
                <div><span className="text-gray-600">BMI:</span> 47.1</div>
                <div><span className="text-gray-600">Diagnosis:</span> Morbid obesity</div>
                <div><span className="text-gray-600">Treatment:</span> Sleeve gastrectomy</div>
                <div><span className="text-gray-600">Date:</span> 05/11/2025</div>
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <span className="text-red-600 text-xl mr-3">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-red-900">Error</h3>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!result && !error && !loading && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Generate
                </h3>
                <p className="text-gray-600">
                  Select a document type and click "Generate Document"
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="animate-spin text-6xl mb-4">⏳</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Generating Document...
                </h3>
                <p className="text-gray-600">
                  This may take 30-60 seconds depending on document complexity
                </p>
              </div>
            )}

            {result && !error && (
              <div className="space-y-6">
                {/* Metadata */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Generation Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Model:</span>
                      <div className="font-medium">{result.model}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Tokens Used:</span>
                      <div className="font-medium">
                        {result.usage?.total_tokens?.toLocaleString() || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Cost:</span>
                      <div className="font-medium">${result.cost?.toFixed(4) || '0.0000'}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <div className="font-medium">{result.duration || 'N/A'}s</div>
                    </div>
                  </div>
                </div>

                {/* Generated Content */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Generated Document</h3>
                  <div className="bg-gray-50 rounded border p-6 max-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                      {result.content}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
