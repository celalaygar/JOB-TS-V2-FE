"use client"

import { useLanguage } from "@/lib/i18n/context"
import { myCompanyData } from "@/data/my-company"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Mail, Phone, Globe, MapPin, Calendar } from "lucide-react"

export function MyCompanyInfo() {
  const { translations: t } = useLanguage()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-muted rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Building className="w-6 h-6 text-primary" />
          {myCompanyData.name}
        </h1>
        <p className="mt-2 text-muted-foreground">{myCompanyData.description}</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Company Info */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building className="h-5 w-5" />
              {t.myCompany.companyInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Info label={t.myCompany.name} value={myCompanyData.name} />
            <Info label={t.myCompany.industry} value={myCompanyData.industry} />
            <Info label={t.myCompany.foundedYear} value={myCompanyData.foundedYear} />
            <Info label={t.myCompany.employeeCount} value={myCompanyData.employeeCount} />
          </CardContent>
        </Card>

        {/* Communication */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-5 w-5" />
              {t.myCompany.communication}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Info
              label={t.myCompany.website}
              value={
                <a
                  href={`https://${myCompanyData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {myCompanyData.website}
                </a>
              }
              icon={<Globe className="h-4 w-4" />}
            />
            <Info
              label={t.myCompany.email}
              value={
                <a href={`mailto:${myCompanyData.email}`} className="text-blue-600 hover:underline">
                  {myCompanyData.email}
                </a>
              }
              icon={<Mail className="h-4 w-4" />}
            />
            <Info
              label={t.myCompany.phone}
              value={
                <a href={`tel:${myCompanyData.phone}`} className="text-blue-600 hover:underline">
                  {myCompanyData.phone}
                </a>
              }
              icon={<Phone className="h-4 w-4" />}
            />
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-5 w-5" />
              {t.myCompany.location}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Info label={t.myCompany.country} value={myCompanyData.location.country} />
            <Info label={t.myCompany.city} value={myCompanyData.location.city} />
            <Info label={t.myCompany.district} value={myCompanyData.location.district} />
            <Info label={t.myCompany.fullAddress} value={myCompanyData.location.fullAddress} />
          </CardContent>
        </Card>

        {/* Created / Updated */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5" />
              {t.myCompany.createdAt}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Info label={t.myCompany.createdAt} value={new Date(myCompanyData.createdAt).toLocaleDateString()} />
            <Info label={t.myCompany.updatedAt} value={new Date(myCompanyData.updatedAt).toLocaleDateString()} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Info({
  label,
  value,
  icon,
}: {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="flex items-center gap-2">{icon} {value}</span>
    </div>
  )
}
