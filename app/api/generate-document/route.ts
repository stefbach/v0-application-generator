import { type NextRequest, NextResponse } from "next/server"

// Configuration OpenAI intégrée
const OPENAI_CONFIG = {
  models: {
    primary: "gpt-4o",
    fallback: "gpt-4o-mini", 
  },
  documentConfigs: {
    medical_report: {
      model: "gpt-4o",
      max_tokens: 4500,
      temperature: 0.15,
      top_p: 0.95,
      frequency_penalty: 0.0,
      presence_penalty: 0.05,
    },
    undue_delay_letter: {
      model: "gpt-4o", 
      max_tokens: 3500,
      temperature: 0.2,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
    },
    provider_declaration: {
      model: "gpt-4o-mini",
      max_tokens: 2500,
      temperature: 0.1,
      top_p: 0.95,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    },
    s2_application_form: {
      model: "gpt-4o",
      max_tokens: 3000,
      temperature: 0.05,
      top_p: 0.9,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    },
    legal_justification_letter: {
      model: "gpt-4o",
      max_tokens: 5000,
      temperature: 0.25,
      top_p: 0.95,
      frequency_penalty: 0.1,
      presence_penalty: 0.15,
    }
  }
}

// Estimation coûts (prix par 1K tokens)
const PRICING_ESTIMATES = {
  "gpt-4o": { input: 0.005, output: 0.015 },
  "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
}

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = PRICING_ESTIMATES[model] || PRICING_ESTIMATES["gpt-4o"]
  return (inputTokens / 1000 * pricing.input) + (outputTokens / 1000 * pricing.output)
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.75)
}

