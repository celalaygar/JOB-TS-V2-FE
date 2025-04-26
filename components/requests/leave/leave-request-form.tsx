"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { tr as trLocale } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import { leaveTypeOptions } from "@/data/leave-type-options"
import { calculateLeaveWorkTime } from "@/data/leave-requests"

// Create a schema for form validation
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  leaveType: z.string().min(1, { message: "Leave type is required" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Valid time format is required (HH:MM)" }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Valid time format is required (HH:MM)" }),
  reason: z.string().min(1, { message: "Reason is required" }),
})

export type LeaveFormValues = z.infer<typeof formSchema>

interface LeaveRequestFormProps {
  defaultValues?: Partial<LeaveFormValues>
  onSubmit: (data: LeaveFormValues) => void
  submitLabel: string
}

// Generate time options in 30-minute intervals
const generateTimeOptions = () => {
  const options = []
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, "0")
      const formattedMinute = minute.toString().padStart(2, "0")
      options.push(`${formattedHour}:${formattedMinute}`)
    }
  }
  return options
}

const timeOptions = generateTimeOptions()

export function LeaveRequestForm({ defaultValues, onSubmit, submitLabel }: LeaveRequestFormProps) {
  const { translations, language } = useLanguage()

  // Initialize form
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      leaveType: "",
      startTime: "09:00",
      endTime: "18:00",
      reason: "",
      ...defaultValues,
    },
  })

  // Calculate work hours and days when form values change
  const calculateWorkTime = () => {
    const startDate = form.getValues("startDate")
    const endDate = form.getValues("endDate")
    const startTime = form.getValues("startTime")
    const endTime = form.getValues("endTime")

    if (startDate && endDate && startTime && endTime) {
      const { workHours, workDays } = calculateLeaveWorkTime(startDate, endDate, startTime, endTime)
      return { workHours, workDays }
    }

    return { workHours: 0, workDays: 0 }
  }

  const handleFormSubmit = (data: LeaveFormValues) => {
    // Calculate work hours and days before submitting
    const { workHours, workDays } = calculateWorkTime()

    // Add calculated values to the form data
    const enhancedData = {
      ...data,
      workHours,
      workDays,
      year: data.startDate.getFullYear(),
    }

    onSubmit(enhancedData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.requests.leave.titleLabel}</FormLabel>
                <FormControl>
                  <Input placeholder={translations.requests.leave.titlePlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="leaveType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.requests.leave.leaveTypeLabel}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={translations.requests.leave.leaveTypePlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {leaveTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {language === "en" ? option.en : `${option.tr} - ${option.en}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.requests.leave.descriptionLabel}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={translations.requests.leave.descriptionPlaceholder}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{translations.requests.leave.startDateLabel}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant={"outline"}
                          className={cn("pl-3 text-left font-normal w-full", !field.value && "text-muted-foreground")}
                          onClick={(e) => e.preventDefault()}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: language === "tr" ? trLocale : undefined })
                          ) : (
                            <span>{translations.requests.overtime.selectDate}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
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
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.requests.leave.startTimeLabel || "Start Time"}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select start time" />
                        <Clock className="h-4 w-4 opacity-50" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={`start-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{translations.requests.leave.endDateLabel}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant={"outline"}
                          className={cn("pl-3 text-left font-normal w-full", !field.value && "text-muted-foreground")}
                          onClick={(e) => e.preventDefault()}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: language === "tr" ? trLocale : undefined })
                          ) : (
                            <span>{translations.requests.overtime.selectDate}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const startDate = form.getValues("startDate")
                          return startDate && date < startDate
                        }}
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
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.requests.leave.endTimeLabel || "End Time"}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select end time" />
                        <Clock className="h-4 w-4 opacity-50" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={`end-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Work time calculation preview */}
        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-medium mb-2">{translations.requests.leave.workTimePreview || "Work Time Calculation"}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{translations.requests.leave.workHours || "Work Hours"}:</p>
              <p className="font-medium">
                {calculateWorkTime().workHours} {translations.requests.leave.hours || "hours"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{translations.requests.leave.workDays || "Work Days"}:</p>
              <p className="font-medium">
                {calculateWorkTime().workDays} {translations.requests.leave.days || "days"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {translations.requests.leave.workDaysNote || "8-9 hours = 1 day"}
              </p>
            </div>
          </div>
        </div>

        {/* Working Year Note */}
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <h4 className="font-medium text-blue-800 mb-2">Working Year Information</h4>
          <p className="text-sm text-blue-700">
            The working year is defined as the period from the date of starting work until completing one year. You can
            only create or modify leave requests for the current working year.
          </p>
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.requests.leave.reasonLabel}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={translations.requests.leave.reasonPlaceholder}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{submitLabel}</Button>
      </form>
    </Form>
  )
}
