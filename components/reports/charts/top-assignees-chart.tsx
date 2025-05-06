"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function TopAssigneesChart({ issues, users }) {
  const data = useMemo(() => {
    // Count issues per assignee
    const assigneeCounts = {}

    issues.forEach((issue) => {
      if (issue.assigneeId) {
        if (!assigneeCounts[issue.assigneeId]) {
          assigneeCounts[issue.assigneeId] = 0
        }
        assigneeCounts[issue.assigneeId]++
      }
    })

    // Convert to array and sort by count
    const sortedAssignees = Object.entries(assigneeCounts)
      .map(([id, count]) => {
        const user = users.find((u) => u.id === id)
        return {
          name: user ? user.name : "Unknown",
          value: count,
        }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Take top 5

    return sortedAssignees
  }, [issues, users])

  if (issues.length === 0 || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 60,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip formatter={(value) => [`${value} issues`, "Assigned"]} />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name="Issues Assigned" />
      </BarChart>
    </ResponsiveContainer>
  )
}
