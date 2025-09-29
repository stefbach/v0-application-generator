"use client"

import { useState } from 'react'
import Link from 'next/link'

const DOCUMENT_TYPES = [
  { key: 'medical_report', label: 'Rapport Médical S2', icon: '📋' },
  { key: 'undue_delay_letter', label: 'Lettre Undue Delay', icon: '⚕️' },
  { key: 'provider_declaration', label: 'Déclaration Provider', icon: '🏥' },
  { key: 's2_application_form', label: 'Formulaire S2', icon: '📄' },
  { key: 'legal_justification_letter', label: 'Justification Juridique', icon: '⚖️' }
]

export default function TestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [selectedDocType, setSelectedDocType] = useState('medical_report')
  const [maxTokens, setMaxTokens] = useState(2000)

  // Complete patient data based on real S2 documents
  const testData = {
    // Personal Information
    fullName: "Karen Griffin",
    firstName: "Karen",
    lastName: "Griffin",
    dateOfBirth: "14/07/1972",
    age: 53,
    sex: "Female",
    nhsNumber: "6085748752",
    nationalInsurance: "NY513105D",
    
    // Contact Information
    address: "51 Bridgeman Rd, Radford, Coventry CV6 1NQ",
    postcode: "CV6 1NQ",
    city: "Coventry",
    phone: "+44 7760 884352",
    email: "griffin_karen@sky.com",
    
    // GP Information
    gpName: "Dr Keane",
    gpPractice: "Engleton House Surgery",
    gpAddress: "2 Villa Road, Radford, Coventry",
    gpConsultationDate: "21/01/2025",
    
    // Clinical Measurements
    height: 157, // cm
    weight: 116, // kg (115.8 kg recent)
    bmi: 47.1,
    bmiHistory: [
      { date: "2023-01", bmi: 45.2 },
      { date: "2024-01", bmi: 46.5 },
      { date: "2025-01", bmi: 47.1 }
    ],
    
    // Diagnosis
    primaryDiagnosis: "Morbid obesity",
    icd10Code: "E66.01",
    
    // Comprehensive Comorbidities
    comorbidities: [
      {
        condition: "Familial hypercholesterolemia",
        severity: "Severe",
        impact: "Increased cardiovascular risk"
      },
      {
        condition: "Hypertension",
        severity: "Controlled with medication",
        impact: "Requires daily antihypertensive therapy"
      },
      {
        condition: "Osteoarthritis and osteoporosis",
        severity: "Moderate to severe",
        impact: "Chronic pain, reduced mobility, joint degeneration"
      },
      {
        condition: "Depression / PTSD",
        severity: "Moderate",
        impact: "Requires psychiatric medication, affects quality of life"
      },
      {
        condition: "Ulcerative colitis",
        severity: "Intermittent flares",
        impact: "Gastrointestinal complications"
      },
      {
        condition: "Coeliac disease",
        severity: "Diagnosed",
        impact: "Dietary restrictions, malabsorption risk"
      },
      {
        condition: "Fibromyalgia",
        severity: "Chronic",
        impact: "Widespread pain, fatigue"
      },
      {
        condition: "Glaucoma",
        severity: "Early stage",
        impact: "Vision preservation required"
      },
      {
        condition: "Optic neuritis",
        severity: "History of",
        impact: "Visual disturbances"
      }
    ],
    
    // Current Medications with full details
    medications: [
      {
        name: "Estradiol (HRT)",
        dose: "1 mg",
        frequency: "Once daily",
        indication: "Postmenopausal symptoms management"
      },
      {
        name: "Gabapentin",
        dose: "300 mg",
        frequency: "Three times daily (TDS)",
        indication: "Neuropathic pain, fibromyalgia"
      },
      {
        name: "Zapain (Codeine/Paracetamol)",
        dose: "30/500 mg",
        frequency: "Up to 4 times daily PRN",
        indication: "Chronic pain management"
      },
      {
        name: "Sertraline",
        dose: "100 mg",
        frequency: "Once daily",
        indication: "Depression, PTSD"
      },
      {
        name: "Mirabegron",
        dose: "50 mg",
        frequency: "Once daily",
        indication: "Overactive bladder"
      },
      {
        name: "Amlodipine",
        dose: "10 mg",
        frequency: "Once daily",
        indication: "Hypertension control"
      },
      {
        name: "Fexofenadine",
        dose: "180 mg",
        frequency: "Once daily",
        indication: "Allergic rhinitis"
      },
      {
        name: "Atorvastatin",
        dose: "20 mg",
        frequency: "Once daily",
        indication: "Familial hypercholesterolemia"
      },
      {
        name: "Ibandronic acid",
        dose: "150 mg",
        frequency: "Once monthly",
        indication: "Osteoporosis prevention and treatment"
      }
    ],
    
    // Non-surgical Management History
    weightManagementHistory: {
      tier3Program: true,
      tier3Duration: "12 months",
      tier3Outcome: "Failure of conservative care - modest unsustained weight loss",
      dietaryAttempts: [
        "Multiple structured diet programs",
        "Specialized weight management clinic follow-up",
        "Nutritionist consultations"
      ],
      dietaryPattern: "High-carbohydrate diet, large portions, binge eating episodes",
      physicalActivity: "Severely limited by fatigue and joint pain",
      pharmacologicalAttempts: [
        "Previous weight loss medications (details in medical history)"
      ],
      psychologicalSupport: "Ongoing psychiatric care for depression/PTSD"
    },
    
    // NICE Eligibility
    niceEligibility: {
      bmiCriteria: true, // BMI ≥ 40
      bmiValue: 47.1,
      severeComorbidities: true,
      comorbiditiesList: [
        "Hypertension",
        "Dyslipidemia (familial hypercholesterolemia)",
        "Osteoarthritis",
        "Osteoporosis",
        "Ulcerative colitis",
        "Depression/PTSD"
      ],
      tier3Completion: true,
      patientMotivation: "Strong, explicit request for bariatric surgery",
      psychologicalReadiness: "Assessed and confirmed",
      understandsRisks: true,
      commitmentToFollowUp: true
    },
    
    // Proposed Treatment
    proposedTreatment: "Sleeve gastrectomy (laparoscopic)",
    procedureType: "Bariatric surgery",
    surgicalApproach: "Laparoscopic sleeve gastrectomy",
    expectedBenefits: [
      "60-70% excess weight loss within 12-18 months",
      "Significant improvement of comorbidities (HTN, dyslipidemia, OSA)",
      "Improved mobility and joint pain reduction",
      "Enhanced quality of life",
      "Reduced cardiovascular risk",
      "Improved psychiatric outcomes"
    ],
    risksIfDelayed: [
      "Increased cardiovascular risk (hypertension, dyslipidemia)",
      "Progression of osteoarthritis and osteoporosis",
      "Aggravation of psychiatric disorders (PTSD, depression)",
      "Gastrointestinal complications (ulcerative colitis, malabsorption)",
      "Further weight gain and metabolic deterioration",
      "Increased surgical risks with age and comorbidity progression"
    ],
    
    // Treatment Facility
    treatmentCountry: "Switzerland",
    facilityName: "Hôpital de La Tour",
    facilityAddress: "Avenue J.-D. Maillard 3, 1217 Meyrin, Geneva, Switzerland",
    facilityType: "Public (State Funded) Healthcare Provider",
    facilityPhone: "+41 22 719 63 65",
    facilityEmail: "direction@latour.ch",
    facilityAccreditation: "Fully accredited, compliant with European bariatric standards",
    
    // Treating Surgeon
    surgeonName: "Dr Jean-Marie Megevand",
    surgeonTitle: "Consultant Bariatric Surgeon",
    surgeonQualifications: "Board-certified bariatric surgeon with extensive European experience",
    surgeonAccreditation: "IFSO (International Federation for Surgery of Obesity) certified",
    
    // Administrative Contact
    administrativeContact: "Olivier SCHMITT",
    administrativeTitle: "Directeur General/CEO",
    
    // Treatment Schedule
    preoperativeConsultation: "24/10/2025",
    surgeryDate: "05/11/2025",
    expectedTravelDates: {
      departure: "04/11/2025",
      return: "08/11/2025"
    },
    followUpSchedule: [
      { timepoint: "1 month", date: "05/12/2025", format: "In-person or teleconsultation" },
      { timepoint: "6 months", date: "05/05/2026", format: "Teleconsultation" },
      { timepoint: "1 year", date: "05/11/2026", format: "Comprehensive review" },
      { timepoint: "2 years", date: "05/11/2027", format: "Annual follow-up" }
    ],
    followUpContent: [
      "Comprehensive clinical review",
      "Nutritional and vitamin assessment",
      "Monitoring of comorbidities",
      "Psychological support and physical activity guidance",
      "Secure teleconsultations (HIPAA/GDPR compliant)",
      "Shared care with GP (Engleton House Surgery, UK)"
    ],
    
    // S2 Application Details
    applicantName: "Dr Stéphane Bach",
    applicantTitle: "Doctor",
    applicantRelationship: "Authorised Representative for S2 Application",
    applicantEmail: "sbach@obesity-care-clinic.com",
    applicantPhone: "+447458114333",
    applicantAddress: "Quad Central Q3, Level 1, Office 5 Triq l-Esportaturi, Mriehel Industrial Zone CBD 1040 Malta",
    
    // Medical Justification Data
    nhsDelays: {
      bariatricSurgeryWaitTime: "18-34 months depending on region",
      currentWaitingList: ">8,000 patients (Royal College of Surgeons 2024)",
      targetCompliance: "No trust meets 18-week target",
      regionalVariation: "Significant disparities across England",
      tier3Delays: "Often exceeding 20 months for pre-operative programs"
    },
    
    // Scientific Evidence for Undue Delay
    scientificEvidence: [
      {
        study: "Arterburn et al. JAMA 2015",
        finding: "55% reduction in all-cause mortality",
        relevance: "Demonstrates life-saving benefit of timely surgery"
      },
      {
        study: "Sjöström et al. NEJM 2007",
        finding: "29% mortality reduction in SOS study",
        relevance: "Long-term survival benefit"
      },
      {
        study: "Sjöström et al. NEJM 2012",
        finding: "78% reduction in new-onset diabetes",
        relevance: "Metabolic benefit of early intervention"
      },
      {
        study: "Welbourn et al. Lancet 2014",
        finding: "UK registry confirms reduced mortality",
        relevance: "Real-world evidence in UK population"
      },
      {
        study: "Mitchell et al. Obesity Reviews 2013",
        finding: "Delays >12 months worsen psychiatric outcomes",
        relevance: "Mental health deterioration with waiting"
      },
      {
        study: "Christou et al. Ann Surg 2004",
        finding: ">50% reduction in morbidity/mortality",
        relevance: "Overall health benefit quantification"
      }
    ],
    
    // Risk Quantification
    quantifiedRisks: {
      annualMortality: {
        withSurgery: "~0.3% perioperative, then -29% long-term reduction",
        withoutSurgery: "3-4% per year (BMI >45)",
        benefit: ">30% survival gain"
      },
      cardiovascular: {
        withSurgery: "40% reduction in events",
        withoutSurgery: "40-50% higher risk with HTN, dyslipidemia",
        benefit: "~70% risk reduction"
      },
      diabetes: {
        withSurgery: "2% annual incidence",
        withoutSurgery: "8-10% annual incidence",
        benefit: "~75% reduction"
      },
      mobility: {
        withSurgery: "Significant functional improvement",
        withoutSurgery: "Progressive disability, loss of mobility",
        benefit: ">50% functional improvement"
      },
      psychiatric: {
        withSurgery: "Improved mood, reduced depression/anxiety",
        withoutSurgery: "Worsening psychiatric morbidity",
        benefit: "Significant quality of life gain"
      }
    },
    
    // Legal Framework
    legalFramework: {
      regulation: "EC 883/2004 and 987/2009",
      article: "Article 20 - Authorization for planned treatment abroad",
      cjeuCases: [
        "Watts (C-372/04) - Prohibition of refusal if delays exceed medically acceptable timeframe",
        "Smits-Peerbooms (C-157/99) - Refusal must be motivated, objective, individualized",
        "Elchinov (C-173/09) - Mandatory authorization if national system cannot provide effective access",
        "Petru (C-268/13) - Obligation to authorize if system cannot guarantee timely treatment"
      ],
      nhsGuidance: "Undue delay defined as inability to provide treatment within medically justifiable timeframe"
    },
    
    // Security Question (for verification)
    securityQuestion: "Name of treating hospital",
    securityAnswer: "Hôpital de La Tour"
  }

  const testAPI = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientData: testData,
          documentType: selectedDocType,
          treatmentDate: '05/11/2025',
          maxTokens: maxTokens
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const downloadDocument = () => {
    if (!result) return
    
    const docType = DOCUMENT_TYPES.find(d => d.key === selectedDocType)
    const filename = `${docType?.label.replace(/\s+/g, '_')}_${testData.fullName.replace(/\s+/g, '_')}.txt`
    
    const blob = new Blob([result.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Retour
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Test API Génération Documents S2
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">API Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Configuration du Test</h2>
              
              {/* Type de document */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de Document
                </label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {DOCUMENT_TYPES.map(type => (
                    <option key={type.key} value={type.key}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tokens maximum */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tokens Maximum
                </label>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  min="500"
                  max="5000"
                  step="500"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Plus de tokens = document plus long (coût plus élevé)
                </p>
              </div>

              {/* Bouton de test */}
              <button
                onClick={testAPI}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Génération en cours...
                  </div>
                ) : (
                  'Générer le Document'
                )}
              </button>
            </div>

            {/* Données patient */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Complete Patient Test Data</h3>
              <div className="space-y-3 text-sm">
                <div className="border-b pb-2">
                  <strong className="text-gray-700">Personal Information</strong>
                  <div className="mt-1 space-y-1">
                    <div><span className="text-gray-600">Name:</span> {testData.fullName}</div>
                    <div><span className="text-gray-600">DOB:</span> {testData.dateOfBirth} (Age: {testData.age})</div>
                    <div><span className="text-gray-600">NHS:</span> {testData.nhsNumber}</div>
                    <div><span className="text-gray-600">NI:</span> {testData.nationalInsurance}</div>
                  </div>
                </div>
                
                <div className="border-b pb-2">
                  <strong className="text-gray-700">Clinical Data</strong>
                  <div className="mt-1 space-y-1">
                    <div><span className="text-gray-600">BMI:</span> {testData.bmi} (Height: {testData.height}cm, Weight: {testData.weight}kg)</div>
                    <div><span className="text-gray-600">Diagnosis:</span> {testData.primaryDiagnosis}</div>
                  </div>
                </div>
                
                <div className="border-b pb-2">
                  <strong className="text-gray-700">Comorbidities ({testData.comorbidities.length})</strong>
                  <div className="mt-1 text-xs text-gray-600">
                    {testData.comorbidities.slice(0, 3).map((c, i) => (
                      <div key={i}>• {c.condition}</div>
                    ))}
                    {testData.comorbidities.length > 3 && (
                      <div className="text-gray-500 italic">+ {testData.comorbidities.length - 3} more...</div>
                    )}
                  </div>
                </div>
                
                <div className="border-b pb-2">
                  <strong className="text-gray-700">Medications ({testData.medications.length})</strong>
                  <div className="mt-1 text-xs text-gray-600">
                    {testData.medications.slice(0, 3).map((m, i) => (
                      <div key={i}>• {m.name} - {m.dose}</div>
                    ))}
                    {testData.medications.length > 3 && (
                      <div className="text-gray-500 italic">+ {testData.medications.length - 3} more...</div>
                    )}
                  </div>
                </div>
                
                <div className="border-b pb-2">
                  <strong className="text-gray-700">Treatment Plan</strong>
                  <div className="mt-1 space-y-1">
                    <div><span className="text-gray-600">Procedure:</span> {testData.proposedTreatment}</div>
                    <div><span className="text-gray-600">Hospital:</span> {testData.facilityName}</div>
                    <div><span className="text-gray-600">Surgeon:</span> {testData.surgeonName}</div>
                    <div><span className="text-gray-600">Date:</span> {testData.surgeryDate}</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-xs font-medium text-blue-800">
                    ✓ Complete dataset includes:
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    {testData.comorbidities.length} comorbidities, {testData.medications.length} medications, 
                    NICE eligibility, tier 3 history, scientific evidence, legal framework
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-800 font-medium">Document généré avec succès!</span>
                  </div>
                </div>
                
                {/* Métadonnées */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Métadonnées</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Modèle:</span> {result.metadata?.model}
                    </div>
                    <div>
                      <span className="font-medium">Tokens:</span> {result.metadata?.tokensUsed}
                    </div>
                    <div>
                      <span className="font-medium">Coût:</span> ${result.metadata?.estimatedCost?.toFixed(6) || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Mots:</span> {result.metadata?.validation?.wordCount}
                    </div>
                    <div>
                      <span className="font-medium">Complétude:</span> {result.metadata?.validation?.completeness?.toFixed(1)}%
                    </div>
                    <div>
                      <span className="font-medium">Température:</span> {result.metadata?.generation?.temperature}
                    </div>
                  </div>
                  
                  <button
                    onClick={downloadDocument}
                    className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition-colors"
                  >
                    Télécharger le Document
                  </button>
                </div>

                {/* Avertissements */}
                {result.warnings && result.warnings.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="text-yellow-800 font-medium mb-2">Avertissements:</h4>
                    <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                      {result.warnings.map((warning: string, index: number) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Contenu généré */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Document Généré</h3>
                  <div className="bg-gray-50 rounded border p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{result.content}</pre>
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
