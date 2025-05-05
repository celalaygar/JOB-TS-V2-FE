"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import type { OvertimeRequest } from "@/data/overtime-requests"

interface OvertimeRequestFormProps {
  initialData?: OvertimeRequest
  onSubmit: (data: OvertimeRequest) => void
  onCancel: () => void
  isEdit?: boolean
}

export function OvertimeRequestForm({ initialData, onSubmit, onCancel, isEdit = false }: OvertimeRequestFormProps) {
  const { translations } = useLanguage()
  const t = translations.requests.overtime

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [endTime, setEndTime] = useState("")
  const [reason, setReason] = useState("")
  const [formError, setFormError] = useState(false)

  // State for popover visibility
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [startTimeOpen, setStartTimeOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
  const [endTimeOpen, setEndTimeOpen] = useState(false)

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description)

      const startDateObj = new Date(initialData.startDateTime)
      setStartDate(startDateObj)
      setStartTime(
        `${startDateObj.getHours().toString().padStart(2, "0")}:${startDateObj.getMinutes().toString().padStart(2, "0")}`,
      )

      const endDateObj = new Date(initialData.endDateTime)
      setEndDate(endDateObj)
      setEndTime(
        `${endDateObj.getHours().toString().padStart(2, "0")}:${endDateObj.getMinutes().toString().padStart(2, "0")}`,
      )

      setReason(initialData.reason)
    }
  }, [initialData])

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!title || !description || !startDate || !startTime || !endDate || !endTime || !reason) {
      setFormError(true)
      return
    }

    // Create start and end date time strings
    const startDateTime = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      Number.parseInt(startTime.split(":")[0]),
      Number.parseInt(startTime.split(":")[1]),
    ).toISOString()

    const endDateTime = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      Number.parseInt(endTime.split(":")[0]),
      Number.parseInt(endTime.split(":")[1]),
    ).toISOString()

    // Create request object
    const requestData: OvertimeRequest = {
      id: initialData?.id || Date.now().toString(),
      title,
      description,
      startDateTime,
      endDateTime,
      reason,
      status: initialData?.status || "pending",
      createdAt: initialData?.createdAt || new Date().toISOString(),
    }

    onSubmit(requestData)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">{t.titleLabel}</Label>
          <Input
            id="title"
            placeholder={t.titlePlaceholder}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={formError && !title ? "border-red-500" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t.descriptionLabel}</Label>
          <Textarea
            id="description"
            placeholder={t.descriptionPlaceholder}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={formError && !description ? "border-red-500" : ""}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t.startDateTimeLabel}</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                        formError && !startDate && "border-red-500",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy") : t.selectDate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date)
                        setStartDateOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Popover open={startTimeOpen} onOpenChange={setStartTimeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startTime && "text-muted-foreground",
                        formError && !startTime && "border-red-500",
                      )}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {startTime || t.selectTime}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {["09:00", "10:00", "11:00", "12:00"].map((time) => (
                          <Button
                            key={time}
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setStartTime(time)
                              setStartTimeOpen(false)
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {["13:00", "14:00", "15:00", "16:00"].map((time) => (
                          <Button
                            key={time}
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setStartTime(time)
                              setStartTimeOpen(false)
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {["17:00", "18:00", "19:00", "20:00"].map((time) => (
                          <Button
                            key={time}
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setStartTime(time)
                              setStartTimeOpen(false)
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.endDateTimeLabel}</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground",
                        formError && !endDate && "border-red-500",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy") : t.selectDate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date)
                        setEndDateOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Popover open={endTimeOpen} onOpenChange={setEndTimeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endTime && "text-muted-foreground",
                        formError && !endTime && "border-red-500",
                      )}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {endTime || t.selectTime}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {["17:00", "18:00", "19:00", "20:00"].map((time) => (
                          <Button
                            key={time}
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setEndTime(time)
                              setEndTimeOpen(false)
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {["21:00", "22:00", "23:00", "00:00"].map((time) => (
                          <Button
                            key={time}
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setEndTime(time)
                              setEndTimeOpen(false)
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">{t.reasonLabel}</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger id="reason" className={formError && !reason ? "border-red-500" : ""}>
              <SelectValue placeholder={t.reasonPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="projectDeadline">{t.reasons.projectDeadline}</SelectItem>
              <SelectItem value="maintenance">{t.reasons.maintenance}</SelectItem>
              <SelectItem value="emergency">{t.reasons.emergency}</SelectItem>
              <SelectItem value="specialProject">{t.reasons.specialProject}</SelectItem>
              <SelectItem value="other">{t.reasons.other}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t.actions.cancel}
        </Button>
        <Button type="button" onClick={handleSubmit}>
          {isEdit ? t.actions.save : t.submitButton}
        </Button>
      </div>
    </div>
  )
}
