"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { parseISO, format, differenceInDays, addDays } from "date-fns"

export default function SprintBurndownChart({ sprint, issues, totalIssues, completedIssues }) {
  const data = useMemo(() => {
    if (!sprint || !sprint.startDate || !sprint.endDate) {
      return []
    }

    const startDate = parseISO(sprint.startDate)
    const endDate = parseISO(sprint.endDate)
    const totalDays = differenceInDays(endDate, startDate) + 1

    // Generate ideal burndown line
    const idealBurndown = []
    const issuesPerDay = totalIssues / totalDays

    for (let i = 0; i <= totalDays; i++) {
      const date = addDays(startDate, i)
      const remaining = Math.max(0, totalIssues - issuesPerDay * i)

      idealBurndown.push({
        date: format(date, "MMM dd"),
        ideal: Math.round(remaining * 10) / 10,
        actual: i === 0 ? totalIssues : null, // Start with total issues
      })
    }

    // Simulate actual burndown
    // In a real app, this would use actual completion dates of issues
    const actualBurndown = [...idealBurndown]

    // Randomly distribute completed issues across days (except day 0)
    const remainingToComplete = completedIssues
    const daysToDistribute = actualBurndown.length - 1 // Exclude day 0

    if (daysToDistribute > 0) {
      const basePerDay = Math.floor(remainingToComplete / daysToDistribute)
      let extra = remainingToComplete - basePerDay * daysToDistribute

      let remaining = totalIssues

      for (let i = 1; i < actualBurndown.length; i++) {
        let completedToday = basePerDay
        if (extra > 0) {
          completedToday++
          extra--
        }

        // Ensure we don't complete more than remaining
        completedToday = Math.min(completedToday, remaining)
        remaining -= completedToday

        actualBurndown[i].actual = remaining
      }
    }

    return actualBurndown
  }, [sprint, totalIssues, completedIssues])

  if (!sprint || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No sprint data available</p>
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
        <YAxis label={{ value: "Remaining Issues", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ideal" stroke="#8884d8" name="Ideal Burndown" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Actual Burndown" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
