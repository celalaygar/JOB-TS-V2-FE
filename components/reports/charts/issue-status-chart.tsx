"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export default function IssueStatusChart({ issues }) {
  const data = useMemo(() => {
    const statusCounts = {}

    issues.forEach((issue) => {
      if (!statusCounts[issue.status]) {
        statusCounts[issue.status] = 0
      }
      statusCounts[issue.status]++
    })

    return Object.entries(statusCounts).map(([name, value]) => ({
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
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} issues`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
