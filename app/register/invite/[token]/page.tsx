"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { Loader2, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

import { clearError } from "@/lib/redux/features/auth-slice";
import { useLanguage } from "@/lib/i18n/context";
import BaseService from "@/lib/service/BaseService";
import { REGISTER_WITH_TOKEN, VALIDATE_INVITATION_TOKEN } from "@/lib/service/BasePath";
import { httpMethods } from "@/lib/service/HttpService";

// Helper interfaces and types
interface SelectOption {
  value: string;
  label: string;
}

interface ValidateTokenResponse {
  valid: boolean;
  token: string;
  invitedUserEmail: string;
  message: string;
}

export default function RegisterPage() {
  const params = useParams();
  const token = params.token as string;
  const { language, translations, setLanguage } = useLanguage();
  const dispatch = useDispatch();
  const { loading: reduxLoading, error: reduxError } = useSelector((state: any) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: undefined as Date | undefined,
    gender: "MALE", // Java enum'una uygun başlangıç değeri
    department: "ENGINEERING", // Java enum'una uygun başlangıç değeri
    token: token,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Cinsiyet ve Departman seçeneklerini Java enum'larına göre düzenledim
  const genderOptions: SelectOption[] = useMemo(
    () => [
      { value: "MALE", label: translations.register.genderOptions.male },
      { value: "FEMALE", label: translations.register.genderOptions.female },
      { value: "NON_BINARY", label: translations.register.genderOptions.nonBinary },
      { value: "OTHER", label: translations.register.genderOptions.other },
      { value: "PREFER_NOT_TO_SAY", label: translations.register.genderOptions.preferNotToSay },
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

  // Fonksiyonları useCallback ile sarmalamak, performans optimizasyonu sağlar
  const controlToken = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: ValidateTokenResponse | null = await BaseService.request(VALIDATE_INVITATION_TOKEN, {
        method: httpMethods.POST,
        body: { token },
      });

      if (response?.valid && response.invitedUserEmail) {
        setFormData((prev) => ({ ...prev, email: response.invitedUserEmail }));
        setIsTokenValid(true);
        toast({
          title: "Token Geçerli",
          description: "Davet linki başarıyla doğrulandı. Lütfen kayıt işlemini tamamlayın.",
        });
      } else {
        setIsTokenValid(false);
        toast({
          title: "Token Geçersiz",
          description: "Davet linki geçersiz veya süresi dolmuş.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setIsTokenValid(false);
      const errorMessage = error.message || "Token doğrulaması sırasında bir hata oluştu.";
      toast({
        title: "Doğrulama Hatası",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    controlToken();
  }, [controlToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    if (reduxError) {
      dispatch(clearError());
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (dateString: string) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: dateString ? new Date(dateString) : undefined }));
    if (formErrors.dateOfBirth) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.dateOfBirth;
        return newErrors;
      });
    }
  };

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!formData.firstname.trim()) errors.firstname = translations.register.errors.firstNameRequired;
    if (!formData.lastname.trim()) errors.lastname = translations.register.errors.lastNameRequired;
    if (!formData.username.trim()) errors.username = translations.register.errors.usernameRequired;
    if (!formData.email.trim()) errors.email = translations.register.errors.emailRequired;
    if (!formData.password) errors.password = translations.register.errors.passwordRequired;
    if (formData.password.length < 6) errors.password = translations.register.errors.passwordLength;
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = translations.register.errors.passwordsMatch;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, translations.register.errors]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isTokenValid) {
        toast({
          title: "İşlem Başarısız",
          description: "Lütfen önce tokenin geçerli olduğundan emin olun.",
          variant: "destructive",
        });
        return;
      }

      if (validateForm()) {
        setIsLoading(true);
        try {
          const payload = { ...formData, token };
          await BaseService.request(REGISTER_WITH_TOKEN, {
            method: httpMethods.POST,
            body: payload,
          });
          toast({
            title: "Kayıt Başarılı",
            description: `${formData.email} kullanıcısı başarıyla kaydedildi.`,
          });
          setFormData({
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            dateOfBirth: undefined,
            gender: "MALE",
            department: "ENGINEERING",
            token: token,
          });
          setFormErrors({});
        } catch (error: any) {
          const errorMessage = error.message || "Kayıt işlemi sırasında bir hata oluştu.";
          toast({
            title: "Kayıt Başarısız",
            description: errorMessage,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    },
    [validateForm, isTokenValid, formData, token]
  );

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
          <div className="mt-4 sm:mt-2 flex justify-center sm:absolute sm:top-0 sm:right-0 languageDiv">
            <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "tr")}>
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
            </Select>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{translations.register.title}</CardTitle>
            <CardDescription>{translations.register.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
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
                      disabled={true}
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
                  <div className="grid gap-2">
                    <Label htmlFor="dateOfBirth">{translations.register.dateOfBirthLabel}</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth ? format(formData.dateOfBirth, "yyyy-MM-dd") : ""}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className={formErrors.dateOfBirth ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
                    />
                    {formErrors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{formErrors.dateOfBirth}</p>}
                  </div>
                  {/* Yeni eklenen yan yana inputlar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="gender">{translations.register.genderLabel}</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={translations.register.genderPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="department">{translations.register.department}</Label>
                      <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={translations.register.selectDepartment} />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Yan yana inputların sonu */}
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
                  {reduxError && (
                    <div className="bg-red-50 p-3 rounded-md border border-red-200">
                      <p className="text-red-600 text-sm">{reduxError}</p>
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading || !isTokenValid}>
                    {isLoading ? (
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
            )}
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
  );
}