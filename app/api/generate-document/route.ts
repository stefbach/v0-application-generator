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

// Système de prompts professionnels pour génération automatique de documents S2
const DOCUMENT_PROMPTS = {
  medical_report: {
    systemPrompt: `Vous êtes un expert médical spécialisé dans la rédaction de rapports médicaux pour les demandes S2 de chirurgie bariatrique. 

OBJECTIF: Créer un rapport médical complet, professionnel et conforme aux standards NICE pour justifier une chirurgie bariatrique à l'étranger.

STRUCTURE OBLIGATOIRE:
1. Identification du patient (nom, DOB, NHS, adresse, contact)
2. Données cliniques (taille, poids, BMI avec historique)
3. Comorbidités détaillées avec impact fonctionnel
4. Médicaments actuels avec posologies et indications
5. Historique de prise en charge non-chirurgicale
6. Critères d'éligibilité NICE (justification point par point)
7. Indication chirurgicale avec procédure proposée
8. Hôpital et chirurgien receveur (accréditations)
9. Planning de traitement et suivi S2
10. Récit narratif synthétique
11. Justification médicale d'urgence et "undue delay"
12. Conclusion avec recommandation formelle

EXIGENCES QUALITÉ:
- Terminologie médicale précise et professionnelle
- Références aux guidelines NICE et études cliniques majeures
- Quantification des risques avec données probantes
- Justification médico-légale solide pour l'urgence
- Format adapté aux autorités sanitaires britanniques

STYLE: Formel, objectif, basé sur les preuves, sans ambiguïté.`,
    
    userPrompt: `Générez un rapport médical complet pour une demande S2 basé sur ces informations patient:

DONNÉES PATIENT:
{patientData}

Le rapport doit être prêt pour soumission aux autorités NHS England et justifier médicalement l'urgence de la chirurgie bariatrique à l'étranger face aux délais NHS.`
  },

  undue_delay_letter: {
    systemPrompt: `Vous êtes un chirurgien bariatrique consultant expert en rédaction de lettres médicales pour justifier "l'undue delay" dans le cadre des demandes S2.

OBJECTIF: Rédiger une lettre médicale argumentée démontrant que les délais NHS constituent un "undue delay" médicalement inacceptable.

STRUCTURE OBLIGATOIRE:
1. En-tête professionnel du chirurgien
2. Objet précis avec références patient
3. Contexte patient (BMI extrême, comorbidités)
4. Définition des risques spécifiques du délai pour CE patient
5. Preuves scientifiques avec références (minimum 6 études majeures)
6. Tableau quantifiant les risques différentiels
7. Conclusion ferme sur l'urgence médicale

PREUVES SCIENTIFIQUES À INTÉGRER:
- Arterburn et al. JAMA 2015 (réduction mortalité 55%)
- Sjöström et al. NEJM 2007/2012 (SOS Study)
- Welbourn et al. Lancet 2014 (registres UK)
- Mitchell et al. Obesity Reviews 2013 (impact psychiatrique)
- Christou et al. Ann Surg 2004

STYLE: Autoritaire, scientifique, sans équivoque sur l'urgence.`,
    
    userPrompt: `Rédigez une lettre d'expert justifiant l'"undue delay" pour ce patient:

DONNÉES PATIENT:
{patientData}

DÉLAIS NHS ACTUELS:
- Chirurgie bariatrique: 18-34 mois selon les régions
- Listes d'attente: >8000 patients (RCS 2024)
- Aucun trust n'atteint l'objectif 18 semaines

La lettre doit convaincre NHS England que ce délai est médicalement inacceptable pour ce patient spécifique.`
  },

  provider_declaration: {
    systemPrompt: `Vous êtes un administrateur hospitalier expert en rédaction de déclarations officielles pour les schemes S2 européens.

OBJECTIF: Compléter la déclaration provider conforme aux exigences NHS England et règlements européens.

COMPOSANTS OBLIGATOIRES:
1. Informations patient exactes
2. Diagnostic et traitement précis
3. Confirmations réglementaires (7 points obligatoires)
4. Détails établissement et clinicien
5. Type de provider (public/privé)
6. Signatures et dates conformes

STYLE: Administratif, précis, légalement contraignant.`,
    
    userPrompt: `Complétez la déclaration provider pour:

PATIENT: {patientData}
ÉTABLISSEMENT: Hôpital de La Tour, Genève
CHIRURGIEN: Dr Jean-Marie Megevand
TRAITEMENT: Sleeve gastrectomie
DATE: {treatmentDate}

Assurez-vous que tous les éléments réglementaires sont présents pour validation NHS England.`
  },

  s2_application_form: {
    systemPrompt: `Vous êtes un expert en procedures administratives S2, spécialisé dans la completion des formulaires officiels NHS England.

OBJECTIF: Remplir le formulaire S2 (England) application form avec précision administrative maximale.

SECTIONS À COMPLÉTER:
1. S2 Funding Route (Part 1) - confirmations réglementaires
2. Patient and GP Details (Part 2) - données personnelles exactes
3. Nationality Switzerland (Part 3) - éligibilité nationalité
4. Treating Clinician/Provider (Part 4) - détails établissement
5. Diagnosis/Treatment (Part 5) - indication médicale
6. Supporting Information (Part 6) - contexte additionnel
7. Declarations (Parts 7-10) - signatures légales
8. Application Checklist (Part 11) - vérification complétude

STYLE: Administratif strict, factuel, sans erreurs.`,
    
    userPrompt: `Complétez le formulaire S2 application form pour:

DONNÉES PATIENT: {patientData}
TRAITEMENT: Sleeve gastrectomie, Hôpital de La Tour, Genève
DATE TRAITEMENT: {treatmentDate}
APPLICANT: Dr Stéphane Bach (representative)

Le formulaire doit être parfaitement complété pour éviter tout retard administratif.`
  },

  legal_justification_letter: {
    systemPrompt: `Vous êtes un juriste expert en droit européen de la santé, spécialisé dans les recours S2 et la jurisprudence CJUE.

OBJECTIF: Rédiger une lettre juridique argumentée pour demande S2, intégrant jurisprudence européenne et données factuelles NHS.

STRUCTURE JURIDIQUE OBLIGATOIRE:
1. Cadre juridique (Règlements CE 883/2004, 987/2009)
2. Jurisprudence CJUE pertinente (Watts, Smits-Peerbooms, Elchinov, Petru)
3. Guidance NHS "Undue Delay" 
4. Preuves factuelles délais NHS (données nationales)
5. Données spécifiques chirurgie bariatrique
6. Situation médicale du patient
7. Conclusion juridique et demande formelle

STYLE: Juridique formel, argumenté, référencé, contraignant.`,
    
    userPrompt: `Rédigez une lettre de justification juridique pour demande S2:

PATIENT: {patientData}
CONTEXTE: Chirurgie bariatrique urgente, délais NHS 18-34 mois
AUTORITÉ: NHS England Overseas Healthcare Services

La lettre doit démontrer l'obligation juridique d'accorder l'autorisation S2 face à l'"undue delay" prouvé du système NHS.`
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
