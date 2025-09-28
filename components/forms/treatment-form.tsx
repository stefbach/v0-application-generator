"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { PatientData } from "@/hooks/use-patient-data"
import { Calendar, Phone, Mail, Building } from "lucide-react"

interface TreatmentFormProps {
  data: PatientData
  onUpdate: (field: keyof PatientData, value: any) => void
}

export function TreatmentForm({ data, onUpdate }: TreatmentFormProps) {
  const calculateFollowUpDates = (treatmentDate: string) => {
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

  const formatDateForDisplay = (date: Date) => {
    return date ? date.toLocaleDateString("en-GB") : ""
  }

  const followUpDates = calculateFollowUpDates(data.treatmentDate)

  return (
    <div className="space-y-6">
      {/* Treatment Schedule */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle>Treatment Schedule</CardTitle>
          </div>
          <CardDescription>Planned surgery date and follow-up appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="treatmentDate">Planned Surgery Date *</Label>
              <Input
                id="treatmentDate"
                type="date"
                className="medical-input"
                value={data.treatmentDate}
                onChange={(e) => onUpdate("treatmentDate", e.target.value)}
              />
            </div>

            {data.treatmentDate && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-primary">Automatically Calculated Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="font-medium text-primary">Pre-operative consultation:</div>
                      <div className="text-foreground">{formatDateForDisplay(followUpDates.preOpConsultation)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-primary">Surgery date:</div>
                      <div className="text-foreground">{formatDateForDisplay(followUpDates.surgery)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-primary">1-month follow-up:</div>
                      <div className="text-foreground">{formatDateForDisplay(followUpDates.followUp1Month)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-primary">6-month follow-up:</div>
                      <div className="text-foreground">{formatDateForDisplay(followUpDates.followUp6Months)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-primary">1-year follow-up:</div>
                      <div className="text-foreground">{formatDateForDisplay(followUpDates.followUp1Year)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-primary">2-year follow-up:</div>
                      <div className="text-foreground">{formatDateForDisplay(followUpDates.followUp2Years)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hospital Information */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-primary" />
              <CardTitle>Hospital & Surgeon Details</CardTitle>
            </div>
            <Badge variant="secondary">Pre-configured</Badge>
          </div>
          <CardDescription>Treatment facility and surgeon information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="medical-form-grid">
              <div className="space-y-2">
                <Label htmlFor="hospitalName">Hospital Name</Label>
                <Input id="hospitalName" className="medical-input bg-muted" value={data.hospitalName} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="surgeonName">Surgeon Name</Label>
                <Input id="surgeonName" className="medical-input bg-muted" value={data.surgeonName} readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospitalAddress">Hospital Address</Label>
              <Textarea
                id="hospitalAddress"
                className="medical-input bg-muted"
                value={data.hospitalAddress}
                readOnly
                rows={2}
              />
            </div>

            <div className="medical-form-grid">
              <div className="space-y-2">
                <Label htmlFor="hospitalPhone">Hospital Phone</Label>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <Input id="hospitalPhone" className="medical-input bg-muted" value={data.hospitalPhone} readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospitalEmail">Hospital Email</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <Input id="hospitalEmail" className="medical-input bg-muted" value={data.hospitalEmail} readOnly />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hospital Administration */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Hospital Administration</CardTitle>
          <CardDescription>Hospital director and administrative details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-accent/10 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-accent-foreground">Director/CEO:</span>
                <span className="text-accent-foreground">{data.hospitalDirector}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-accent-foreground">Title:</span>
                <span className="text-accent-foreground">{data.hospitalDirectorTitle}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
