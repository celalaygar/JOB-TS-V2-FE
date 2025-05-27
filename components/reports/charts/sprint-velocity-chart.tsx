"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function SprintVelocityChart({ sprint, issues }) {
  // In a real app, this would show velocity across multiple sprints
  // For this example, we'll simulate data for the last 5 sprints
  const data = useMemo(() => {
    // Generate simulated data for previous sprints
    const sprintNames = ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Current"]

    return sprintNames.map((name, index) => {
      // Simulate increasing velocity with some variation
      const baseVelocity = 20 + index * 5
      const variation = Math.floor(Math.random() * 10) - 5
      const velocity = baseVelocity + variation

      // Simulate commitment vs completion
      const commitment = velocity + Math.floor(Math.random() * 15)

      return {
        name,
        commitment,
        completed: velocity,
      }
    })
  }, [sprint])

  if (!sprint) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No sprint data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "Story Points", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="commitment" fill="#8884d8" name="Committed" />
        <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
      </BarChart>
    </ResponsiveContainer>
  )
}
