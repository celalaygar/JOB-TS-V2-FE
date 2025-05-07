"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { tr as trLocale } from "date-fns/locale"
import { CalendarIcon, Upload } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import { categoryOptions, taxRateOptions } from "@/data/spending-requests"

// Create a schema for form validation
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
  receiptDate: z.date({ required_error: "Receipt date is required" }),
  taxRate: z.string().min(1, { message: "Tax rate is required" }),
  description: z.string().max(144).optional(),
  attachmentUrl: z.string().optional(),
})

export type SpendingFormValues = z.infer<typeof formSchema>

interface SpendingRequestFormProps {
  defaultValues?: Partial<SpendingFormValues>
  onSubmit: (data: SpendingFormValues) => void
  submitLabel: string
}

export function SpendingRequestForm({ defaultValues, onSubmit, submitLabel }: SpendingRequestFormProps) {
  const { translations, language } = useLanguage()
  const [characterCount, setCharacterCount] = useState(defaultValues?.description?.length || 0)
  const maxCharacters = 144

  // Initialize form
  const form = useForm<SpendingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      amount: "",
      receiptDate: new Date(),
      taxRate: "",
      description: "",
      ...defaultValues,
    },
  })

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharacterCount(e.target.value.length)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.requests.spending.titleLabel}</FormLabel>
              <FormControl>
                <Input placeholder={translations.requests.spending.titlePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.requests.spending.categoryLabel}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={translations.requests.spending.categoryPlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {language === "en" ? option.en : option.tr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.requests.spending.amountLabel}</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input
                      placeholder={translations.requests.spending.amountPlaceholder}
                      {...field}
                      type="text"
                      inputMode="decimal"
                    />
                  </FormControl>
                  <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                    {translations.requests.spending.currency}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="receiptDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{translations.requests.spending.receiptDateLabel}</FormLabel>
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
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.requests.spending.taxRateLabel}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={translations.requests.spending.taxRatePlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {taxRateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {language === "tr" ? `%${option.value}` : `${option.value}%`}
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
          name="attachmentUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.requests.spending.attachmentLabel}</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => {
                      // In a real app, you would handle file upload here
                      // For this demo, we'll just set a placeholder value
                      if (e.target.files && e.target.files.length > 0) {
                        field.onChange(URL.createObjectURL(e.target.files[0]))
                      }
                    }}
                  />
                </FormControl>
                <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  {translations.requests.spending.selectFile}
                </Button>
                {field.value && <span className="text-sm text-muted-foreground">{field.value.split("/").pop()}</span>}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.requests.spending.descriptionLabel}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={translations.requests.spending.descriptionPlaceholder}
                  className="min-h-[100px]"
                  maxLength={maxCharacters}
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e)
                    handleDescriptionChange(e)
                  }}
                />
              </FormControl>
              <div className="text-xs text-muted-foreground text-right mt-1">
                {maxCharacters - characterCount} / {maxCharacters} {translations.requests.spending.charactersRemaining}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{submitLabel}</Button>
      </form>
    </Form>
  )
}
