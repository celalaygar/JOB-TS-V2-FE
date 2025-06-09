"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Upload, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateUser } from "@/lib/redux/features/users-slice"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/context"

const profileFormSchema = z.object({
  firstname: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastname: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  dob: z.date().optional(),
  gender: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  company: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileInformation({ user }: { user: any }) {
  const { translations } = useLanguage()
  const t = translations.profile.information

  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(user.avatar || null)
  const [isUploading, setIsUploading] = useState(false)

  const defaultValues: Partial<ProfileFormValues> = {
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    email: user.email || "",
    phone: user.phone || "",
    dob: user.dob ? new Date(user.dob) : undefined,
    gender: user.gender || "",
    position: user.position || "",
    department: user.department || "",
    company: user.company || "Acme Inc.",
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  })

  function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      dispatch(
        updateUser({
          id: user.id,
          ...data,
          name: `${data.firstname} ${data.lastname}`.trim(),
          avatar,
        }),
      )

      toast({
        title: t.profileUpdated,
        description: t.profileUpdatedDesc,
      })

      setIsLoading(false)
    }, 1000)
  }

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Simulate file upload
    const reader = new FileReader()
    reader.onload = (event) => {
      setAvatar(event.target?.result as string)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  function removeAvatar() {
    setAvatar(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  {avatar ? (
                    <AvatarImage src={avatar || "/placeholder.svg"} alt={user.name} />
                  ) : (
                    <AvatarFallback className="text-4xl">
                      {form.getValues("firstname")?.[0]?.toUpperCase() || ""}
                      {form.getValues("lastname")?.[0]?.toUpperCase() || ""}
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
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.firstname}</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.lastname}</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.email}</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.phone}</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t.dob}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>{t.pickDate}</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.gender}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t.selectGender} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">{t.genderOptions.male}</SelectItem>
                            <SelectItem value="female">{t.genderOptions.female}</SelectItem>
                            <SelectItem value="non-binary">{t.genderOptions.nonBinary}</SelectItem>
                            <SelectItem value="other">{t.genderOptions.other}</SelectItem>
                            <SelectItem value="prefer-not-to-say">{t.genderOptions.preferNotToSay}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.position}</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your job title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.department}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t.selectDepartment} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="engineering">{t.departmentOptions.engineering}</SelectItem>
                            <SelectItem value="product">{t.departmentOptions.product}</SelectItem>
                            <SelectItem value="design">{t.departmentOptions.design}</SelectItem>
                            <SelectItem value="marketing">{t.departmentOptions.marketing}</SelectItem>
                            <SelectItem value="sales">{t.departmentOptions.sales}</SelectItem>
                            <SelectItem value="support">{t.departmentOptions.support}</SelectItem>
                            <SelectItem value="hr">{t.departmentOptions.hr}</SelectItem>
                            <SelectItem value="finance">{t.departmentOptions.finance}</SelectItem>
                            <SelectItem value="operations">{t.departmentOptions.operations}</SelectItem>
                            <SelectItem value="other">{t.departmentOptions.other}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.company}</FormLabel>
                        <FormControl>
                          <Input placeholder="Company name" {...field} readOnly />
                        </FormControl>
                        <FormDescription>{t.companyDescription}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.saveChanges}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
