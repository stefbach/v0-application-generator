import { Suspense } from "react"
import Link from "next/link"
import { S2ApplicationGenerator } from "@/components/s2-application-generator"

function S2GeneratorWithSuspense() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading S2 Application Generator...</p>
          </div>
        </div>
      }
    >
      <S2ApplicationGenerator />
    </Suspense>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header avec bouton de test */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Générateur de Documents S2
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/test"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Tester l'API
              </Link>
              <div className="text-sm text-gray-500 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                API Prête
              </div>
            </div>
          </div>
        </div>
      </div>

      <S2GeneratorWithSuspense />
    </main>
  )
}
