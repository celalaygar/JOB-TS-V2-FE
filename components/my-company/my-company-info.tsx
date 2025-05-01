"use client"

import { useLanguage } from "@/lib/i18n/context"
import { myCompanyData } from "@/data/my-company"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Mail, Phone, Globe, MapPin, Calendar } from "lucide-react"

export function MyCompanyInfo() {
  const { translations: t } = useLanguage()

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            <span>{t.myCompany.companyInfo}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.myCompany.name}</p>
            <p>{myCompanyData.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.myCompany.industry}</p>
            <p>{myCompanyData.industry}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.myCompany.description}</p>
            <p>{myCompanyData.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.myCompany.foundedYear}</p>
            <p>{myCompanyData.foundedYear}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.myCompany.employeeCount}</p>
            <p>{myCompanyData.employeeCount}</p>
          </div>
        </CardContent>
      </Card>

      {/* Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <span>{t.myCompany.communication}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.myCompany.website}</p>
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
            <p className="text-sm font-medium text-muted-foreground">{t.myCompany.email}</p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${myCompanyData.email}`} className="text-blue-600 hover:underline">
                {myCompanyData.email}
              </a>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.myCompany.phone}</p>
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
            <span>{t.myCompany.location}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.myCompany.country}</p>
            <p>{myCompanyData.location.country}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.myCompany.city}</p>
            <p>{myCompanyData.location.city}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.myCompany.district}</p>
            <p>{myCompanyData.location.district}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.myCompany.fullAddress}</p>
            <p>{myCompanyData.location.fullAddress}</p>
          </div>
        </CardContent>
      </Card>

      {/* Created Date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{t.myCompany.createdAt}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.myCompany.createdAt}</p>
            <p>{new Date(myCompanyData.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.myCompany.updatedAt}</p>
            <p>{new Date(myCompanyData.updatedAt).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
