"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { PatientData } from "@/hooks/use-patient-data"
import { Stethoscope, Plus, Minus, Calculator, Pill, Activity } from "lucide-react"

interface MedicalFormProps {
  data: PatientData
  onUpdate: (field: keyof PatientData, value: any) => void
}

// Standard medication dosages database
const standardDosages: Record<string, string> = {
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

  // Mental Health
  Sertraline: "50-200 mg once daily",
  Citalopram: "20-40 mg once daily",
  Fluoxetine: "20-60 mg once daily",
  Amitriptyline: "10-75 mg once daily at bedtime",

  // Gastrointestinal
  Omeprazole: "20-40 mg once daily before food",
  Lansoprazole: "15-30 mg once daily before food",
}

export function MedicalForm({ data, onUpdate }: MedicalFormProps) {
  const handleArrayChange = (field: keyof PatientData, index: number, value: string) => {
    const currentArray = data[field] as string[]
    const newArray = currentArray.map((item, i) => (i === index ? value : item))
    onUpdate(field, newArray)
  }

  const addArrayItem = (field: keyof PatientData) => {
    const currentArray = data[field] as string[]
    onUpdate(field, [...currentArray, ""])
  }

  const removeArrayItem = (field: keyof PatientData, index: number) => {
    const currentArray = data[field] as string[]
    onUpdate(
      field,
      currentArray.filter((_, i) => i !== index),
    )
  }

  const getMedicationWithDosage = (medicationName: string) => {
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

    return trimmedName
  }

  const handleMedicationChange = (index: number, value: string) => {
    const medicationWithDosage = getMedicationWithDosage(value)
    handleArrayChange("medications", index, medicationWithDosage)
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "bg-blue-500" }
    if (bmi < 25) return { category: "Normal", color: "bg-green-500" }
    if (bmi < 30) return { category: "Overweight", color: "bg-yellow-500" }
    if (bmi < 35) return { category: "Obese Class I", color: "bg-orange-500" }
    if (bmi < 40) return { category: "Obese Class II", color: "bg-red-500" }
    return { category: "Obese Class III (Morbid)", color: "bg-red-700" }
  }

  const bmiValue = Number.parseFloat(data.bmi)
  const bmiInfo = bmiValue ? getBMICategory(bmiValue) : null

  return (
    <div className="space-y-6">
      {/* Physical Measurements */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-primary" />
            <CardTitle>Physical Measurements</CardTitle>
          </div>
          <CardDescription>Height, weight, and BMI calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="medical-form-grid">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm) *</Label>
              <Input
                id="height"
                type="number"
                className="medical-input"
                value={data.height}
                onChange={(e) => onUpdate("height", e.target.value)}
                placeholder="170"
                min="100"
                max="250"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                className="medical-input"
                value={data.weight}
                onChange={(e) => onUpdate("weight", e.target.value)}
                placeholder="80"
                min="30"
                max="300"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bmi">BMI</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="bmi"
                  className="medical-input bg-muted"
                  value={data.bmi}
                  readOnly
                  placeholder="Calculated automatically"
                />
                {bmiInfo && <Badge className={`${bmiInfo.color} text-white`}>{bmiInfo.category}</Badge>}
              </div>
              {bmiValue && (
                <p className="text-xs text-muted-foreground">BMI automatically calculated from height and weight</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis and Procedure */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            <CardTitle>Diagnosis & Treatment Plan</CardTitle>
          </div>
          <CardDescription>Primary diagnosis and planned surgical intervention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Primary Diagnosis *</Label>
              <Input
                id="diagnosis"
                className="medical-input"
                value={data.diagnosis}
                onChange={(e) => onUpdate("diagnosis", e.target.value)}
                placeholder="e.g., Morbid obesity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="surgicalProcedure">Planned Surgical Procedure *</Label>
              <Select value={data.surgicalProcedure} onValueChange={(value) => onUpdate("surgicalProcedure", value)}>
                <SelectTrigger className="medical-input">
                  <SelectValue placeholder="Select procedure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sleeve gastrectomy">Sleeve gastrectomy</SelectItem>
                  <SelectItem value="Gastric bypass">Gastric bypass (Roux-en-Y)</SelectItem>
                  <SelectItem value="Gastric band">Adjustable gastric band</SelectItem>
                  <SelectItem value="Duodenal switch">Duodenal switch</SelectItem>
                  <SelectItem value="Mini gastric bypass">Mini gastric bypass</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comorbidities */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle>Comorbidities</CardTitle>
          </div>
          <CardDescription>Associated medical conditions and complications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.comorbidities.map((condition, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  className="medical-input flex-1"
                  value={condition}
                  onChange={(e) => handleArrayChange("comorbidities", index, e.target.value)}
                  placeholder="e.g., Type 2 diabetes, Hypertension, Sleep apnea"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem("comorbidities", index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addArrayItem("comorbidities")} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Comorbidity
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Pill className="w-5 h-5 text-primary" />
            <CardTitle>Current Medications</CardTitle>
          </div>
          <CardDescription>List all current medications with dosages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-accent/10 p-4 rounded-lg">
              <p className="text-sm text-accent-foreground">
                <strong>💡 Smart Dosage Feature:</strong> Just type the medication name (e.g., "Metformin",
                "Gabapentin") and the standard dosage will be added automatically!
              </p>
            </div>

            <div className="space-y-3">
              {data.medications.map((medication, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    className="medical-input flex-1"
                    value={medication}
                    onChange={(e) => handleMedicationChange(index, e.target.value)}
                    placeholder="e.g., Metformin (dosage will be added automatically)"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("medications", index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => addArrayItem("medications")} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatment History */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Conservative Treatment History</CardTitle>
          <CardDescription>Previous weight loss attempts and medical interventions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="treatmentHistory">Treatment History</Label>
            <Textarea
              id="treatmentHistory"
              className="medical-input"
              value={data.treatmentHistory}
              onChange={(e) => onUpdate("treatmentHistory", e.target.value)}
              placeholder="Describe previous weight loss attempts, dietary interventions, medical follow-up, specialist consultations, etc."
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Include details about diet programs, exercise regimens, medications tried, specialist referrals, and
              duration of each intervention.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