// Professional English prompts for automated S2 document generation
const DOCUMENT_PROMPTS = {
  medical_report: {
    systemPrompt: `You are a senior medical consultant specializing in bariatric surgery with expertise in S2 applications for NHS England.

OBJECTIVE: Create a comprehensive, professional medical report in ENGLISH conforming to NICE standards to justify bariatric surgery abroad under the S2 scheme.

MANDATORY STRUCTURE:
1. Patient Identification (name, DOB, NHS number, address, contact)
2. Clinical Data (height, weight, BMI with historical trends)
3. Detailed Comorbidities with functional impact
4. Current Medications with dosages and indications
5. Non-surgical Management History (Tier 3 programs, dietary attempts, failures)
6. NICE Eligibility Criteria (point-by-point justification)
7. Surgical Indication with proposed procedure
8. Receiving Hospital and Surgeon (accreditations, qualifications)
9. Treatment Schedule and S2 Follow-up Plan
10. Narrative Summary (clinical synthesis)
11. Medical Justification for Urgency and Undue Delay (with scientific evidence)
12. Conclusion with formal recommendation

QUALITY REQUIREMENTS:
- Precise medical terminology in ENGLISH
- References to NICE guidelines and major clinical studies
- Quantified risks with evidence-based data
- Strong medico-legal justification for urgency
- Format appropriate for NHS England authorities
- Professional, objective, evidence-based tone

CRITICAL: The entire report MUST be written in ENGLISH, not French.`,
    
    userPrompt: `Generate a complete medical report in ENGLISH for an S2 application based on this patient data:

PATIENT DATA:
{patientData}

TREATMENT DATE: {treatmentDate}

The report must be ready for submission to NHS England authorities and medically justify the urgency of bariatric surgery abroad given NHS delays.

WRITE EVERYTHING IN ENGLISH.`
  },

  undue_delay_letter: {
    systemPrompt: `You are a consultant bariatric surgeon with expertise in writing medical letters justifying "undue delay" for S2 applications.

OBJECTIVE: Draft a medical letter in ENGLISH demonstrating that NHS delays constitute a medically unacceptable "undue delay" for THIS specific patient.

MANDATORY STRUCTURE:
1. Professional Header (surgeon credentials)
2. Subject Line with patient references
3. Patient Background (extreme BMI, comorbidities)
4. Definition of Specific Delay Risks for THIS patient
5. Scientific Evidence with References (minimum 6 major studies)
6. Quantified Risk Differential Table
7. Firm Conclusion on Medical Urgency

SCIENTIFIC EVIDENCE TO INTEGRATE:
- Arterburn et al. JAMA 2015 (55% mortality reduction)
- Sjöström et al. NEJM 2007/2012 (SOS Study)
- Welbourn et al. Lancet 2014 (UK registry data)
- Mitchell et al. Obesity Reviews 2013 (psychiatric impact)
- Christou et al. Ann Surg 2004

STYLE: Authoritative, scientific, unequivocal about urgency.
CRITICAL: Write entirely in ENGLISH.`,
    
    userPrompt: `Write an expert letter in ENGLISH justifying "undue delay" for this patient:

PATIENT DATA:
{patientData}

CURRENT NHS DELAYS:
- Bariatric surgery: 18-34 months depending on region
- Waiting lists: >8,000 patients (RCS 2024)
- No trust meets 18-week target

The letter must convince NHS England that this delay is medically unacceptable for this specific patient.

WRITE EVERYTHING IN ENGLISH.`
  },

  provider_declaration: {
    systemPrompt: `You are a hospital administrator expert in completing official provider declarations for European S2 schemes.

OBJECTIVE: Complete the provider declaration in ENGLISH conforming to NHS England and European regulations.

MANDATORY COMPONENTS:
1. Exact patient information
2. Precise diagnosis and treatment
3. Regulatory confirmations (7 mandatory points)
4. Facility and clinician details
5. Provider type (public/private)
6. Compliant signatures and dates

STYLE: Administrative, precise, legally binding.
CRITICAL: Write entirely in ENGLISH.`,
    
    userPrompt: `Complete the provider declaration in ENGLISH for:

PATIENT: {patientData}
FACILITY: Hôpital de La Tour, Geneva
SURGEON: Dr Jean-Marie Megevand
TREATMENT: Sleeve gastrectomy
DATE: {treatmentDate}

Ensure all regulatory elements are present for NHS England validation.

WRITE EVERYTHING IN ENGLISH.`
  },

  s2_application_form: {
    systemPrompt: `You are an expert in S2 administrative procedures, specializing in completing official NHS England application forms.

OBJECTIVE: Complete the S2 (England) application form in ENGLISH with maximum administrative precision.

SECTIONS TO COMPLETE:
1. S2 Funding Route (Part 1) - regulatory confirmations
2. Patient and GP Details (Part 2) - exact personal data
3. Nationality Switzerland (Part 3) - nationality eligibility
4. Treating Clinician/Provider (Part 4) - facility details
5. Diagnosis/Treatment (Part 5) - medical indication
6. Supporting Information (Part 6) - additional context
7. Declarations (Parts 7-10) - legal signatures
8. Application Checklist (Part 11) - completeness verification

STYLE: Strict administrative, factual, error-free.
CRITICAL: Write entirely in ENGLISH.`,
    
    userPrompt: `Complete the S2 application form in ENGLISH for:

PATIENT DATA: {patientData}
TREATMENT: Sleeve gastrectomy, Hôpital de La Tour, Geneva
TREATMENT DATE: {treatmentDate}
APPLICANT: Dr Stéphane Bach (representative)

The form must be perfectly completed to avoid administrative delays.

WRITE EVERYTHING IN ENGLISH.`
  },

  legal_justification_letter: {
    systemPrompt: `You are a legal expert in European health law, specializing in S2 appeals and CJEU jurisprudence.

OBJECTIVE: Draft a legal letter in ENGLISH for an S2 application, integrating European jurisprudence and factual NHS data.

MANDATORY LEGAL STRUCTURE:
1. Legal Framework (Regulations EC 883/2004, 987/2009)
2. Relevant CJEU Jurisprudence (Watts, Smits-Peerbooms, Elchinov, Petru)
3. NHS "Undue Delay" Guidance
4. Factual Evidence of NHS Delays (national data)
5. Bariatric Surgery Specific Data
6. Patient's Medical Situation
7. Legal Conclusion and Formal Request

STYLE: Formal legal, argued, referenced, binding.
CRITICAL: Write entirely in ENGLISH.`,
    
    userPrompt: `Draft a legal justification letter in ENGLISH for an S2 application:

PATIENT: {patientData}
CONTEXT: Urgent bariatric surgery, NHS delays 18-34 months
AUTHORITY: NHS England Overseas Healthcare Services

The letter must demonstrate the legal obligation to grant S2 authorization given proven "undue delay" in the NHS system.

WRITE EVERYTHING IN ENGLISH.`
  }
}

