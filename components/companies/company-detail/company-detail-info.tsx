"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Mail, Phone, MapPin, Calendar, Power, PowerOff, Globe, MapPinned } from "lucide-react"
import { CompanyUsersList } from "./company-users-list"

interface CompanyDetailInfoProps {
  company: any
  onActivate?: () => void
  onDeactivate?: () => void
  onAddUser?: () => void
  initialTab?: string
  hideTabNavigation?: boolean
}

export function CompanyDetailInfo({
  company,
  onActivate,
  onDeactivate,
  onAddUser,
  initialTab = "basic-info",
  hideTabNavigation = false,
}: CompanyDetailInfoProps) {
  const { translations } = useLanguage()
  const [activeTab, setActiveTab] = useState(initialTab)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const renderBasicInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="mr-2 h-5 w-5" />
          {translations.companies?.companyInfo}
        </CardTitle>
        <CardDescription>{translations.companies?.companyInfoDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{translations.companies?.companyName}</p>
            <p className="font-medium">{company.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{translations.companies?.companyStatus}</p>
            <div>
              {company.status === "active" ? (
                <Badge className="bg-green-500">{translations.companies?.status.active}</Badge>
              ) : (
                <Badge className="bg-gray-500">{translations.companies?.status.inactive}</Badge>
              )}

              {company.status === "active" ? (
                <Button variant="outline" size="sm" className="ml-2" onClick={onDeactivate}>
                  <PowerOff className="mr-2 h-4 w-4" />
                  {translations.companies?.deactivate}
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="ml-2" onClick={onActivate}>
                  <Power className="mr-2 h-4 w-4" />
                  {translations.companies?.activate}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{translations.companies?.companyEmail}</p>
            <p className="font-medium flex items-center">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              {company.email}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{translations.companies?.companyPhone}</p>
            <p className="font-medium flex items-center">
              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
              {company.phone}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{translations.companies?.companyWebsite}</p>
          <p className="font-medium flex items-center">
            <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
            {company.website || "N/A"}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{translations.companies?.companyAddress}</p>
          <p className="font-medium flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            {company.address}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{translations.companies?.country || "Country"}</p>
            <p className="font-medium flex items-center">
              <MapPinned className="mr-2 h-4 w-4 text-muted-foreground" />
              {company.country || "N/A"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{translations.companies?.city || "City"}</p>
            <p className="font-medium">{company.city || "N/A"}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {translations.companies?.district || "District"}
            </p>
            <p className="font-medium">{company.district || "N/A"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{translations.companies?.createdAt}</p>
            <p className="font-medium flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              {formatDate(company.createdAt)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{translations.companies?.updatedAt}</p>
            <p className="font-medium flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              {formatDate(company.updatedAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (hideTabNavigation) {
    return activeTab === "basic-info" ? (
      renderBasicInfo()
    ) : (
      <CompanyUsersList companyId={company.id} onAddUser={onAddUser} />
    )
  }

  return (
    <Tabs defaultValue={initialTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full md:w-[400px] grid-cols-2">
        <TabsTrigger value="basic-info">{translations.companies?.basicInfo}</TabsTrigger>
        <TabsTrigger value="company-employees">{translations.companies?.companyEmployees}</TabsTrigger>
      </TabsList>

      <TabsContent value="basic-info" className="space-y-4 mt-4">
        {renderBasicInfo()}
      </TabsContent>

      <TabsContent value="company-employees" className="space-y-4 mt-4">
        <CompanyUsersList companyId={company.id} onAddUser={onAddUser} />
      </TabsContent>
    </Tabs>
  )
}
