"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { StreamStatus } from "./StreamDashboard"

interface HistoryChartProps {
  streams: StreamStatus[]
}

export default function HistoryChart({ streams }: HistoryChartProps) {
  // Get the most recent 10 timestamps across all streams
  const allTimestamps = streams
    .flatMap((stream) => stream.history.map((h) => h.timestamp))
    .sort((a, b) => a - b)
    .slice(-10)

  const chartData = allTimestamps.map((timestamp) => {
    const dataPoint: any = {
      time: new Date(timestamp).toLocaleTimeString(),
      timestamp,
    }

    // Calculate uptime percentage at this timestamp
    const streamsWithData = streams.filter((stream) => stream.history.some((h) => h.timestamp <= timestamp))

    if (streamsWithData.length > 0) {
      const upCount = streamsWithData.filter((stream) => {
        const relevantHistory = stream.history
          .filter((h) => h.timestamp <= timestamp)
          .sort((a, b) => b.timestamp - a.timestamp)
        return relevantHistory.length > 0 ? relevantHistory[0].isUp : false
      }).length

      dataPoint.uptime = Math.round((upCount / streamsWithData.length) * 100)
    } else {
      dataPoint.uptime = 0
    }

    return dataPoint
  })

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Uptime History</CardTitle>
        <CardDescription>Overall uptime percentage over the last 10 checks</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, "Uptime"]} labelFormatter={(label) => `Time: ${label}`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="uptime"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
