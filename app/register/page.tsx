"use client"

import type React from "react"
import { useState, useMemo } from "react" // useMemo'yu ekledik
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import Select from "react-select" // React Select'i import ettik
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Loader2, Calendar } from "lucide-react"
import { register, clearError } from "@/lib/redux/features/auth-slice"
import { useLanguage } from "@/lib/i18n/context"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Select as SelectShad, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BaseService from "@/lib/service/BaseService"
import { toast } from "@/hooks/use-toast"
import { REGISTER } from "@/lib/service/BasePath"
import { cn } from "@/lib/utils"; // cn utility'sini import ettik

interface SelectOption {
  value: string;
  label: string;
}

export default function RegisterPage() {
  const { language, translations, setLanguage } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state: any) => state.auth)
  const [loadingForm, setLoadingForm] = useState(false)
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: undefined as Date | undefined,
    gender: "", // Başlangıç değeri boş string
    department: "", // Yeni alan
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Gender ve Department seçeneklerini useMemo ile tanımlıyoruz
  const genderOptions: SelectOption[] = useMemo(
    () => [
      { value: "male", label: translations.register.genderOptions.male },
      { value: "female", label: translations.register.genderOptions.female },
      { value: "non-binary", label: translations.register.genderOptions.nonBinary },
      { value: "other", label: translations.register.genderOptions.other },
      { value: "prefer-not-to-say", label: translations.register.genderOptions.preferNotToSay },
    ],
    [translations.register.genderOptions]
  );

  const departmentOptions: SelectOption[] = useMemo(
    () => [
      { value: "ENGINEERING", label: translations.register.departmentOptions.engineering },
      { value: "PRODUCT", label: translations.register.departmentOptions.product },
      { value: "DESIGN", label: translations.register.departmentOptions.design },
      { value: "MARKETING", label: translations.register.departmentOptions.marketing },
      { value: "SALES", label: translations.register.departmentOptions.sales },
      { value: "SUPPORT", label: translations.register.departmentOptions.support },
      { value: "HR", label: translations.register.departmentOptions.hr },
      { value: "FINANCE", label: translations.register.departmentOptions.finance },
      { value: "OPERATIONS", label: translations.register.departmentOptions.operations },
      { value: "OTHER", label: translations.register.departmentOptions.other },
    ],
    [translations.register.departmentOptions]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    if (error) {
      dispatch(clearError())
    }
  }

  // Select bileşenleri için ortak bir handleChange fonksiyonu
  const handleSelectChange = (field: "gender" | "department", option: SelectOption | null) => {
    setFormData((prev) => ({ ...prev, [field]: option?.value || "" }))
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }))
    if (formErrors.dateOfBirth) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.dateOfBirth
        return newErrors
      })
    }
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value as "en" | "tr")
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.firstname.trim()) { errors.firstname = translations.register.errors.firstNameRequired }
    if (!formData.lastname.trim()) { errors.lastname = translations.register.errors.lastNameRequired }
    if (!formData.username.trim()) { errors.username = translations.register.errors.usernameRequired }
    if (!formData.email.trim()) { errors.email = translations.register.errors.emailRequired }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) { errors.email = translations.register.errors.emailInvalid }

    if (!formData.dateOfBirth) { errors.dateOfBirth = translations.register.errors.dateRequired }
    if (!formData.password) { errors.password = translations.register.errors.passwordRequired }
    else if (formData.password.length < 6) { errors.password = translations.register.errors.passwordLength }
    if (formData.password !== formData.confirmPassword) { errors.confirmPassword = translations.register.errors.passwordsMatch }

    // Yeni validasyonlar
    if (!formData.gender) { errors.gender = translations.register.errors.genderRequired; }
    if (!formData.department) { errors.department = translations.register.errors.departmentRequired; }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingForm(true)
    if (validateForm()) {
      try {
        const response = await BaseService.request(REGISTER, {
          method: 'POST',
          body: formData,
        });
        console.log('Register success:', response);
        toast({
          title: "Register success:" + response,
          description: `Register ${formData.email} success.`,
        })
        resetInputs();
      } catch (error: any) {
        if (error.status === 400 && error.message) {
          toast({
            title: `Register ${formData.email} failed.`,
            description: error.message,
            variant: "destructive",
          })
          console.error('Register failed with 400:', error.message);
        } else {
          console.error('Register failed:', error);
        }
      }
    }
    setLoadingForm(false)
  }

  const resetInputs = () => {
    setFormData({
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      dateOfBirth: undefined,
      gender: "",
      department: "",
    });
    setFormErrors({});
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--fixed-background)] p-4">
      <div className="w-full max-w-2xl">
        <div className="relative mb-8">
          <div className="text-center logoDiv">
            <Link href="/" className="inline-flex items-center text-2xl font-bold text-[var(--fixed-primary)]">
              <Home className="mr-2 h-6 w-6" />
              Issue Tracker
            </Link>
            <p className="text-[var(--fixed-sidebar-muted)] mt-2">{translations.register.subtitle}</p>
          </div>

          <div className=" mt-4 sm:mt-2 flex justify-center sm:absolute sm:top-0 sm:right-0 languageDiv" >
            <SelectShad value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <div className="flex items-center">
                    <span className="mr-2">🇺🇸</span> English
                  </div>
                </SelectItem>
                <SelectItem value="tr">
                  <div className="flex items-center">
                    <span className="mr-2">🇹🇷</span> Türkçe
                  </div>
                </SelectItem>
              </SelectContent>
            </SelectShad>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{translations.register.title}</CardTitle>
            <CardDescription>{translations.register.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstname">{translations.register.firstNameLabel}</Label>
                    <Input
                      id="firstname"
                      name="firstname"
                      type="text"
                      placeholder={translations.register.firstNamePlaceholder}
                      value={formData.firstname}
                      onChange={handleChange}
                      className={formErrors.firstname ? "border-red-500" : ""}
                    />
                    {formErrors.firstname && <p className="text-red-500 text-xs mt-1">{formErrors.firstname}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="lastname">{translations.register.lastNameLabel}</Label>
                    <Input
                      id="lastname"
                      name="lastname"
                      type="text"
                      placeholder={translations.register.lastNamePlaceholder}
                      value={formData.lastname}
                      onChange={handleChange}
                      className={formErrors.lastname ? "border-red-500" : ""}
                    />
                    {formErrors.lastname && <p className="text-red-500 text-xs mt-1">{formErrors.lastname}</p>}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">{translations.register.usernameLabel}</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder={translations.register.usernamePlaceholder}
                    value={formData.username}
                    onChange={handleChange}
                    className={formErrors.username ? "border-red-500" : ""}
                  />
                  {formErrors.username && <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">{translations.register.emailLabel}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={translations.register.emailPlaceholder}
                    value={formData.email}
                    onChange={handleChange}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">{translations.register.phoneLabel}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={translations.register.phonePlaceholder}
                    value={formData.phone}
                    onChange={handleChange}
                    className={formErrors.phone ? "border-red-500" : ""}
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date of Birth */}
                  <div className="grid gap-2">
                    <Label htmlFor="dateOfBirth">{translations.register.dateOfBirthLabel}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !formData.dateOfBirth && "text-muted-foreground",
                            formErrors.dateOfBirth && "border-red-500"
                          )}
                        >
                          {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : <span>{translations.register.pickDatePlaceholder}</span>}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={formData.dateOfBirth}
                          onSelect={handleDateChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {formErrors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{formErrors.dateOfBirth}</p>}
                  </div>

                  {/* Gender */}
                  <div className="grid gap-2">
                    <Label htmlFor="gender">{translations.register.genderLabel}</Label>
                    <Select
                      id="gender"
                      options={genderOptions}
                      value={genderOptions.find((option) => option.value === formData.gender)}
                      onChange={(option) => handleSelectChange("gender", option)}
                      placeholder={translations.register.selectGenderPlaceholder}
                      className={formErrors.gender ? "border-red-500" : ""}
                    />
                    {formErrors.gender && <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>}
                  </div>

                  {/* Department */}
                  <div className="grid gap-2">
                    <Label htmlFor="department">{translations.register.department}</Label>
                    <Select
                      id="department"
                      options={departmentOptions}
                      value={departmentOptions.find((option) => option.value === formData.department)}
                      onChange={(option) => handleSelectChange("department", option)}
                      placeholder={translations.register.selectDepartment}
                      className={formErrors.department ? "border-red-500" : ""}
                    />
                    {formErrors.department && <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">{translations.register.passwordLabel}</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={formErrors.password ? "border-red-500" : ""}
                  />
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">{translations.register.confirmPasswordLabel}</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={formErrors.confirmPassword ? "border-red-500" : ""}
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 p-3 rounded-md border border-red-200">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loadingForm}>
                  {loadingForm ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {translations.register.processingButton}
                    </>
                  ) : (
                    translations.register.submitButton
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-[var(--fixed-sidebar-muted)]">
              {translations.register.haveAccount}{" "}
              <Link href="/" className="text-[var(--fixed-primary)] font-medium">
                {translations.register.signIn}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}