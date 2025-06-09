"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function IssueTypeChart({ issues }) {
  const data = useMemo(() => {
    const typeCounts = {}

    issues.forEach((issue) => {
      if (!typeCounts[issue.type]) {
        typeCounts[issue.type] = 0
      }
      typeCounts[issue.type]++
    })

    return Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value,
    }))
  }, [issues])

  if (issues.length === 0) {
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
        <Tooltip formatter={(value) => [`${value} issues`, "Count"]} />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name="Issues" />
      </BarChart>
    </ResponsiveContainer>
  )
}