// Templates de validation pour chaque type de document
const VALIDATION_TEMPLATES = {
  medical_report: {
    requiredSections: [
      'Patient Identification',
      'Clinical Data', 
      'Comorbidities',
      'Current Medications',
      'NICE Eligibility Criteria',
      'Surgical Indication',
      'Receiving Hospital',
      'Treatment Schedule',
      'Narrative Summary',
      'Medical Justification for Urgency',
      'Conclusion'
    ],
    minWordCount: 1500,
    mustInclude: ['BMI', 'NICE', 'sleeve gastrectomy', 'comorbidities', 'undue delay']
  },
  undue_delay_letter: {
    requiredSections: [
      'Professional Header',
      'Subject Line',
      'Patient Background', 
      'Risks of Undue Delay',
      'Evidence from Literature',
      'Quantified Risks',
      'Conclusion'
    ],
    minWordCount: 1200,
    mustInclude: ['undue delay', 'mortality risk', 'cardiovascular', 'JAMA', 'NEJM']
  },
  provider_declaration: {
    requiredSections: [
      'Patient Details',
      'Treatment Description',
      'Provider Confirmations',
      'Cost Breakdown',
      'Signatures'
    ],
    minWordCount: 800,
    mustInclude: ['S2', 'state funded', 'co-payment', 'Hôpital de La Tour']
  },
  s2_application_form: {
    requiredSections: [
      'S2 Funding Route',
      'Patient and GP Details',
      'Nationality Switzerland',
      'Treating Clinician',
      'Diagnosis/Treatment',
      'Application Checklist'
    ],
    minWordCount: 1000,
    mustInclude: ['Switzerland', 'sleeve gastrectomy', 'NHS number']
  },
  legal_justification_letter: {
    requiredSections: [
      'Legal Framework',
      'CJEU Jurisprudence',
      'NHS Guidance',
      'Factual Evidence',
      'Bariatric Surgery Data',
      'Medical Situation',
      'Legal Conclusion'
    ],
    minWordCount: 2000,
    mustInclude: ['Article 20', 'Watts', 'Petru', 'undue delay', 'Regulation 883/2004']
  }
}

// Fonction pour obtenir la configuration optimale
function getOptimalConfig(documentType: string, customMaxTokens?: number) {
  const config = OPENAI_CONFIG.documentConfigs[documentType] || OPENAI_CONFIG.documentConfigs.medical_report
  
  return {
    model: config.model,
    max_tokens: customMaxTokens || config.max_tokens,
    temperature: config.temperature,
    top_p: config.top_p,
    frequency_penalty: config.frequency_penalty,
    presence_penalty: config.presence_penalty,
    response_format: { type: "text" },
  }
}

