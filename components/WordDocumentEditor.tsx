"use client"

import { useState } from 'react'
import Link from 'next/link'

interface FormField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'select'
  value: string
  options?: string[]
  required?: boolean
}

interface FormSection {
  title: string
  fields: FormField[]
}

export default function DocumentEditorPage() {
  const [documentType, setDocumentType] = useState<'s2_form' | 'provider_declaration'>('s2_form')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const s2FormSections: FormSection[] = [
    {
      title: "Part 1: S2 Funding Route",
      fields: [
        { id: 'treatment_date', label: 'Planned treatment dates', type: 'date', value: '2025-11-05', required: true },
        { id: 'country', label: 'Treatment country', type: 'text', value: 'Switzerland', required: true },
        { id: 'travel_from', label: 'Travel dates - From', type: 'date', value: '2025-11-04', required: true },
        { id: 'travel_to', label: 'Travel dates - To', type: 'date', value: '2025-11-08', required: true }
      ]
    },
    {
      title: "Part 2: Patient and GP Details",
      fields: [
        { id: 'family_name', label: 'Family name', type: 'text', value: 'Griffin', required: true },
        { id: 'first_name', label: 'First name(s)', type: 'text', value: 'Karen', required: true },
        { id: 'dob', label: 'Date of Birth', type: 'date', value: '1972-07-14', required: true },
        { id: 'sex', label: 'Sex', type: 'select', value: 'Female', options: ['Male', 'Female', 'Other'], required: true },
        { id: 'phone', label: 'Telephone number(s)', type: 'text', value: '+44 7760 884352', required: true },
        { id: 'email', label: 'Email address', type: 'text', value: 'griffin_karen@sky.com', required: true },
        { id: 'nhs_number', label: 'NHS number', type: 'text', value: '6085748752', required: true },
        { id: 'ni_number', label: 'National Insurance No', type: 'text', value: 'NY513105D', required: true },
        { id: 'address', label: 'Address for Permanent / settled residence in England', type: 'textarea', value: '51 Bridgeman Rd, Radford, Coventry CV6 1NQ', required: true },
        { id: 'gp_name', label: 'GP Name / Registered NHS GP practice', type: 'text', value: 'Dr Keane, Engleton House Surgery', required: true },
        { id: 'gp_address', label: 'NHS GP address', type: 'textarea', value: '2 Villa Road, Radford, Coventry', required: true },
        { id: 'gp_consultation_date', label: 'NHS GP Consultation Date', type: 'date', value: '2025-01-21', required: true }
      ]
    },
    {
      title: "Part 4: Treating Clinician / Provider Details",
      fields: [
        { id: 'clinician_name', label: 'Treating clinician name', type: 'text', value: 'Dr Jean-Marie Megevand', required: true },
        { id: 'establishment', label: 'Name of establishment', type: 'text', value: 'Hôpital de La Tour', required: true },
        { id: 'facility_address', label: 'Address', type: 'textarea', value: 'Avenue J.-D. Maillard 3, 1217 Meyrin', required: true },
        { id: 'facility_phone', label: 'Telephone number(s)', type: 'text', value: '+41 22 719 63 65', required: true },
        { id: 'facility_email', label: 'Email address', type: 'text', value: 'direction@latour.ch', required: true }
      ]
    },
    {
      title: "Part 5: Diagnosis / Treatment details",
      fields: [
        { id: 'diagnosis', label: 'Diagnosed medical condition', type: 'textarea', value: 'Morbid obesity', required: true },
        { id: 'treatment', label: 'Treatment(s) you are planning to receive', type: 'textarea', value: 'Gastric Sleeve (sleeve gastrectomy) - A laparoscopic procedure in which approximately 75-80% of the stomach is surgically removed, leaving behind a smaller, tube-shaped stomach.', required: true }
      ]
    }
  ]

  const providerDeclarationSections: FormSection[] = [
    {
      title: "Patient Information",
      fields: [
        { id: 'patient_name', label: 'Patient name', type: 'text', value: 'Karen Griffin', required: true },
        { id: 'patient_dob', label: 'DoB', type: 'date', value: '1972-07-14', required: true },
        { id: 'patient_address', label: 'Patient Address', type: 'textarea', value: '51 Bridgeman Rd, Radford, Coventry CV6 1NQ', required: true },
        { id: 'diagnosis_treatment', label: 'Diagnosis / treatment', type: 'text', value: 'MORBID OBESITY - GASTRIC SLEEVE SURGERY', required: true }
      ]
    },
    {
      title: "Provider Details",
      fields: [
        { id: 'provider_name_address', label: 'Name and address of treating healthcare provider', type: 'textarea', value: 'Olivier SCHMITT - Hôpital de La Tour\nAvenue J.-D. Maillard 3, 1217 Meyrin', required: true },
        { id: 'clinician_name', label: 'Name of treating clinician', type: 'text', value: 'Dr Jean-Marie Mégevand', required: true }
      ]
    },
    {
      title: "Provider Representative",
      fields: [
        { id: 'rep_name', label: 'Name', type: 'text', value: 'Olivier SCHMITT', required: true },
        { id: 'rep_title', label: 'Job Title', type: 'text', value: 'Directeur General/CEO', required: true },
        { id: 'rep_date', label: 'Date of signature', type: 'date', value: new Date().toISOString().split('T')[0], required: true }
      ]
    }
  ]

  const currentSections = documentType === 's2_form' ? s2FormSections : providerDeclarationSections

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const getFieldValue = (field: FormField) => {
    return formData[field.id] !== undefined ? formData[field.id] : field.value
  }

  const generateDocument = async () => {
    setLoading(true)
    try {
      // Préparer les données du patient avec les valeurs du formulaire
      const patientData = {
        fullName: `${formData.first_name || 'Karen'} ${formData.family_name || 'Griffin'}`,
        firstName: formData.first_name || 'Karen',
        lastName: formData.family_name || 'Griffin',
        dateOfBirth: formData.dob || '14/07/1972',
        sex: formData.sex || 'Female',
        nhsNumber: formData.nhs_number || '6085748752',
        nationalInsurance: formData.ni_number || 'NY513105D',
        address: formData.address || '51 Bridgeman Rd, Radford, Coventry CV6 1NQ',
        phone: formData.phone || '+44 7760 884352',
        email: formData.email || 'griffin_karen@sky.com',
        gpName: formData.gp_name || 'Dr Keane',
        gpAddress: formData.gp_address || '2 Villa Road, Radford, Coventry',
        gpConsultationDate: formData.gp_consultation_date || '21/01/2025',
        surgeryDate: formData.treatment_date || '05/11/2025',
        treatmentCountry: formData.country || 'Switzerland',
        facilityName: formData.establishment || 'Hôpital de La Tour',
        facilityAddress: formData.facility_address || 'Avenue J.-D. Maillard 3, 1217 Meyrin',
        facilityPhone: formData.facility_phone || '+41 22 719 63 65',
        facilityEmail: formData.facility_email || 'direction@latour.ch',
        surgeonName: formData.clinician_name || 'Dr Jean-Marie Megevand',
        diagnosis: formData.diagnosis || 'Morbid obesity',
        proposedTreatment: formData.treatment || 'Sleeve gastrectomy'
      }

      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: documentType === 's2_form' ? 's2_application_form' : 'provider_declaration',
          patientData,
          treatmentDate: formData.treatment_date || '2025-11-05'
        })
      })

      if (!response.ok) throw new Error('Generation failed')

      const result = await response.json()
      
      // Créer un fichier texte téléchargeable
      const blob = new Blob([result.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${documentType}_${formData.family_name || 'Griffin'}_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert('Document generated and downloaded!')
    } catch (error) {
      alert('Error generating document: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Document Editor</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Document Type</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setDocumentType('s2_form')}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    documentType === 's2_form'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">S2 Application Form</div>
                  <div className="text-sm text-gray-600 mt-1">Official NHS England form</div>
                </button>
                <button
                  onClick={() => setDocumentType('provider_declaration')}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    documentType === 'provider_declaration'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">Provider Declaration</div>
                  <div className="text-sm text-gray-600 mt-1">Hospital confirmation</div>
                </button>
              </div>

              <button
                onClick={generateDocument}
                disabled={loading}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating...' : '📥 Generate & Download'}
              </button>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">
                {documentType === 's2_form' ? 'S2 Application Form' : 'Provider Declaration Form'}
              </h2>

              <div className="space-y-8">
                {currentSections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border-t pt-6 first:border-t-0 first:pt-0">
                    <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.fields.map((field) => (
                        <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          
                          {field.type === 'textarea' ? (
                            <textarea
                              value={getFieldValue(field)}
                              onChange={(e) => handleFieldChange(field.id, e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : field.type === 'select' ? (
                            <select
                              value={getFieldValue(field)}
                              onChange={(e) => handleFieldChange(field.id, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {field.options?.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              value={getFieldValue(field)}
                              onChange={(e) => handleFieldChange(field.id, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
