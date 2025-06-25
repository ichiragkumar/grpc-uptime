"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { StreamStatus } from "./StreamDashboard"

interface StatusChartProps {
  streams: StreamStatus[]
}

export default function StatusChart({ streams }: StatusChartProps) {
  const upStreams = streams.filter((s) => s.isUp).length
  const downStreams = streams.length - upStreams

  const data = [
    { name: "Online", value: upStreams, color: "#10b981" },
    { name: "Offline", value: downStreams, color: "#ef4444" },
  ]

  const COLORS = ["#10b981", "#ef4444"]

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Stream Status Overview</CardTitle>
        <CardDescription>Current status distribution of all streams</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
