"use client"

import { useState } from 'react'

export default function TestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')

  const testData = {
    fullName: "Karen Griffin",
    dateOfBirth: "14/07/1972", 
    nhsNumber: "6085748752",
    bmi: 47.1,
    diagnosis: "Morbid obesity",
    proposedTreatment: "Sleeve gastrectomy"
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
          documentType: 'medical_report',
          maxTokens: 1500
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test API S2 Document Generator</h1>
      
      <button
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6 disabled:opacity-50"
      >
        {loading ? 'Test en cours...' : 'Tester l\'API'}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Erreur:</strong> {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Génération réussie!
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded">
            <div><strong>Modèle:</strong> {result.metadata?.model}</div>
            <div><strong>Tokens:</strong> {result.metadata?.tokensUsed}</div>
            <div><strong>Coût:</strong> ${result.metadata?.estimatedCost?.toFixed(6) || 'N/A'}</div>
            <div><strong>Mots:</strong> {result.metadata?.validation?.wordCount}</div>
          </div>

          {result.warnings && result.warnings.length > 0 && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <strong>Avertissements:</strong>
              <ul className="list-disc list-inside mt-2">
                {result.warnings.map((warning: string, index: number) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
            <h3 className="font-bold mb-2">Document généré:</h3>
            <pre className="whitespace-pre-wrap text-sm">{result.content}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