// Fonction d'appel API avec retry
async function makeOpenAIRequest(config: any, apiKey: string, retryCount = 0): Promise<any> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Rate limit - retry
      if (response.status === 429 && retryCount < 3) {
        const delay = 1000 * Math.pow(2, retryCount)
        await new Promise(resolve => setTimeout(resolve, delay))
        return makeOpenAIRequest(config, apiKey, retryCount + 1)
      }
      
      // Fallback vers mini si modèle principal indisponible
      if (response.status === 404 && config.model === "gpt-4o") {
        console.warn("GPT-4O non disponible, fallback vers GPT-4O-mini")
        const fallbackConfig = { ...config, model: "gpt-4o-mini" }
        return makeOpenAIRequest(fallbackConfig, apiKey, retryCount)
      }
      
      throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    return await response.json()
  } catch (error) {
    if (retryCount < 3) {
      const delay = 1000 * Math.pow(2, retryCount)
      await new Promise(resolve => setTimeout(resolve, delay))
      return makeOpenAIRequest(config, apiKey, retryCount + 1)
    }
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { patientData, documentType, treatmentDate, maxTokens = 4000 } = await request.json()

    // Validation du type de document
    if (!DOCUMENT_PROMPTS[documentType]) {
      return NextResponse.json(
        { error: `Type de document non supporté: ${documentType}. Types disponibles: ${Object.keys(DOCUMENT_PROMPTS).join(', ')}` },
        { status: 400 }
      )
    }

    // Validation des données patient
    if (!patientData || typeof patientData !== 'object') {
      return NextResponse.json(
        { error: "Données patient manquantes ou invalides" },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || !apiKey.startsWith("sk-")) {
      return NextResponse.json(
        {
          error: "OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables.",
        },
        { status: 500 },
      )
    }

    const prompt = DOCUMENT_PROMPTS[documentType]
    
    // Préparation des messages avec prompts spécialisés
    const messages = [
      {
        role: "system",
        content: prompt.systemPrompt
      },
      {
        role: "user", 
        content: prompt.userPrompt
          .replace('{patientData}', JSON.stringify(patientData, null, 2))
          .replace('{treatmentDate}', treatmentDate || new Date().toISOString().split('T')[0])
      }
    ]

    // Configuration optimale pour le type de document
    const apiConfig = getOptimalConfig(documentType, maxTokens)
    apiConfig.messages = messages

    // Estimation préliminaire des tokens et coûts
    const inputText = messages.map(m => m.content).join(' ')
    const estimatedInputTokens = estimateTokens(inputText)
    const estimatedCost = estimateCost(apiConfig.model, estimatedInputTokens, apiConfig.max_tokens)

    console.log(`Génération ${documentType}: ~${estimatedInputTokens} tokens input, coût estimé: $${estimatedCost.toFixed(4)}`)

    // Appel API avec retry et gestion d'erreurs
    const data = await makeOpenAIRequest(apiConfig, apiKey)
    const content = data.choices[0]?.message?.content || ""

    // Validation basique du contenu généré
    const validation = validateDocumentContent(content, documentType)

    // Calcul du coût réel
    const actualInputTokens = data.usage?.prompt_tokens || estimatedInputTokens
    const actualOutputTokens = data.usage?.completion_tokens || 0
    const actualCost = estimateCost(apiConfig.model, actualInputTokens, actualOutputTokens)

    // Métadonnées pour tracking qualité et debugging
    const metadata = {
      documentType,
      generatedAt: new Date().toISOString(),
      promptVersion: "1.0",
      model: apiConfig.model, // Modèle réellement utilisé
      tokensUsed: data.usage?.total_tokens || 0,
      inputTokens: actualInputTokens,
      outputTokens: actualOutputTokens,
      estimatedCost: actualCost,
      validation,
      patientId: patientData.nhsNumber || patientData.id || 'unknown',
      generation: {
        temperature: apiConfig.temperature,
        maxTokens: apiConfig.max_tokens,
        topP: apiConfig.top_p
      }
    }

    return NextResponse.json({ 
      content,
      metadata,
      documentType,
      success: validation.isValid,
      warnings: validation.warnings
    })
  } catch (error) {
    console.error("Document generation error:", error)
    return NextResponse.json({ 
      error: "Internal server error during document generation",
      details: error.message 
    }, { status: 500 })
  }
}

// Fonction de validation du contenu généré
function validateDocumentContent(content: string, documentType: string) {
  const template = VALIDATION_TEMPLATES[documentType]
  if (!template) {
    return { isValid: true, warnings: [] }
  }

  const warnings = []
  const wordCount = content.split(/\s+/).length

  // Validation du nombre de mots minimum
  if (wordCount < template.minWordCount) {
    warnings.push(`Document trop court: ${wordCount} mots (minimum: ${template.minWordCount})`)
  }

  // Validation de la présence des termes obligatoires
  const missingTerms = template.mustInclude.filter(term => 
    !content.toLowerCase().includes(term.toLowerCase())
  )
  
  if (missingTerms.length > 0) {
    warnings.push(`Termes manquants: ${missingTerms.join(', ')}`)
  }

  // Validation des sections (basique - recherche de mots-clés)
  const missingSections = template.requiredSections.filter(section => {
    const sectionKeywords = section.toLowerCase().split(' ')
    return !sectionKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    )
  })

  if (missingSections.length > 0) {
    warnings.push(`Sections potentiellement manquantes: ${missingSections.join(', ')}`)
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    wordCount,
    completeness: ((template.requiredSections.length - missingSections.length) / template.requiredSections.length) * 100
  }
}
