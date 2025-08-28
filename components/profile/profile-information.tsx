"use client";

import type React from "react";
import { useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Loader2, Upload, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/lib/i18n/context";
import { useAuthUser, useUpdateAuthUser } from "@/lib/hooks/useAuthUser";
import { updateMyInformationHelper } from "@/lib/service/helper/user-helper";
import { RegisterRequest, UserDto } from "@/types/user";

// Form verileri için state tipi
interface ProfileFormState {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  position?: string;
  department?: string;
  company: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export function ProfileInformation() {
  const { translations } = useLanguage();
  const t = translations.profile.information;
  const authUser = useAuthUser();
  const user = authUser?.user;
  const updateAuthUser = useUpdateAuthUser(); // Yeni hook'u çağırın
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileFormState>>({});
  const [formData, setFormData] = useState<ProfileFormState>({
    username: user?.username || "",
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
    gender: user?.gender || "",
    position: user?.position || "",
    department: user?.department || "",
    company: user?.company || "",
  });

  const departmentOptions: SelectOption[] = useMemo(
    () => [
      { value: "ENGINEERING", label: t.departmentOptions.engineering },
      { value: "PRODUCT", label: t.departmentOptions.product },
      { value: "DESIGN", label: t.departmentOptions.design },
      { value: "MARKETING", label: t.departmentOptions.marketing },
      { value: "SALES", label: t.departmentOptions.sales },
      { value: "SUPPORT", label: t.departmentOptions.support },
      { value: "HR", label: t.departmentOptions.hr },
      { value: "FINANCE", label: t.departmentOptions.finance },
      { value: "OPERATIONS", label: t.departmentOptions.operations },
      { value: "OTHER", label: t.departmentOptions.other },
    ],
    [t.departmentOptions]
  );

  const genderOptions: SelectOption[] = useMemo(
    () => [
      { value: "male", label: t.genderOptions.male },
      { value: "female", label: t.genderOptions.female },
      { value: "non-binary", label: t.genderOptions.nonBinary },
      { value: "other", label: t.genderOptions.other },
      { value: "prefer-not-to-say", label: t.genderOptions.preferNotToSay },
    ],
    [t.genderOptions]
  );

  const handleChange = useCallback((field: keyof ProfileFormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = () => {
    const newErrors: Partial<ProfileFormState> = {};
    if (!formData.firstname || formData.firstname.length < 2) {
      newErrors.firstname = "First name must be at least 2 characters.";
    }
    if (!formData.lastname || formData.lastname.length < 2) {
      newErrors.lastname = "Last name must be at least 2 characters.";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      });
      return;
    }

    let body: RegisterRequest = {

      username: formData.username,
      firstname: formData.firstname,
      lastname: formData.lastname,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      department: formData.department,
      company: formData.company,
      position: formData.position
    }
    try {
      const response: UserDto | null = await updateMyInformationHelper(body, { setLoading });

      if (!!response) {

        // Backend'den gelen UserDto ile NextAuth session'ını güncelle
        await updateAuthUser(response);
      }


      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
    } catch (error) {
      console.error("Profile update failed:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }

  };

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.target?.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAvatar(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {
            loading ?
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              </div>
              :
              <>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      {avatar ? (
                        <AvatarImage src={avatar || "/placeholder.svg"} alt={user?.name} />
                      ) : (
                        <AvatarFallback className="text-4xl">
                          {formData.firstname?.[0]?.toUpperCase() || ""}
                          {formData.lastname?.[0]?.toUpperCase() || ""}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" className="relative" disabled={isUploading}>
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            {t.upload}
                            <Input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={handleAvatarUpload}
                            />
                          </>
                        )}
                      </Button>

                      {avatar && (
                        <Button type="button" variant="outline" size="sm" onClick={removeAvatar}>
                          <X className="h-4 w-4 mr-2" />
                          {t.remove}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Firstname */}
                      <div className="space-y-2">
                        <Label htmlFor="firstname">{t.firstname}</Label>
                        <Input
                          id="firstname"
                          placeholder="Enter your first name"
                          value={formData.firstname}
                          onChange={(e) => handleChange("firstname", e.target.value)}
                        />
                        {errors.firstname && <p className="text-sm font-medium text-destructive">{errors.firstname}</p>}
                      </div>

                      {/* Lastname */}
                      <div className="space-y-2">
                        <Label htmlFor="lastname">{t.lastname}</Label>
                        <Input
                          id="lastname"
                          placeholder="Enter your last name"
                          value={formData.lastname}
                          onChange={(e) => handleChange("lastname", e.target.value)}
                        />
                        {errors.lastname && <p className="text-sm font-medium text-destructive">{errors.lastname}</p>}
                      </div>
                      {/* Username */}
                      <div className="space-y-2">
                        <Label htmlFor="lastname">{t.username}</Label>
                        <Input
                          id="username"
                          placeholder="Enter your last name"
                          value={formData.username}
                          onChange={(e) => handleChange("username", e.target.value)}
                        />
                        {errors.username && <p className="text-sm font-medium text-destructive">{errors.username}</p>}
                      </div>


                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.email}</Label>
                        <Input
                          id="email"
                          disabled={true}
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                        />
                        {errors.email && <p className="text-sm font-medium text-destructive">{errors.email}</p>}
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t.phone}</Label>
                        <Input
                          id="phone"
                          placeholder="Enter your phone number"
                          value={formData.phone || ""}
                          onChange={(e) => handleChange("phone", e.target.value)}
                        />
                      </div>

                      {/* Date of Birth */}
                      {/* Date of Birth */}
                      {/* Date of Birth */}
                      <div className="space-y-2">
                        <Label htmlFor="dob">{t.dob}</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData.dateOfBirth ? formData.dateOfBirth.toISOString().split("T")[0] : ""}
                          onChange={(e) => handleChange("dateOfBirth", e.target.value ? new Date(e.target.value) : undefined)}
                          max={new Date().toISOString().split("T")[0]} // gelecekteki tarihleri engelle
                          className={errors.dateOfBirth
                            ? "border-[var(--fixed-danger)]"
                            : "border-[var(--fixed-card-border)]"}
                        />
                        {errors.dateOfBirth && (
                          <p className="text-sm font-medium text-destructive">
                            {errors.dateOfBirth}
                          </p>
                        )}
                      </div>



                      {/* Gender with React Select */}
                      <div className="space-y-2">
                        <Label htmlFor="gender">{t.gender}</Label>
                        <Select
                          id="gender"
                          options={genderOptions}
                          value={genderOptions.find((option) => option.value === formData.gender)}
                          onChange={(option) => handleChange("gender", option?.value)}
                          placeholder={t.selectGender}
                        />
                      </div>

                      {/* Position */}
                      <div className="space-y-2">
                        <Label htmlFor="position">{t.position}</Label>
                        <Input
                          id="position"
                          placeholder="Enter your job title"
                          value={formData.position || ""}
                          onChange={(e) => handleChange("position", e.target.value)}
                        />
                      </div>

                      {/* Department with React Select */}
                      <div className="space-y-2">
                        <Label htmlFor="department">{t.department}</Label>
                        <Select
                          id="department"
                          options={departmentOptions}
                          value={departmentOptions.find((option) => option.value === formData.department)}
                          onChange={(option) => handleChange("department", option?.value)}
                          placeholder={t.selectDepartment}
                        />
                      </div>

                      {/* Company */}
                      <div className="space-y-2">
                        <Label htmlFor="company">{t.company}</Label>
                        <Input
                          id="company"
                          placeholder="Company name"
                          value={formData.company}
                          onChange={(e) => handleChange("company", e.target.value)}
                          readOnly
                        />
                        <p className="text-sm text-muted-foreground">{t.companyDescription}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
          }
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t.saveChanges}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}