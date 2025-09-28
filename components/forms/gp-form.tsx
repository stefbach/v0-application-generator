"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { PatientData } from "@/hooks/use-patient-data"
import { User, MapPin, Calendar } from "lucide-react"

interface GPFormProps {
  data: PatientData
  onUpdate: (field: keyof PatientData, value: any) => void
}

export function GPForm({ data, onUpdate }: GPFormProps) {
  return (
    <div className="space-y-6">
      {/* GP Details */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-primary" />
            <CardTitle>General Practitioner Information</CardTitle>
          </div>
          <CardDescription>Details of the registered NHS GP practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="medical-form-grid">
            <div className="space-y-2">
              <Label htmlFor="gpName">GP Name *</Label>
              <Input
                id="gpName"
                className="medical-input"
                value={data.gpName}
                onChange={(e) => onUpdate("gpName", e.target.value)}
                placeholder="Dr Smith"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpPractice">GP Practice Name *</Label>
              <Input
                id="gpPractice"
                className="medical-input"
                value={data.gpPractice}
                onChange={(e) => onUpdate("gpPractice", e.target.value)}
                placeholder="Engleton House Surgery"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Address */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <CardTitle>Practice Address</CardTitle>
          </div>
          <CardDescription>Full address of the NHS GP practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="gpAddress">GP Practice Address *</Label>
            <Textarea
              id="gpAddress"
              className="medical-input"
              value={data.gpAddress}
              onChange={(e) => onUpdate("gpAddress", e.target.value)}
              placeholder="2 Villa Road, Radford, Coventry, CV6 2GH"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Include full address with postcode</p>
          </div>
        </CardContent>
      </Card>

      {/* Consultation Details */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle>GP Consultation</CardTitle>
          </div>
          <CardDescription>Details of GP consultation regarding the treatment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gpConsultationDate">GP Consultation Date</Label>
              <Input
                id="gpConsultationDate"
                type="date"
                className="medical-input"
                value={data.gpConsultationDate}
                onChange={(e) => onUpdate("gpConsultationDate", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Date when you discussed the treatment with your GP</p>
            </div>

            <div className="bg-accent/10 p-4 rounded-lg">
              <h4 className="font-medium text-accent-foreground mb-2">Important Note</h4>
              <p className="text-sm text-accent-foreground">
                A GP assessment/referral is required for secondary care services (hospital treatment). You must have
                seen your NHS GP regarding the treatment you are applying for.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
