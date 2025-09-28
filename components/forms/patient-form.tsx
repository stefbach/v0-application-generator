"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { PatientData } from "@/hooks/use-patient-data"
import { User, Phone, MapPin } from "lucide-react"

interface PatientFormProps {
  data: PatientData
  onUpdate: (field: keyof PatientData, value: any) => void
}

export function PatientForm({ data, onUpdate }: PatientFormProps) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-primary" />
            <CardTitle>Personal Information</CardTitle>
          </div>
          <CardDescription>Basic patient identification and demographic details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="medical-form-grid">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                className="medical-input"
                value={data.firstName}
                onChange={(e) => onUpdate("firstName", e.target.value)}
                placeholder="Enter first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                className="medical-input"
                value={data.lastName}
                onChange={(e) => onUpdate("lastName", e.target.value)}
                placeholder="Enter last name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                className="medical-input"
                value={data.dateOfBirth}
                onChange={(e) => onUpdate("dateOfBirth", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sex *</Label>
              <Select value={data.sex} onValueChange={(value) => onUpdate("sex", value)}>
                <SelectTrigger className="medical-input">
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NHS Information */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>NHS Information</CardTitle>
          <CardDescription>NHS number and National Insurance details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="medical-form-grid">
            <div className="space-y-2">
              <Label htmlFor="nhsNumber">NHS Number *</Label>
              <Input
                id="nhsNumber"
                className="medical-input"
                value={data.nhsNumber}
                onChange={(e) => onUpdate("nhsNumber", e.target.value)}
                placeholder="123 456 7890"
                maxLength={12}
              />
              <p className="text-xs text-muted-foreground">Format: 3-3-4 digits (e.g., 123 456 7890)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalInsurance">National Insurance Number</Label>
              <Input
                id="nationalInsurance"
                className="medical-input"
                value={data.nationalInsurance}
                onChange={(e) => onUpdate("nationalInsurance", e.target.value)}
                placeholder="AB123456C"
                maxLength={9}
              />
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
          <CardDescription>Phone number and email address for communication</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="medical-form-grid">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                className="medical-input"
                value={data.phone}
                onChange={(e) => onUpdate("phone", e.target.value)}
                placeholder="+44 7XXX XXXXXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                className="medical-input"
                value={data.email}
                onChange={(e) => onUpdate("email", e.target.value)}
                placeholder="patient@example.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <CardTitle>Address Information</CardTitle>
          </div>
          <CardDescription>Permanent residence address in England</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Full Address *</Label>
              <Textarea
                id="address"
                className="medical-input"
                value={data.address}
                onChange={(e) => onUpdate("address", e.target.value)}
                placeholder="Enter full address including house number, street name, city"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode *</Label>
              <Input
                id="postcode"
                className="medical-input w-full md:w-48"
                value={data.postcode}
                onChange={(e) => onUpdate("postcode", e.target.value.toUpperCase())}
                placeholder="SW1A 1AA"
                maxLength={8}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
