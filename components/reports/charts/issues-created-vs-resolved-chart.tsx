"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { parseISO, format, eachDayOfInterval, isSameDay } from "date-fns"

export default function IssuesCreatedVsResolvedChart({ issues, dateRange }) {
  const data = useMemo(() => {
    if (issues.length === 0) return []

    // Determine date range
    let startDate, endDate

    if (dateRange.from && dateRange.to) {
      startDate = dateRange.from
      endDate = dateRange.to
    } else if (dateRange.from) {
      startDate = dateRange.from
      endDate = new Date()
    } else {
      // Default to last 30 days if no date range specified
      const dates = issues.map((issue) => parseISO(issue.createdAt))
      startDate = new Date(Math.min(...dates.map((d) => d.getTime())))
      endDate = new Date(Math.max(...dates.map((d) => d.getTime())))
    }

    // Generate array of days in the date range
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    // Count issues created and resolved per day
    return days.map((day) => {
      const created = issues.filter((issue) => isSameDay(parseISO(issue.createdAt), day)).length

      const resolved = issues.filter(
        (issue) =>
          (issue.status === "Done" || issue.status === "Closed") &&
          issue.updatedAt &&
          isSameDay(parseISO(issue.updatedAt), day),
      ).length

      return {
        date: format(day, "MMM dd"),
        created,
        resolved,
      }
    })
  }, [issues, dateRange])

  if (issues.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="created" stroke="#8884d8" name="Created" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="resolved" stroke="#82ca9d" name="Resolved" />
      </LineChart>
    </ResponsiveContainer>
  )
}
