"use client"

import { myCompanyData } from "@/data/my-company"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Mail, Phone, Globe, MapPin, Calendar } from "lucide-react"
import { en } from "@/lib/i18n/translations"

export function MyCompanyInfo() {
  // Use the English translations directly
  const t = en.myCompany

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            <span>{t.companyInfo}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.name}</p>
            <p>{myCompanyData.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.industry}</p>
            <p>{myCompanyData.industry}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.description}</p>
            <p>{myCompanyData.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.foundedYear}</p>
            <p>{myCompanyData.foundedYear}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.employeeCount}</p>
            <p>{myCompanyData.employeeCount}</p>
          </div>
        </CardContent>
      </Card>

      {/* Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <span>{t.communication}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.website}</p>
            <p className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <a
                href={`https://${myCompanyData.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {myCompanyData.website}
              </a>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.email}</p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${myCompanyData.email}`} className="text-blue-600 hover:underline">
                {myCompanyData.email}
              </a>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.phone}</p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href={`tel:${myCompanyData.phone}`} className="text-blue-600 hover:underline">
                {myCompanyData.phone}
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>{t.location}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.country}</p>
            <p>{myCompanyData.location.country}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.city}</p>
            <p>{myCompanyData.location.city}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.district}</p>
            <p>{myCompanyData.location.district}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.fullAddress}</p>
            <p>{myCompanyData.location.fullAddress}</p>
          </div>
        </CardContent>
      </Card>

      {/* Created Date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{t.createdAt}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.createdAt}</p>
            <p>{new Date(myCompanyData.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.updatedAt}</p>
            <p>{new Date(myCompanyData.updatedAt).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
