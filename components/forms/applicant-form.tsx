"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { PatientData } from "@/hooks/use-patient-data"
import { Shield, User, Phone, Mail, MapPin } from "lucide-react"

interface ApplicantFormProps {
  data: PatientData
  onUpdate: (field: keyof PatientData, value: any) => void
}

export function ApplicantForm({ data, onUpdate }: ApplicantFormProps) {
  return (
    <div className="space-y-6">
      {/* Information Notice */}
      <Card className="medical-card border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle className="text-primary">S2 Application Representative</CardTitle>
          </div>
          <CardDescription>
            The applicant information below is pre-configured for Dr Stéphane Bach as the authorized S2 representative.
            This information is used for official NHS S2 application processing.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Applicant Details */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Applicant Information</CardTitle>
            </div>
            <Badge variant="secondary">Pre-configured</Badge>
          </div>
          <CardDescription>Authorized representative details for S2 application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="medical-form-grid">
            <div className="space-y-2">
              <Label htmlFor="applicantName">Applicant Name</Label>
              <Input id="applicantName" className="medical-input bg-muted" value={data.applicantName} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicantTitle">Professional Title</Label>
              <Input id="applicantTitle" className="medical-input bg-muted" value={data.applicantTitle} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-primary" />
            <CardTitle>Contact Information</CardTitle>
          </div>
          <CardDescription>Professional contact details for S2 correspondence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="medical-form-grid">
            <div className="space-y-2">
              <Label htmlFor="applicantPhone">Phone Number</Label>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <Input id="applicantPhone" className="medical-input bg-muted" value={data.applicantPhone} readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicantEmail">Email Address</Label>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Input id="applicantEmail" className="medical-input bg-muted" value={data.applicantEmail} readOnly />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Address */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <CardTitle>Business Address</CardTitle>
          </div>
          <CardDescription>Professional address for official correspondence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="applicantAddress">Full Business Address</Label>
            <Textarea
              id="applicantAddress"
              className="medical-input bg-muted"
              value={data.applicantAddress}
              readOnly
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legal Notice */}
      <Card className="medical-card border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-accent-foreground">Legal Authorization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-accent-foreground">
            <p>
              <strong>Authorized Representative:</strong> Dr Stéphane Bach is authorized to act as the S2 application
              representative on behalf of patients seeking bariatric surgery funding.
            </p>
            <p>
              <strong>Professional Capacity:</strong> This application is submitted in a professional medical capacity
              with appropriate patient consent and authorization.
            </p>
            <p>
              <strong>Data Protection:</strong> All patient information is handled in accordance with GDPR and NHS data
              protection requirements.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
