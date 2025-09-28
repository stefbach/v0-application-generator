"use client"

import { useState } from "react"
import { Download, FileText, Mail, User, Calendar, Stethoscope } from "lucide-react"

const S2ApplicationGenerator = () => {
  const [activeTab, setActiveTab] = useState("patient")
  const [patientData, setPatientData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    sex: "",
    nhsNumber: "",
    nationalInsurance: "",
    phone: "",
    email: "",
    address: "",
    postcode: "",

    // GP Information
    gpName: "",
    gpPractice: "",
    gpAddress: "",
    gpConsultationDate: "",

    // Medical Information
    height: "",
    weight: "",
    bmi: "",
    diagnosis: "Morbid obesity",
    comorbidities: [],
    medications: [],
    treatmentHistory: "",
    surgicalProcedure: "Sleeve gastrectomy",

    // Treatment Details - PRE-FILLED
    treatmentDate: "",
    hospitalName: "Hôpital de La Tour",
    hospitalAddress: "Avenue J.-D. Maillard 3, 1217 Meyrin, Switzerland",
    surgeonName: "Dr Jean-Marie Mégevand",
    hospitalPhone: "+41 22 719 63 65",
    hospitalEmail: "direction@latour.ch",
    hospitalDirector: "Olivier SCHMITT",
    hospitalDirectorTitle: "Directeur General/CEO",

    // Application Details - PRE-FILLED
    applicantName: "Dr Stéphane Bach",
    applicantTitle: "Doctor",
    applicantPhone: "+447458114333",
    applicantEmail: "sbach@obesity-care-clinic.com",
    applicantAddress:
      "Quad Central Q3, Level 1, Office 5 Triq l-Esportaturi (Zona Industrijali, Mriehel) Mriehel Industrial Zone CBD 1040 Malta",
  })

  const [generatedDocuments, setGeneratedDocuments] = useState({
    medicalReport: "",
    undueDelayLetter: "",
    s2Form: "",
    providerDeclaration: "",
    emailTemplate: "",
  })

  const handleInputChange = (field, value) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayChange = (field, index, value) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayItem = (field) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayItem = (field, index) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const calculateBMI = () => {
    if (patientData.height && patientData.weight) {
      const heightM = Number.parseFloat(patientData.height) / 100
      const weightKg = Number.parseFloat(patientData.weight)
      const bmi = (weightKg / (heightM * heightM)).toFixed(1)
      handleInputChange("bmi", bmi)
    }
  }

  const calculateFollowUpDates = (treatmentDate) => {
    if (!treatmentDate) return {}

    const surgery = new Date(treatmentDate)

    return {
      preOpConsultation: new Date(surgery.getTime() - 14 * 24 * 60 * 60 * 1000), // 2 weeks before
      surgery: surgery,
      followUp1Month: new Date(surgery.getTime() + 30 * 24 * 60 * 60 * 1000), // 1 month after
      followUp6Months: new Date(surgery.getTime() + 180 * 24 * 60 * 60 * 1000), // 6 months after
      followUp1Year: new Date(surgery.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year after
      followUp2Years: new Date(surgery.getTime() + 730 * 24 * 60 * 60 * 1000), // 2 years after
    }
  }

  const standardDosages = {
    // Cardiovascular
    Amlodipine: "5-10 mg once daily",
    Atorvastatin: "20-80 mg once daily in the evening",
    Lisinopril: "10-40 mg once daily",
    Metoprolol: "25-100 mg twice daily",
    Simvastatin: "20-40 mg once daily in the evening",
    Ramipril: "2.5-10 mg once daily",
    Bisoprolol: "1.25-10 mg once daily",

    // Diabetes
    Metformin: "500-1000 mg twice daily with meals",
    Gliclazide: "40-160 mg once daily with breakfast",
    "Insulin Lantus": "As per individual requirements, usually once daily",
    "Insulin NovoRapid": "As per individual requirements with meals",

    // Pain Management
    Gabapentin: "300-600 mg three times daily",
    Pregabalin: "75-150 mg twice daily",
    Codeine: "30-60 mg every 4-6 hours as needed (max 240mg/24h)",
    Tramadol: "50-100 mg every 4-6 hours as needed (max 400mg/24h)",
    Zapain: "30/500 mg up to four times daily as needed",
    "Co-codamol": "30/500 mg up to four times daily as needed",

    // Mental Health
    Sertraline: "50-200 mg once daily",
    Citalopram: "20-40 mg once daily",
    Fluoxetine: "20-60 mg once daily",
    Amitriptyline: "10-75 mg once daily at bedtime",
    Mirtazapine: "15-45 mg once daily at bedtime",

    // Hormones
    Levothyroxine: "25-200 mcg once daily on empty stomach",
    Estradiol: "1-2 mg once daily",
    "Testosterone gel": "Apply as directed once daily",

    // Gastrointestinal
    Omeprazole: "20-40 mg once daily before food",
    Lansoprazole: "15-30 mg once daily before food",
    Mesalazine: "800 mg three times daily with food",
    Prednisolone: "5-60 mg once daily with food (as prescribed)",

    // Bone Health
    "Alendronic acid": "70 mg once weekly on empty stomach",
    "Ibandronic acid": "150 mg once monthly on empty stomach",
    "Calcium carbonate": "1.25 g twice daily with food",
    "Vitamin D3": "800-4000 IU once daily",

    // Antihistamines
    Fexofenadine: "120-180 mg once daily",
    Cetirizine: "10 mg once daily",
    Loratadine: "10 mg once daily",

    // Urological
    Mirabegron: "25-50 mg once daily",
    Tamsulosin: "400 mcg once daily after food",
    Finasteride: "5 mg once daily",

    // Respiratory
    "Salbutamol inhaler": "1-2 puffs when required (max 8 puffs/24h)",
    "Beclomethasone inhaler": "1-2 puffs twice daily",
    Montelukast: "10 mg once daily in the evening",

    // Common supplements
    "Vitamin B12": "1000 mcg once daily",
    "Iron tablets": "200 mg once daily on empty stomach",
    "Folic acid": "5 mg once daily",
  }

  const getMedicationWithDosage = (medicationName) => {
    const trimmedName = medicationName.trim()

    // Check for exact match first
    if (standardDosages[trimmedName]) {
      return `${trimmedName} - ${standardDosages[trimmedName]}`
    }

    // Check for partial matches (case insensitive)
    const lowerName = trimmedName.toLowerCase()
    for (const [drug, dosage] of Object.entries(standardDosages)) {
      if (drug.toLowerCase().includes(lowerName) || lowerName.includes(drug.toLowerCase())) {
        return `${drug} - ${dosage}`
      }
    }

    // If no match found, return as entered
    return trimmedName
  }

  const formatDateForDisplay = (date) => {
    return date ? date.toLocaleDateString("en-GB") : ""
  }

  const handleMedicationChange = (index, value) => {
    // Auto-complete with standard dosage when user types just the medication name
    const medicationWithDosage = getMedicationWithDosage(value)
    handleArrayChange("medications", index, medicationWithDosage)
  }

  const generateMedicalReport = () => {
    const report = `# Medical Report -- S2 Funding Request

## Patient Identification

**Full name:** ${patientData.firstName} ${patientData.lastName}
**Date of birth:** ${patientData.dateOfBirth}
**NHS Number:** ${patientData.nhsNumber}
**Address:** ${patientData.address}, ${patientData.postcode}, United Kingdom
**Contact:** ${patientData.phone} / ${patientData.email}

## Clinical Data

**Height:** ${patientData.height} cm
**Weight:** ${patientData.weight} kg
**BMI:** ${patientData.bmi}

### Comorbidities

${patientData.comorbidities.map((condition) => `- ${condition}`).join("\n")}

### Current Medications

${patientData.medications.map((med) => `- ${med}`).join("\n")}

## Non-Surgical Management

${patientData.treatmentHistory}

## NICE Eligibility Criteria

- **BMI ≥ 40** confirmed (${patientData.bmi})
- **Severe comorbidities** including ${patientData.comorbidities.slice(0, 3).join(", ")}
- **Patient motivation:** strong, explicit request for bariatric surgery (${patientData.surgicalProcedure})

## Surgical Indication

**Proposed procedure:** ${patientData.surgicalProcedure}

**Rationale:** Morbid obesity with severe comorbidities; failure of conservative management

**Expected benefits:**
- 60-70% excess weight loss
- Significant improvement of comorbidities
- Improved long-term quality of life

**Risks if delayed:**
- Increased cardiovascular risk
- Progression of associated conditions
- Aggravation of psychiatric disorders
- Gastrointestinal complications

## Receiving Hospital and Surgeon

**Facility:** ${patientData.hospitalName}
**Surgeon:** ${patientData.surgeonName}
**Accreditation:** Fully accredited, compliant with European bariatric standards

## Treatment and Follow-Up Schedule (S2 Program)

**Preoperative consultation:** ${patientData.treatmentDate ? formatDateForDisplay(calculateFollowUpDates(patientData.treatmentDate).preOpConsultation) : "[Date to be calculated]"}
**Surgical intervention (${patientData.surgicalProcedure}):** ${patientData.treatmentDate ? formatDateForDisplay(calculateFollowUpDates(patientData.treatmentDate).surgery) : "[Date to be entered]"}

**Planned follow-up:**
- 1 month: ${patientData.treatmentDate ? formatDateForDisplay(calculateFollowUpDates(patientData.treatmentDate).followUp1Month) : "[Date to be calculated]"}
- 6 months: ${patientData.treatmentDate ? formatDateForDisplay(calculateFollowUpDates(patientData.treatmentDate).followUp6Months) : "[Date to be calculated]"}
- 1 year: ${patientData.treatmentDate ? formatDateForDisplay(calculateFollowUpDates(patientData.treatmentDate).followUp1Year) : "[Date to be calculated]"}
- 2 years: ${patientData.treatmentDate ? formatDateForDisplay(calculateFollowUpDates(patientData.treatmentDate).followUp2Years) : "[Date to be calculated]"}

## Medical Justification for Urgency and Undue Delay

Meta-analyses and long-term cohort studies consistently demonstrate that undue delay in access to bariatric surgery significantly increases morbidity and mortality in patients with morbid obesity:

- **Cardiovascular risks:** A meta-analysis (Arterburn et al., JAMA 2015) showed that delaying surgery by more than 12 months is associated with worsening hypertension and dyslipidemia, leading to higher rates of myocardial infarction and stroke.
- **Metabolic deterioration:** Sjöström et al. (NEJM 2007, Swedish Obese Subjects Study) demonstrated that earlier surgery provides substantial reductions in type 2 diabetes incidence and better long-term metabolic outcomes.
- **Mortality risk:** A large UK registry analysis (Welbourn et al., Lancet 2014) confirmed that bariatric surgery reduces all-cause mortality. Delaying intervention prolongs exposure to preventable risks.

Given these findings, **a waiting time of 12-18 months, as currently observed within NHS pathways, represents an undue delay (UNDUE DELAY)** and places this patient at high risk of deterioration across cardiovascular, metabolic, musculoskeletal, and psychiatric domains.

## Conclusion

${patientData.firstName} ${patientData.lastName} fully meets NICE eligibility for bariatric surgery. A **${patientData.surgicalProcedure}** is medically indicated, urgent, and justified. Any delay of 12-18 months would represent an **undue delay** with a high risk of irreversible progression of comorbidities and increased mortality risk.

Immediate approval of S2 funding is medically required to ensure timely surgery in a specialized accredited European center.

**${patientData.surgeonName}**
Consultant Bariatric Surgeon
${patientData.hospitalName}`

    return report
  }

  const generateUndueDelayLetter = () => {
    const letter = `# Letter on Undue Delay -- S2 Funding Request

**${patientData.surgeonName}**
Consultant Bariatric Surgeon
${patientData.hospitalName}

**Subject:** Medical justification regarding undue delay in access to bariatric surgery for ${patientData.firstName} ${patientData.lastName} (DOB: ${patientData.dateOfBirth}, NHS No: ${patientData.nhsNumber})

Dear Sir/Madam,

I am writing to provide medical evidence supporting the urgency of bariatric surgery for ${patientData.firstName} ${patientData.lastName} and to highlight the risks associated with **undue delay** should surgery be postponed within the NHS system for 12-18 months. Surgery is proposed within 3 months (${new Date(patientData.treatmentDate).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}).

## Patient Background

${patientData.firstName} ${patientData.lastName} is a ${new Date().getFullYear() - new Date(patientData.dateOfBirth).getFullYear()}-year-old ${patientData.sex.toLowerCase()} presenting with **morbid obesity (BMI ${patientData.bmi}, ${patientData.weight} kg, ${patientData.height} cm)** and the following severe comorbidities:

${patientData.comorbidities.map((condition) => `- ${condition}`).join("\n")}

${patientData.firstName} has undergone multiple conservative interventions without sustained success and fulfills all **NICE criteria** for bariatric surgery.

## Risks of Undue Delay in This Patient

For ${patientData.firstName} ${patientData.lastName}, waiting 12-18 months would carry particularly high risks:

- **High BMI (${patientData.bmi})**: Mortality risk significantly higher than average bariatric candidates
- **Multiple comorbidities**: Progressive deterioration of existing conditions
- **Quality of life**: Continued decline in functional capacity and psychological wellbeing

## Evidence from the Literature

1. **Arterburn D, et al. JAMA 2015** → Bariatric surgery reduced all-cause mortality by **55%**
2. **Sjöström L, et al. NEJM 2007** → Surgery reduced mortality by **29%**
3. **Welbourn R, et al. Lancet 2014** → Registry data confirm reduced all-cause mortality
4. **Mitchell JE, et al. Obesity Reviews 2013** → Delays >12 months linked to psychiatric worsening

## Conclusion

For ${patientData.firstName} ${patientData.lastName}, a 12-18 month delay constitutes an **undue delay** given the BMI of ${patientData.bmi} and severe comorbidities. Each month of postponement increases risks of cardiovascular events, metabolic deterioration, and irreversible disability.

**Immediate approval of S2 funding for surgery in ${new Date(patientData.treatmentDate).toLocaleDateString("en-GB", { month: "long", year: "numeric" })} is medically justified and urgently required.**

Yours sincerely,

**${patientData.surgeonName}**
Consultant Bariatric Surgeon
${patientData.hospitalName}`

    return letter
  }

  const generateS2Form = () => {
    const form = `UK S2 (PLANNED TREATMENT) APPLICATION FORM (ENGLAND)

This form is for residents of England who want planned treatment in an EU country, 
Norway, Iceland, Liechtenstein or Switzerland, also known as the S2 funding route.

If you have a valid UK-issued S1 form and live in the EU, Norway, Iceland, Liechtenstein or 
Switzerland, you should not use this application form.

Find out more by searching for 'healthcare abroad' on www.nhs.uk.

Please read the supporting application guidance notes before you fill in this form. If this form is 
incorrectly filled in, it will delay your application and may affect your funding.

═══════════════════════════════════════════════════════════════════════

Part 1: S2 Funding Route
☑ I am applying before treatment for a UK (England) issued S2.
Planned treatment dates: ${new Date(patientData.treatmentDate).toLocaleDateString("en-GB")}

☑ I can confirm that the planned treatment is in the state healthcare sector.
Treatment is planned in the following country: Switzerland

☑ I am/the patient is ordinarily resident in England and do not have a registered UK issued S1 
(including an ongoing application).

☐ If a payment has been made for the planned treatment, please confirm if this was for the co-payment?

Applications for planned treatment in Switzerland only – see Section 3:
To ensure this is the correct reciprocal healthcare funding route please confirm your 
reason for travel for planned healthcare (select one), whilst:

☑ Temporary visit (for planned healthcare only) - provide expected travel dates (From / To):
${new Date(new Date(patientData.treatmentDate).getTime() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB")} - ${new Date(new Date(patientData.treatmentDate).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB")}

☐ Studying abroad (provide a letter from your educational institution confirming the start and 
end dates of your course).
☐ Temporary visit (including holidays, visiting family or short business trips)
☐ Temporary visit - Working Abroad (provide a copy of A1 document from HM Revenue and 
Customs or your employer)

═══════════════════════════════════════════════════════════════════════

Part 2: Patient and GP Details (Please record clearly, in BLOCK CAPITALS)

Family name: ${patientData.lastName.toUpperCase()}
First name(s): ${patientData.firstName.toUpperCase()}
Date of Birth: ${patientData.dateOfBirth}
Sex: ${patientData.sex}

Telephone number(s): ${patientData.phone}
Email address: ${patientData.email}
NHS number: ${patientData.nhsNumber}
This is normally a 3-3-4-digit format
National Insurance No: ${patientData.nationalInsurance}

☑ I can confirm, by ticking the box, that the patient is ordinarily resident in 
England (living lawfully on a settled basis and entitled to receive NHS 
services) – for more information please see the guidance notes.

Address for Permanent / settled residence in England (inc. postcode) for correspondence:
${patientData.address}, ${patientData.postcode}

Are you currently residing at the settled address you have provided above? ☑ Yes ☐ No

GP Name / Registered NHS GP practice (this must be the NHS GP you were registered 
with at the time of the treatment you are applying for):
${patientData.gpName} ${patientData.gpPractice}

NHS GP address (inc. postcode):
${patientData.gpAddress}

Please confirm that you have seen your NHS GP for the treatment you are applying for*:
Yes: ☑ NHS GP Consultation Date: ${patientData.gpConsultationDate} No: ☐

*A GP assessment / referral will only be needed if you are being seen for treatment by a 
secondary care service (hospital or community care). You will not need a GP referral for 
treatments in a primary care setting (e.g. dental, ophthalmology). A referral to NHS services from 
a dental or ophthalmic provider is only required if applicable to your application.

NHS treatment: Please confirm if you are currently being treated on the NHS for the medical 
diagnosis and / or treatment plan relevant to this application: ☐ Yes ☑ No

═══════════════════════════════════════════════════════════════════════

Part 3: Nationality – Switzerland only

If you are applying for planned treatment in a country other than Switzerland, please move on to 
Part 4. If you are applying for planned treatment in Switzerland, please continue to fill in Part 3:

If you are applying for planned treatment in Switzerland, you need to provide proof that you hold:
☑ UK, Irish, Swiss or EU nationality (or have dual nationality including one of these).
☐ Or are a stateless person or refugee, living in the UK.
☐ or are the family member or survivor of someone who holds one of these nationalities or 
statuses.

a) Your Status: Please select which nationality / status YOU hold (tick relevant option):
☑ UK national
☐ Irish national
☐ EU national
☐ Swiss national
☐ Refugee or stateless person (living in the UK)
☐ Dual nationality (if includes UK / Irish / EU / Swiss)
☐ Other, please provide details

═══════════════════════════════════════════════════════════════════════

Part 4: Treating Clinician / Provider Details

Provide details of the main establishment(s) in the country you want to receive 
treatment in, (in relation to the treatments for which you are applying for funding). If this 
involves more than one establishment, please provide details on a separate sheet.

Treating clinician name: ${patientData.surgeonName}
Name of establishment: ${patientData.hospitalName}
Address: ${patientData.hospitalAddress}
Country: Switzerland
Telephone number(s): ${patientData.hospitalPhone}
Email address: ${patientData.hospitalEmail}
Fax number: We do not use fax

Provider Declaration:
There is also a provider declaration from that they will need to complete to confirm that they can accept 
an S2 form, the treatment is in the state healthcare system, they can provide a medical letter, treatment 
dates and estimated costs and will only charge patients for any co-payment element.

═══════════════════════════════════════════════════════════════════════

Part 5: Diagnosis / Treatment details (in relation to this application)

What is the DIAGNOSED medical condition for which you are planning to 
receive treatment(s) abroad?
${patientData.diagnosis}

Describe the TREATMENT(S) you are planning to receive abroad.
${patientData.surgicalProcedure} - ${
      patientData.surgicalProcedure === "Sleeve gastrectomy"
        ? 'A gastric sleeve, also known as sleeve gastrectomy, is a type of weight-loss surgery (bariatric surgery) in which a large portion of the stomach is removed, leaving behind a smaller, tube-shaped stomach that looks like a "sleeve." About 75–80% of the stomach is surgically removed. The remaining stomach is narrow and banana-shaped. It significantly reduces the amount of food you can eat at one time. It also affects hormones that control hunger, blood sugar, and satiety (feeling full).'
        : patientData.surgicalProcedure
    }

Record the Planned Treatment Dates: ${new Date(patientData.treatmentDate).toLocaleDateString("en-GB")}

═══════════════════════════════════════════════════════════════════════

Part 6: Supporting relevant information (to application)
(continue on a separate sheet if needed)

Medical necessity and urgency justified by:
- BMI ${patientData.bmi} indicating morbid obesity requiring surgical intervention
- Multiple severe comorbidities: ${patientData.comorbidities.join(", ")}
- Failed conservative management as documented in medical history
- NICE eligibility criteria fully met
- Undue delay in NHS system (12-18 months) represents significant health risk

═══════════════════════════════════════════════════════════════════════

Part 7: Declaration by the Patient

I declare that all the information provided is correct and complete. I understand and accept that if 
I knowingly withhold information or provide false or misleading information, I may be liable to 
prosecution and/or civil proceedings and have to pay the money to the Treating Clinic(ian) 
directly.

I consent to the disclosure of all information relating to my application to and by NHS 
England, the Department of Health and Social Care (DHSC), NHSBSA, NHS Counter Fraud 
Authority and other NHS organisations / external parties, necessary for the processing and 
verification of this claim and the investigation, prevention, detection and prosecution of fraud.

I understand that the NHS is not liable for the care received abroad when funded via the UK S2 
route.

I also hereby give permission for the person identified as the Applicant in Part 9 of this form 
to make this application on my behalf (if applicable).

Name of patient: ${patientData.firstName} ${patientData.lastName}
Signature of patient: [SIGNATURE REQUIRED]
Date: ${new Date().toLocaleDateString("en-GB")}

═══════════════════════════════════════════════════════════════════════

Part 8: Confirmation of the Applicant
Are you (the patient) also the applicant? ☐ Yes ☑ No – Please complete Parts 9 & 10

═══════════════════════════════════════════════════════════════════════

Part 9: Declaration by the Applicant

I declare that I am applying with the consent of the patient / I am legally empowered to act on 
behalf of the patient (delete as appropriate)

Name of applicant: ${patientData.applicantName}
Signature of applicant: [SIGNATURE REQUIRED]
Date: ${new Date().toLocaleDateString("en-GB")}

═══════════════════════════════════════════════════════════════════════

Part 10: Details of the Applicant

Family name: ${patientData.applicantName.split(" ").pop()}
First name(s): ${patientData.applicantName.split(" ").slice(0, -1).join(" ")}
Relationship to patient: Authorised Representative for S2 Application
Title: ${patientData.applicantTitle}
Telephone number: ${patientData.applicantPhone}
Email: ${patientData.applicantEmail}
Applicant's address (for correspondence): ${patientData.applicantAddress}

═══════════════════════════════════════════════════════════════════════

Part 11: Application Check List
(Please complete and submit this section with your form)

Tick | Documents / checks you need to submit to support the application form
☑ | Residency: Proof of residency documents for your permanent / settled address in England.
☑ | Switzerland: Proof of nationality or status (UK, Irish, Swiss or EU nationality; or a stateless person or refugee; or are the family member or survivor of someone who holds one of these nationalities or statuses).
☑ | Medical letter (diagnosis and treatment): Treating clinician's medical letter supporting diagnosis and medical need for treatment. This must be no more than 6 months old and prior to treatment start date.
☑ | Medical timeframe: Written support from your treating clinician which states how soon you need your treatment and why (based on their clinical assessment). This is required for the "Undue Delay" criteria. Undue Delay – is when the NHS cannot provide the treatment / equivalent requested, in a medically justified timeframe, for your diagnosis / condition.
☑ | Provider confirmation: Written confirmation from the treatment provider that they will accept a UK S2, the planned treatment dates & estimated costs.
☑ | Provider declaration: Completed treatment provider declaration form.
☑ | All sections of the application form have been fully completed.
☑ | All Signatures provided on application form (patient / applicant).
☑ | Security Question and Answer: Q: Treatment Hospital
    A: ${patientData.hospitalName}

UK S2 disclaimer
This scheme only covers the cost of planned treatment, as agreed with the UK Government. The S2 
certificate is not an alternative to comprehensive medical or travel insurance, which may be required to 
cover the costs of any treatment which an S2 certificate does not specifically authorise. Please keep 
up to date with information on available funding options on the NHS website at www.nhs.uk by 
searching for 'healthcare abroad'.

Signature of applicant confirming you have read and understood the above disclaimer:
Signature: [SIGNATURE REQUIRED] Date: ${new Date().toLocaleDateString("en-GB")}

Where possible, please send your application and supporting documentation by email to:
england.europeanhealthcare@nhs.net

Please email your documents as a PDF attachment, do not email embedded documents or 
photographs of documents. If possible, organise documents into one PDF for each "category" (e.g., 
application form, proof of residence, medical documentation in 3 separate PDFs). This will enable 
your application to be assessed more quickly.

Paper documents should be sent to the following address:
European Cross Border Healthcare Team
NHS England, County Hall, Leicester Road, Glenfield, Leicester, LE3 8RA

Contact email: england.europeanhealthcare@nhs.net
Contact telephone: 0113 8249653.

Please note: It can take up to 20 working days for a fully completed application to be 
processed and an entitlement decision to be made.`

    return form
  }

  const generateProviderDeclaration = () => {
    const declaration = `GUIDANCE FOR APPLICANTS

In addition to the completed application form and residency requirements for the Planned Treatment Scheme (S2) to NHS England, you must also provide supporting evidence from the proposed treatment provider with your application which demonstrates:

• Support of the diagnosis and medical need for treatment.

• Confirmation of how soon the treatment is needed and why, both based on clinical assessment.

• Confirmation that a UK issued S2 can be accepted and processed through the Healthcare Authority in the provider's country (state funded treatment is being offered).

• The planned treatment dates and fully itemised estimated costs - this should include any necessary pre/post operative requirements.

This information must be provided on official letterheaded correspondence, and from a business email address if supplied digitally. It is your responsibility to provide translated medical documentation to ensure it can be understood to progress the application.

It is recommended you request your chosen treatment provider to complete and return the following Provider Declaration form to ensure you are aware of:

• What the S2 certificate, if issued, will only be valid for state funded healthcare on the same basis as a resident of the treating country.

• Any additional costs that you may be asked to pay upfront (co-payments) and which may be eligible for a direct claim reimbursement upon your return to the UK. For more information on co-payments, please see www.nhs.uk/using-the-nhs/healthcare-abroad/going-abroad-for-treatment/planned-treatment-s2-funding-route/.

• Any additional private costs that are non-reimbursable for example room upgrades.

Please provide the Provider Declaration Form and Guidance for Providers to your treatment provider when requesting your supporting evidence for your Planned Treatment Application. This form will support your S2 application, evidence your eligibility for S2 funding and enable you to make informed choices regarding any expected costs.

Important:
If you are travelling with the intention of receiving treatment - Prior approval must be in place and a valid S2 certificate must be issued before planned state funded healthcare is received.

NHSE does not determine applications for reimbursements of copayments, a patient contribution a resident of the treating country is expected to pay towards state funded healthcare costs, for the Planned Treatment Scheme (S2). Invoices for state funded treatment received outside of the dates of the issued S2 certificate are not eligible for reimbursement via the S2 direct claim process. It is important when applying for an S2 you include all pre and post operative requirements. All direct claim queries should be directed to: https://www.nhsbsa.nhs.uk/claim-refund-treatment-costs.

The UK is no longer part of the EU Cross-Border Healthcare Directive (the EU Directive). This means that you are unable to claim back any paid costs of planned state funded or private healthcare treatment in an EEA country. More information can be found here: https://www.nhs.uk/using-the-nhs/healthcare-abroad/going-abroad-for-treatment/eu-directive-route/.

It is recommended you travel with your UK issued European/Global Health Insurance Card and have the necessary travel insurance coverage for your circumstances.

══════════════════════════════════════════════════════════════════════════════════════════════════

FORM TO BE FILLED OUT BY TREATING HEALTHCARE PROVIDERS

• Please read the Guidance for Providers before completing this form.

• Completion of the declaration confirms that you have read and understood the eligibility requirements of the Planned Treatment Scheme (S2) as detailed in the appropriate reciprocal healthcare arrangement.

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Patient name:     ${patientData.firstName} ${patientData.lastName}                                                           │
│                                                                                                 │
│ DoB:              ${patientData.dateOfBirth}                                                           │
│                                                                                                 │
│ Patient Address:  ${patientData.address}, ${patientData.postcode}                                      │
│                                                                                                 │
│ Diagnosis /       ${patientData.surgicalProcedure.toUpperCase()}                                        │
│ treatment:                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

By signing this form, I, as a representative of the treatment provider, agree with the following points:

• The provider can accept an S2 form as the treatment is being provided in the state healthcare sector under the same conditions as a resident of the treating country.

• Prior to the treatment taking place, a medical letter supporting the diagnosis and the need for treatment has been issued to the patient. The letter includes all pre-operative requirements necessary for the planned treatment package to go ahead and post-operative requirements for the patient to be discharged. This letter has been signed by the treating clinician.

• The eligible costs for state funded treatment provided will be charged through the Health Authority in the treating country under the S2 scheme (except co-payment charges which the patient may be asked to pay directly where that is normal practice).

• The patient will not be charged any fees other than those which would be payable by a resident of the treating country receiving the same state funded treatment.

• Details of the planned treatment dates and estimated costs, showing what is payable by the prospective patient, have been provided within a supporting letter. Any co-payments, chargeable to the patient on the same basis as a resident of the treating country, were explained to the patient and are clearly identified on the invoice. This is from the provider and not the clinician.

If applicable:
I, as a representative of a private healthcare provider providing state funded services, agree with the following point:

• Details of the planned treatment dates and estimated costs include an itemised invoice provided to the prospective patient that clearly demonstrates which costs will be:

  - paid through the S2 as state funded paid by the competent country's Healthcare Authority directly to the treating country Healthcare Authority,

  - any relevant co-payments chargeable to the patient on the same basis as a resident of the treating country and may be eligible for reimbursement,

  - and privately provided charges which are non-reimbursable as there are no reciprocal healthcare agreements in place that provides provision for private healthcare received.

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Additional comments:                                                                            │
│                                                                                                 │
│ None                                                                                            │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Name and address of treating healthcare provider:                                               │
│ ${patientData.hospitalName}                                                                         │
│ ${patientData.hospitalAddress}                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Type of healthcare provider (please tick one option):                                          │
│                                                                                                 │
│ ☑ Public (State Funded) Healthcare Provider                                                     │
│                                                                                                 │
│ ☐ Private Healthcare Provider Providing State Funded Services                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Name of treating clinician:                                                                     │
│                                                                                                 │
│ ${patientData.surgeonName}                                                                           │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Provider representative signing declaration:                                                    │
│                                                                                                 │
│ Name: Olivier SCHMITT                                                                           │
│                                                                                                 │
│ Job Title: Directeur General/CEO                                                                │
│                                                                                                 │
│ Signature: [SIGNATURE REQUIRED]                                                                 │
│                                                                                                 │
│ Date of signature: ${new Date().toLocaleDateString("en-GB")}                                           │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

══════════════════════════════════════════════════════════════════════════════════════════════════

GUIDANCE FOR PROVIDERS

The Planned Treatment Scheme (S2), named after the S2 administrative form, is a funding route available pursuant to reciprocal healthcare agreements between the EU, EFTA and the UK. It applies to all European Economic Area (EEA) countries and Switzerland. The S2 arrangements allow people residing in the UK or EEA country, irrespective of their nationality, to obtain planned healthcare treatment in another EEA country (or Switzerland if nationality requirements are met) at the expense of the country competent for their healthcare. Travel and accommodation costs are not included in S2 funding.

The EU-UK Withdrawal Agreement, the EU-UK Trade and Co-operation Agreement, the EEA EFTA Separation Agreement, the Swiss Citizens' Rights Agreement, UK-Swiss Social Security Convention, and the EEA-EFTA Social Security Coordination Convention all contain S2 rights.

The S2 certificate is a European-wide form that allows patients to access state funded planned treatment abroad on the same basis as a resident of the treating country. If the treating country's state funded Healthcare Authority operates a co-payment system (often referred to as patient contribution by the European Commission), a set proportion of the cost of the planned treatment package must be paid by the patient to you, the treatment provider.

The planned treatment package can be offered within a private facility provided there is a state funded contract to conduct the planned treatment and the S2 can be accepted as a guarantee of payment.

The S2 certificate is presented prior to treatment being received. As the treatment provider, you should present the S2 certificate to your Healthcare Authority so that a refund can be processed via the UK.

Important
The UK is no longer part of the EU Cross-Border Healthcare Directive (the EU Directive). This means that patients are unable to claim back any paid costs of planned state funded or private healthcare treatment in an EEA country. More information can be found here: https://www.nhs.uk/using-the-nhs/healthcare-abroad/going-abroad-for-treatment/eu-directive-route/.

Prior approval must be given to the patient and an S2 certificate must be issued before planned state funded healthcare is provided to the patient.

The S2 Scheme is agreed within the reciprocal healthcare agreements in place between the UK and the EEA and Switzerland, and S2 approval is limited to state funded healthcare. All private treatment and related charges are out of scope of the agreements held.

Payment and Co-payment Charge (or Patient Contribution)
As the treatment provider, you should offer treatment under the same conditions of care and payment that would apply to residents of your country. Some countries charge residents a percentage of the total cost of their treatment. This is a co-payment charge. This means that if a patient applies and receives treatment in a country that operates a co-payment system, they will also pay this percentage towards their treatment, directly to you as the treatment provider. Any expected co-payment (or patient contribution) that would normally be charged for state funded healthcare will apply and that is the only charge that you should make to the patient for any approved S2 treatment received.

This charge should not be confused with any private healthcare charge. Any additional charges related to private healthcare costs received as part of an approved S2 treatment package are separate charges that are non-reimbursable and are the responsibility of the patient. Such payments are often required to be paid in advance of any treatment received.

As the treatment provider, you should issue the patient with a fully itemised breakdown of charges as part of the application process to ensure the patient is informed of any expected costs including:

• Estimated state funded costs through the S2 certificate.

• Expected co-payment (payable by the patient and may be reimbursable upon return to the UK).

• Private healthcare charges (payable by the patient and are non-reimbursable).

State Funded Services Offered in a Private Healthcare Setting
If you are a private healthcare provider providing state funded services via the S2 scheme you should issue the prospective patient with a detailed estimated cost invoice to enable them to be fully informed regarding the costs that may be incurred if planned treatment abroad is received prior to signing the Provider Declaration form which agrees that part or all of the treatment offered is via state funded healthcare.

Treatment that is offered privately or that providers do not hold a state funded contract to provide, is out of scope of the Planned Treatment Scheme (S2) and the costs of private treatment will be payable by the patient and will not be reimbursable. An S2 certificate will be issued on the completion of the above Provider Declaration which demonstrates that it is understood by all parties that the treatment is eligible for funding via the S2 scheme as it is either in full or in part state funded.`

    return declaration
  }

  const generateEmailTemplate = () => {
    const email = `Subject: S2 Authorization Request - ${patientData.firstName} ${patientData.lastName} (NHS: ${patientData.nhsNumber}) - Urgent Bariatric Surgery

To: NHS England – Overseas Healthcare Services (S2 Team)

Subject: S2 Prior Authorization Request – ${patientData.firstName} ${patientData.lastName} (DOB: ${patientData.dateOfBirth}, NHS No: ${patientData.nhsNumber})

⸻

Dear Sir/Madam,

In accordance with Article 20 of Regulation (EC) No 883/2004 and Regulation No 987/2009, we request S2 prior authorization for ${patientData.firstName} ${patientData.lastName}, for ${patientData.surgicalProcedure.toLowerCase()} at ${patientData.hospitalName}, under the responsibility of ${patientData.surgeonName}, accredited bariatric surgeon.

The file includes: S2 form, provider and establishment attestations, dated quotation, detailed medical report, GP letter, proof of residence, and undue delay justification.

⸻

## 1. Legal Framework and Jurisprudence
• Article 20 of Regulation (EC) 883/2004: obligation to grant authorization if treatment is covered and cannot be provided in the UK within a medically justifiable timeframe.
• CJEU:
  • Watts (C-372/04): prohibition to refuse if delays exceed what is medically acceptable.
  • Smits-Peerbooms (C-157/99): refusal must be justified, objective and individualized.
  • Elchinov (C-173/09): authorization mandatory if national system cannot provide effective access.
  • Petru (C-268/13): obligation to authorize if system cannot guarantee timely treatment.

⸻

## 2. NHS Guidance – "Undue Delay"

NHS England defines undue delay as the inability to provide treatment "within a medically justifiable period for the patient's condition."
It is expected that administration finds a medically acceptable solution for ${patientData.firstName} ${patientData.lastName}, given the severe comorbidities and major risk of deterioration if surgery is postponed. This standard aligns with CJEU jurisprudence (Watts, Petru, Elchinov).

⸻

## 3. NHS Delays Assessment (National Evidence)
• England (June 2025): 3.1 million patients waiting over 18 weeks; 234,885 patients waiting over 52 weeks. No acute trust meets the "92% <18 weeks" target.
• Wales (StatsWales 2024): over 40% of patients wait over 26 weeks, and nearly 20% over 52 weeks.
• Scotland (PHS 2024): 18-week standard not met, waiting lists reach record levels.
• Northern Ireland (My Waiting Times NI, 2025): several specialties show median delays exceeding 52 weeks.

These data demonstrate widespread structural delays incompatible with urgent medical needs.

⸻

## 4. Bariatric Surgery Specific Data
• FOI Swansea Bay UHB (2022): delay ≈105 weeks for sleeve, ≈130 weeks for bypass.
• FOI Wrightington, Wigan & Leigh NHS FT (2025): absence of Tier-4 bariatric service, patients redirected.
• Specialized publications:
  • Pournaras et al., 2025 (PMC): models based on 12-24 month delays in NHS for bariatric surgery.
  • Oviva UK, 2025: Tier 3 service waiting lists (pre-operative) frequently exceeding 20 months, further extending access to surgery.
  • Royal College of Surgeons, 2024: over 8,000 patients recorded on waiting lists for weight loss surgery in NHS.

These elements confirm that delays for bariatric surgery in NHS regularly reach 18-34 months by region — a delay manifestly not medically acceptable for a high-risk patient like ${patientData.firstName} ${patientData.lastName}.

⸻

## 5. Medical Situation of ${patientData.firstName} ${patientData.lastName}
• BMI ${patientData.bmi} (${patientData.weight} kg, ${patientData.height} cm) – morbid obesity
• Severe comorbidities: ${patientData.comorbidities.slice(0, 5).join(", ")}
• Failed conservative treatment
• NICE eligibility: confirmed (BMI >${patientData.bmi > 40 ? "40" : "35"} with comorbidities)

## 6. Risks of ≥12–18 Month Delay
• Cardio-metabolic deterioration
• Progressive musculoskeletal disability
• Psychiatric deterioration
• Preventable excess mortality

⸻

## 7. Conclusion and Request

In view of European law, CJEU jurisprudence, NHS guidance, national evidence and specialized data on bariatric surgery, as well as ${patientData.firstName} ${patientData.lastName}'s clinical condition:

➡️ An NHS delay of 12-18 months constitutes manifest undue delay.

We therefore request immediate granting of S2 authorization. Failing this, any refusal decision must be fully justified in law and fact, in accordance with Watts and Smits-Peerbooms rulings.

Yours faithfully,

${patientData.applicantTitle} ${patientData.applicantName}
Patient Representative

Attached documents:
1. Completed and signed S2 form
2. Detailed medical report
3. Undue delay justification letter
4. Provider declaration
5. Proof of residence and nationality
6. GP correspondence`

    return email
  }

  // AI-powered document generation
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false)
  const [aiApiKey, setAiApiKey] = useState("")

  const callOpenAI = async (messages, maxTokens = 2000) => {
    if (!aiApiKey || !aiApiKey.startsWith("sk-")) {
      throw new Error("Valid OpenAI API key required (must start with sk-)")
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${aiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        max_tokens: maxTokens,
        temperature: 0.3,
        response_format: { type: "text" },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ""
  }

  const generateAIEnhancedMedicalReport = async (patientData) => {
    const followUpDates = calculateFollowUpDates(patientData.treatmentDate)

    const messages = [
      {
        role: "system",
        content:
          "You are a senior consultant bariatric surgeon with 20+ years of experience writing medical reports for NHS S2 funding applications. Your reports are known for their clinical precision, evidence-based justifications, and successful funding outcomes. Write comprehensive, professional medical reports that meet NHS standards and demonstrate clear medical necessity.",
      },
      {
        role: "user",
        content: `Write a comprehensive medical report for NHS S2 funding application for bariatric surgery:

PATIENT PROFILE:
- Name: ${patientData.firstName} ${patientData.lastName}
- Age: ${new Date().getFullYear() - new Date(patientData.dateOfBirth).getFullYear()} years
- Gender: ${patientData.sex}
- BMI: ${patientData.bmi} kg/m² (Height: ${patientData.height}cm, Weight: ${patientData.weight}kg)
- NHS Number: ${patientData.nhsNumber}

CLINICAL PRESENTATION:
- Primary Diagnosis: ${patientData.diagnosis}
- Planned Procedure: ${patientData.surgicalProcedure}
- Comorbidities: ${patientData.comorbidities.join(", ") || "None reported"}
- Current Medications: ${patientData.medications.join(", ") || "None reported"}
- Conservative Treatment History: ${patientData.treatmentHistory || "Multiple attempts documented"}

TREATMENT SCHEDULE:
- Pre-operative consultation: ${patientData.treatmentDate ? formatDateForDisplay(followUpDates.preOpConsultation) : "[To be scheduled]"}
- Surgical date: ${patientData.treatmentDate ? formatDateForDisplay(followUpDates.surgery) : "[To be scheduled]"}
- Follow-up schedule: 1 month, 6 months, 1 year, 2 years post-operatively

SURGEON & FACILITY:
- Surgeon: ${patientData.surgeonName}
- Hospital: ${patientData.hospitalName}
- Location: ${patientData.hospitalAddress}

REQUIREMENTS FOR THE REPORT:
1. Professional medical format with clear sections
2. Demonstrate NICE eligibility criteria compliance (BMI >40 or >35 with comorbidities)
3. Provide compelling clinical justification for surgery urgency
4. Reference relevant medical literature on obesity-related health risks
5. Emphasize risks of surgical delay (cardiovascular, metabolic deterioration)
6. Include assessment of functional impact and quality of life
7. Document failed conservative management attempts
8. Reference NHS waiting times as justification for S2 route
9. Use appropriate medical terminology throughout
10. Conclude with strong recommendation for immediate authorization

The report should be comprehensive, evidence-based, and persuasive to NHS funding reviewers. Focus on the medical necessity and urgency of the intervention.`,
      },
    ]

    return await callOpenAI(messages, 2500)
  }

  const generateAIEnhancedUndueDelayLetter = async (patientData) => {
    const messages = [
      {
        role: "system",
        content:
          'You are a specialist bariatric surgeon and expert in EU healthcare law writing "undue delay" justification letters for NHS S2 applications. Your letters combine clinical expertise with legal knowledge of EU regulations and CJEU case law. You understand NHS waiting times and can make compelling arguments for urgent overseas treatment.',
      },
      {
        role: "user",
        content: `Write a professional "undue delay" justification letter for NHS S2 funding:

PATIENT DETAILS:
- ${patientData.firstName} ${patientData.lastName}, ${new Date().getFullYear() - new Date(patientData.dateOfBirth).getFullYear()} years old
- BMI: ${patientData.bmi} kg/m² indicating morbid obesity
- Comorbidities: ${patientData.comorbidities.join(", ") || "Multiple documented"}
- Failed conservative management documented

LEGAL FRAMEWORK TO REFERENCE:
- Article 20 of Regulation (EC) No 883/2004
- Regulation (EU) No 987/2009
- CJEU Cases: Watts (C-372/04), Smits-Peerbooms (C-157/99), Elchinov (C-173/09), Petru (C-268/13)

CURRENT NHS SITUATION:
- National bariatric surgery waiting times: 12-18+ months
- Multiple NHS trusts showing significant delays
- Tier 3 services overwhelmed with referrals
- Some trusts have suspended new referrals

LETTER REQUIREMENTS:
1. Open with formal medical letterhead format
2. Reference EU legal obligations under Article 20
3. Cite specific CJEU jurisprudence on undue delay
4. Present current NHS waiting time evidence
5. Provide patient-specific risk assessment of delayed treatment
6. Quantify health deterioration risks during 12-18 month delay
7. Reference medical literature on obesity progression
8. Emphasize cardiovascular and metabolic risks
9. Include mortality statistics for untreated morbid obesity
10. Reference NICE guidelines on bariatric surgery timing
11. Make compelling case for medical urgency
12. Conclude with strong recommendation for immediate S2 authorization

The letter should be authoritative, legally sound, and demonstrate thorough understanding of both clinical urgency and EU healthcare law. Use professional medical and legal terminology appropriate for NHS England S2 reviewers.`,
      },
    ]

    return await callOpenAI(messages, 2000)
  }

  const generateAIEnhancedEmailTemplate = async (patientData) => {
    const messages = [
      {
        role: "system",
        content:
          "You are writing a formal submission email to NHS England S2 Team on behalf of Dr Stéphane Bach. You combine medical expertise with knowledge of EU healthcare regulations and NHS procedures. Your emails are professional, legally grounded, and achieve high approval rates for S2 applications.",
      },
      {
        role: "user",
        content: `Write a professional email to NHS England S2 Team for bariatric surgery funding request:

APPLICATION DETAILS:
- Patient: ${patientData.firstName} ${patientData.lastName}
- NHS Number: ${patientData.nhsNumber}
- Procedure: ${patientData.surgicalProcedure}
- Surgeon: ${patientData.surgeonName}
- Hospital: ${patientData.hospitalName}, Switzerland
- Applicant: Dr Stéphane Bach (Authorized S2 Representative)

EMAIL REQUIREMENTS:
1. Professional subject line referencing patient and urgency
2. Formal opening addressing NHS England S2 Team
3. Clear statement of S2 authorization request under EU regulations
4. Reference to Article 20 of Regulation (EC) 883/2004 and 987/2009
5. Brief summary of patient's clinical urgency and BMI status
6. Mention of failed conservative treatment and NICE eligibility
7. Reference to NHS undue delay situation (12-18+ month waiting times)
8. Citation of relevant CJEU cases supporting the application
9. List of all supporting documents being submitted
10. Emphasis on medical necessity and legal entitlement
11. Professional closing with contact details
12. Appropriate legal and medical terminology throughout

The email should be persuasive yet respectful, demonstrating thorough preparation and understanding of S2 criteria. Include specific legal references that strengthen the application and show compliance with EU healthcare directives.`,
      },
    ]

    return await callOpenAI(messages, 1500)
  }

  const generateAllDocuments = () => {
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
    if (!aiApiKey || !aiApiKey.startsWith("sk-")) {
      alert("Please enter a valid OpenAI API key (starting with sk-) to use AI-enhanced document generation.")
      return
    }

    setIsGeneratingWithAI(true)

    try {
      console.log("Starting AI document generation...")

      // Generate AI-enhanced documents sequentially to avoid rate limits
      const aiMedicalReport = await generateAIEnhancedMedicalReport(patientData)
      console.log("Medical report generated")

      // Small delay between requests to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const aiUndueDelayLetter = await generateAIEnhancedUndueDelayLetter(patientData)
      console.log("Undue delay letter generated")

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const aiEmailTemplate = await generateAIEnhancedEmailTemplate(patientData)
      console.log("Email template generated")

      // Keep standard structured forms but enhance narrative documents with AI
      const documents = {
        medicalReport: aiMedicalReport,
        undueDelayLetter: aiUndueDelayLetter,
        s2Form: generateS2Form(), // Keep original structured form
        providerDeclaration: generateProviderDeclaration(), // Keep original structured form
        emailTemplate: aiEmailTemplate,
      }

      setGeneratedDocuments(documents)
      console.log("All AI documents generated successfully")
    } catch (error) {
      console.error("AI generation error:", error)
      let errorMessage = "Error generating AI documents: "

      if (error.message.includes("API key")) {
        errorMessage += "Invalid API key. Please check your OpenAI API key."
      } else if (error.message.includes("429")) {
        errorMessage += "Rate limit exceeded. Please try again in a few minutes."
      } else if (error.message.includes("401")) {
        errorMessage += "Authentication failed. Please verify your API key."
      } else if (error.message.includes("402")) {
        errorMessage += "Insufficient credits. Please check your OpenAI account balance."
      } else if (error.message.includes("403")) {
        errorMessage += "Access denied. Please check your API key permissions."
      } else {
        errorMessage += error.message
      }

      alert(errorMessage)
    } finally {
      setIsGeneratingWithAI(false)
    }
  }

  const downloadDocument = (content, filename) => {
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

  const renderPatientForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={patientData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={patientData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={patientData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sex</label>
          <select
            className="w-full p-2 border rounded-md"
            value={patientData.sex}
            onChange={(e) => handleInputChange("sex", e.target.value)}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">NHS Number</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={patientData.nhsNumber}
            onChange={(e) => handleInputChange("nhsNumber", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">National Insurance Number</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={patientData.nationalInsurance}
            onChange={(e) => handleInputChange("nationalInsurance", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            className="w-full p-2 border rounded-md"
            value={patientData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            className="w-full p-2 border rounded-md"
            value={patientData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Full Address</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows="3"
          value={patientData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
        />
      </div>

      <div className="w-full md:w-1/2">
        <label className="block text-sm font-medium mb-1">Postcode</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          value={patientData.postcode}
          onChange={(e) => handleInputChange("postcode", e.target.value)}
        />
      </div>
    </div>
  )

  const renderMedicalForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Height (cm)</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md"
            value={patientData.height}
            onChange={(e) => {
              handleInputChange("height", e.target.value)
              setTimeout(calculateBMI, 100)
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg)</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md"
            value={patientData.weight}
            onChange={(e) => {
              handleInputChange("weight", e.target.value)
              setTimeout(calculateBMI, 100)
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">BMI</label>
          <input type="text" className="w-full p-2 border rounded-md bg-gray-100" value={patientData.bmi} readOnly />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Primary Diagnosis</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          value={patientData.diagnosis}
          onChange={(e) => handleInputChange("diagnosis", e.target.value)}
          placeholder="e.g. Morbid obesity"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Planned Surgical Procedure</label>
        <select
          className="w-full p-2 border rounded-md"
          value={patientData.surgicalProcedure}
          onChange={(e) => handleInputChange("surgicalProcedure", e.target.value)}
        >
          <option value="Sleeve gastrectomy">Sleeve gastrectomy</option>
          <option value="Gastric bypass">Gastric bypass</option>
          <option value="Gastric band">Gastric band</option>
          <option value="Duodenal switch">Duodenal switch</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Comorbidities</label>
        {patientData.comorbidities.map((condition, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-md"
              value={condition}
              onChange={(e) => handleArrayChange("comorbidities", index, e.target.value)}
              placeholder="e.g. Hypertension"
            />
            <button
              type="button"
              onClick={() => removeArrayItem("comorbidities", index)}
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              -
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("comorbidities")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Comorbidity
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Current Medications</label>
        <div className="bg-yellow-50 p-3 rounded-md mb-3">
          <p className="text-sm text-yellow-800">
            <strong>💡 Auto-dosage feature:</strong> Just type the medication name (e.g., "Metformin", "Gabapentin") and
            the standard dosage will be added automatically!
          </p>
        </div>
        {patientData.medications.map((medication, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-md"
              value={medication}
              onChange={(e) => handleMedicationChange(index, e.target.value)}
              onBlur={(e) => handleMedicationChange(index, e.target.value)}
              placeholder="e.g. Metformin (dosage will be added automatically)"
            />
            <button
              type="button"
              onClick={() => removeArrayItem("medications", index)}
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              -
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("medications")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Medication
        </button>

        <div className="mt-3">
          <details className="text-sm">
            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
              View supported medications with auto-dosage
            </summary>
            <div className="mt-2 bg-gray-50 p-3 rounded max-h-48 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.keys(standardDosages).map((med, idx) => (
                  <div key={idx} className="text-gray-700">
                    {med}
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Conservative Treatment History</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows="4"
          value={patientData.treatmentHistory}
          onChange={(e) => handleInputChange("treatmentHistory", e.target.value)}
          placeholder="Describe previous weight loss attempts, diets, medical follow-up, etc."
        />
      </div>
    </div>
  )

  const renderGPForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">GP Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={patientData.gpName}
            onChange={(e) => handleInputChange("gpName", e.target.value)}
            placeholder="Dr Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">GP Practice Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={patientData.gpPractice}
            onChange={(e) => handleInputChange("gpPractice", e.target.value)}
            placeholder="Engleton House Surgery"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">GP Practice Address</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows="3"
          value={patientData.gpAddress}
          onChange={(e) => handleInputChange("gpAddress", e.target.value)}
          placeholder="2 Villa Road, Radford, Coventry, CV6 2GH"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">GP Consultation Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded-md"
          value={patientData.gpConsultationDate}
          onChange={(e) => handleInputChange("gpConsultationDate", e.target.value)}
        />
      </div>
    </div>
  )

  const renderTreatmentForm = () => {
    const followUpDates = calculateFollowUpDates(patientData.treatmentDate)

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Planned Treatment Date (Surgery)</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={patientData.treatmentDate}
            onChange={(e) => handleInputChange("treatmentDate", e.target.value)}
          />
        </div>

        {patientData.treatmentDate && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-3">Automatically Calculated Schedule</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <strong className="text-blue-700">Pre-operative consultation:</strong>
                <div className="text-blue-600">{formatDateForDisplay(followUpDates.preOpConsultation)}</div>
              </div>
              <div>
                <strong className="text-blue-700">Surgery date:</strong>
                <div className="text-blue-600">{formatDateForDisplay(followUpDates.surgery)}</div>
              </div>
              <div>
                <strong className="text-blue-700">1-month follow-up:</strong>
                <div className="text-blue-600">{formatDateForDisplay(followUpDates.followUp1Month)}</div>
              </div>
              <div>
                <strong className="text-blue-700">6-month follow-up:</strong>
                <div className="text-blue-600">{formatDateForDisplay(followUpDates.followUp6Months)}</div>
              </div>
              <div>
                <strong className="text-blue-700">1-year follow-up:</strong>
                <div className="text-blue-600">{formatDateForDisplay(followUpDates.followUp1Year)}</div>
              </div>
              <div>
                <strong className="text-blue-700">2-year follow-up:</strong>
                <div className="text-blue-600">{formatDateForDisplay(followUpDates.followUp2Years)}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hospital Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md bg-gray-100"
              value={patientData.hospitalName}
              readOnly
              title="Pre-filled - Hôpital de La Tour"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Surgeon Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md bg-gray-100"
              value={patientData.surgeonName}
              readOnly
              title="Pre-filled - Dr Jean-Marie Mégevand"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hospital Address</label>
          <textarea
            className="w-full p-2 border rounded-md bg-gray-100"
            rows="3"
            value={patientData.hospitalAddress}
            readOnly
            title="Pre-filled - Avenue J.-D. Maillard 3, 1217 Meyrin, Switzerland"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hospital Phone</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md bg-gray-100"
              value={patientData.hospitalPhone}
              readOnly
              title="Pre-filled - +41 22 719 63 65"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hospital Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md bg-gray-100"
              value={patientData.hospitalEmail}
              readOnly
              title="Pre-filled - direction@latour.ch"
            />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Hospital Information (Pre-filled)</h4>
          <p className="text-sm text-green-700">
            <strong>Director/CEO:</strong> {patientData.hospitalDirector}
            <br />
            <strong>Title:</strong> {patientData.hospitalDirectorTitle}
          </p>
        </div>
      </div>
    )
  }

  const renderApplicantForm = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-green-800 mb-2">Applicant Information (Pre-filled)</h4>
        <p className="text-sm text-green-700">
          The applicant information below is pre-configured for Dr Stéphane Bach as the authorized S2 representative.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Applicant Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md bg-gray-100"
            value={patientData.applicantName}
            readOnly
            title="Pre-filled - Dr Stéphane Bach"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md bg-gray-100"
            value={patientData.applicantTitle}
            readOnly
            title="Pre-filled - Doctor"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Applicant Phone</label>
          <input
            type="tel"
            className="w-full p-2 border rounded-md bg-gray-100"
            value={patientData.applicantPhone}
            readOnly
            title="Pre-filled - +447458114333"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Applicant Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-md bg-gray-100"
            value={patientData.applicantEmail}
            readOnly
            title="Pre-filled - sbach@obesity-care-clinic.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Applicant Address</label>
        <textarea
          className="w-full p-2 border rounded-md bg-gray-100"
          rows="3"
          value={patientData.applicantAddress}
          readOnly
          title="Pre-filled - Malta office address"
        />
      </div>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* API Key Input */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold mb-4 text-purple-800">🤖 AI-Enhanced Document Generation</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-purple-700">OpenAI API Key (Optional)</label>
            <input
              type="password"
              className="w-full p-3 border rounded-md"
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
              placeholder="sk-... (Enter your OpenAI API key for AI-enhanced documents)"
            />
            <p className="text-xs text-purple-600 mt-2">
              With AI enhancement: Intelligent medical reasoning, enhanced clinical justifications, better legal
              arguments
            </p>
          </div>
        </div>

        {/* Generation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <button
              onClick={generateAllDocuments}
              className="w-full px-6 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <FileText className="inline-block w-5 h-5 mr-2" />
              Generate Standard Documents
            </button>
            <p className="text-sm text-gray-600 mt-2">Uses pre-built templates with your data</p>
          </div>

          <div className="text-center">
            <button
              onClick={generateAIDocuments}
              disabled={isGeneratingWithAI}
              className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isGeneratingWithAI ? (
                <>
                  <div className="inline-block w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Generating with AI...
                </>
              ) : (
                <>
                  <FileText className="inline-block w-5 h-5 mr-2" />🤖 Generate AI-Enhanced Documents
                </>
              )}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              {aiApiKey ? "Intelligent medical reasoning & enhanced arguments" : "Requires OpenAI API key"}
            </p>
          </div>
        </div>

        {/* AI Benefits */}
        {aiApiKey && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">🧠 AI Enhancement Benefits:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Intelligent clinical reasoning based on patient's specific profile</li>
              <li>• Enhanced medical literature references and evidence</li>
              <li>• Sophisticated legal arguments with EU case law</li>
              <li>• Patient-specific risk assessment and urgency justification</li>
              <li>• Professional medical terminology and NHS-compliant formatting</li>
              <li>• Stronger undue delay arguments with quantified risks</li>
            </ul>
          </div>
        )}

        {generatedDocuments.medicalReport && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Medical Report {aiApiKey && isGeneratingWithAI ? "🤖" : ""}
                </h3>
                <button
                  onClick={() =>
                    downloadDocument(
                      generatedDocuments.medicalReport,
                      `medical_report_${patientData.lastName}_${patientData.firstName}.md`,
                    )
                  }
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <Download className="inline-block w-4 h-4 mr-1" />
                  Download
                </button>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Undue Delay Letter {aiApiKey && isGeneratingWithAI ? "🤖" : ""}
                </h3>
                <button
                  onClick={() =>
                    downloadDocument(
                      generatedDocuments.undueDelayLetter,
                      `undue_delay_letter_${patientData.lastName}_${patientData.firstName}.md`,
                    )
                  }
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <Download className="inline-block w-4 h-4 mr-1" />
                  Download
                </button>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  S2 Form
                </h3>
                <button
                  onClick={() =>
                    downloadDocument(
                      generatedDocuments.s2Form,
                      `s2_form_${patientData.lastName}_${patientData.firstName}.md`,
                    )
                  }
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <Download className="inline-block w-4 h-4 mr-1" />
                  Download
                </button>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Provider Declaration
                </h3>
                <button
                  onClick={() =>
                    downloadDocument(
                      generatedDocuments.providerDeclaration,
                      `provider_declaration_${patientData.lastName}_${patientData.firstName}.md`,
                    )
                  }
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <Download className="inline-block w-4 h-4 mr-1" />
                  Download
                </button>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Template {aiApiKey && isGeneratingWithAI ? "🤖" : ""}
                </h3>
                <button
                  onClick={() =>
                    downloadDocument(
                      generatedDocuments.emailTemplate,
                      `email_template_${patientData.lastName}_${patientData.firstName}.txt`,
                    )
                  }
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <Download className="inline-block w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Preview of Generated Documents</h3>
              <div className="space-y-4">
                <details className="border rounded-lg">
                  <summary className="p-3 bg-gray-50 cursor-pointer">
                    Medical Report {aiApiKey ? "🤖 AI-Enhanced" : "📝 Standard"}
                  </summary>
                  <pre className="p-4 text-sm overflow-auto max-h-96">{generatedDocuments.medicalReport}</pre>
                </details>

                <details className="border rounded-lg">
                  <summary className="p-3 bg-gray-50 cursor-pointer">
                    Undue Delay Letter {aiApiKey ? "🤖 AI-Enhanced" : "📝 Standard"}
                  </summary>
                  <pre className="p-4 text-sm overflow-auto max-h-96">{generatedDocuments.undueDelayLetter}</pre>
                </details>

                <details className="border rounded-lg">
                  <summary className="p-3 bg-gray-50 cursor-pointer">
                    Email Template {aiApiKey ? "🤖 AI-Enhanced" : "📝 Standard"}
                  </summary>
                  <pre className="p-4 text-sm overflow-auto max-h-96">{generatedDocuments.emailTemplate}</pre>
                </details>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const tabs = [
    { id: "patient", label: "Patient", icon: User },
    { id: "medical", label: "Medical", icon: Stethoscope },
    { id: "gp", label: "GP Details", icon: User },
    { id: "treatment", label: "Treatment", icon: Calendar },
    { id: "applicant", label: "Applicant", icon: User },
    { id: "documents", label: "Documents", icon: FileText },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">S2 Application Generator - Bariatric Surgery</h1>
          <p className="text-gray-600">Automated S2 funding application system for bariatric surgery cases</p>
        </div>

        <div className="border-b">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "patient" && renderPatientForm()}
          {activeTab === "medical" && renderMedicalForm()}
          {activeTab === "gp" && renderGPForm()}
          {activeTab === "treatment" && renderTreatmentForm()}
          {activeTab === "applicant" && renderApplicantForm()}
          {activeTab === "documents" && renderDocuments()}
        </div>
      </div>
    </div>
  )
}

export default S2ApplicationGenerator
