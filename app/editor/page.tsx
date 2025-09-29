import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                S2 Document Generator
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
                Test API
              </Link>
              <div className="text-sm text-gray-500 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                API Ready
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Automated S2 Document Generation
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate professional NHS S2 application documents using GPT-4o with specialized medical and legal prompts
          </p>
          
          <div className="flex justify-center gap-4 mb-16">
            <Link
              href="/test"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
            >
              Start Generating Documents
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold mb-2">Medical Reports</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive medical reports conforming to NICE standards with complete patient data and clinical justification
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-4">⚕️</div>
              <h3 className="text-lg font-semibold mb-2">Undue Delay Letters</h3>
              <p className="text-gray-600 text-sm">
                Evidence-based letters demonstrating medical urgency with quantified risks and scientific references
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-lg font-semibold mb-2">Legal Justifications</h3>
              <p className="text-gray-600 text-sm">
                CJEU jurisprudence-based legal arguments with NHS delay evidence and regulatory compliance
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-lg font-semibold mb-2">Provider Declarations</h3>
              <p className="text-gray-600 text-sm">
                Official provider declarations with all regulatory confirmations and facility details
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-lg font-semibold mb-2">S2 Application Forms</h3>
              <p className="text-gray-600 text-sm">
                Complete NHS England S2 application forms with all required sections and patient information
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold mb-2">GPT-4o Powered</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI generation with specialized prompts for medical, legal, and administrative accuracy
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Document Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">English Language</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">NICE</div>
              <div className="text-sm text-gray-600">Standards Compliant</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 text-sm">
          <p>S2 Document Generator - Automated NHS Application Documents</p>
        </div>
      </div>
    </main>
  )
}
