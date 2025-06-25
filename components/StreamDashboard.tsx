"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RefreshCw, TrendingUp, AlertCircle } from "lucide-react"
import StreamCard from "./StreamCard"
import StatusChart from "./StatusChart"
import HistoryChart from "./HistoryChart"

export interface StreamStatus {
  name: string
  description: string
  isUp: boolean
  loading: boolean
  history: { timestamp: number; isUp: boolean }[]
  lastChecked?: number
}

const initialStreams: StreamStatus[] = [
  { name: "StreamCouponIssues", description: "Coupon Issues Stream", isUp: false, loading: false, history: [] },
  { name: "StreamActiveCoupons", description: "Active Coupons Stream", isUp: false, loading: false, history: [] },
  {
    name: "StreamActiveBusinessesStream",
    description: "Active Businesses Stream",
    isUp: false,
    loading: false,
    history: [],
  },
  {
    name: "StreamMoreCouponRequests",
    description: "More Coupon Requests Stream",
    isUp: false,
    loading: false,
    history: [],
  },
  {
    name: "ActiveCouponIssuesWithBusinessesStream",
    description: "Coupon Issues With Businesses",
    isUp: false,
    loading: false,
    history: [],
  },
  { name: "WalletStream", description: "Wallet Balance Stream", isUp: false, loading: false, history: [] },
  { name: "StreamActiveDrawn", description: "Active Drawn Stream", isUp: false, loading: false, history: [] },
  { name: "TicketsStream", description: "Tickets Stream", isUp: false, loading: false, history: [] },
  { name: "ZonesStream", description: "Zones Stream", isUp: false, loading: false, history: [] },
  { name: "BusinessBranchStream", description: "Business Branch Stream", isUp: false, loading: false, history: [] },
  { name: "StreamUserCarts", description: "User Carts Stream", isUp: false, loading: false, history: [] },
  {
    name: "StreamUserNotifications",
    description: "User Notifications Stream",
    isUp: false,
    loading: false,
    history: [],
  },
  { name: "EnvironmentStream", description: "Environment Stream", isUp: false, loading: false, history: [] },
]

interface StreamDashboardProps {
  onBack: () => void
}

export default function StreamDashboard({ onBack }: StreamDashboardProps) {
  const [streams, setStreams] = useState<StreamStatus[]>(initialStreams)
  const [isCheckingAll, setIsCheckingAll] = useState(false)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

  const updateStreamHistory = useCallback((streamName: string, isUp: boolean) => {
    setStreams((prev) =>
      prev.map((stream) => {
        if (stream.name === streamName) {
          const newHistory = [...stream.history, { timestamp: Date.now(), isUp }].slice(-10)
          return { ...stream, history: newHistory, lastChecked: Date.now() }
        }
        return stream
      }),
    )
  }, [])

  const checkStream = async (name: string) => {
    setStreams((prev) => prev.map((s) => (s.name === name ? { ...s, loading: true } : s)))

    try {
      const response = await fetch(`${API_BASE_URL}/check/${name}`)
      const data = await response.json()
      const isUp = data.isUp || response.ok

      setStreams((prev) => prev.map((s) => (s.name === name ? { ...s, isUp, loading: false } : s)))

      updateStreamHistory(name, isUp)
    } catch (error) {
      setStreams((prev) => prev.map((s) => (s.name === name ? { ...s, isUp: false, loading: false } : s)))
      updateStreamHistory(name, false)
    }
  }

  const checkAllStreams = async () => {
    setIsCheckingAll(true)
    const promises = streams.map((stream) => checkStream(stream.name))
    await Promise.all(promises)
    setIsCheckingAll(false)
  }

  const upStreams = streams.filter((s) => s.isUp).length
  const totalStreams = streams.length
  const uptime = totalStreams > 0 ? ((upStreams / totalStreams) * 100).toFixed(1) : "0"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="hover:bg-white/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Stream Dashboard
              </h1>
              <p className="text-gray-600">Real-time monitoring of your gRPC streams</p>
            </div>
          </div>
          <Button
            onClick={checkAllStreams}
            disabled={isCheckingAll}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isCheckingAll ? "animate-spin" : ""}`} />
            {isCheckingAll ? "Checking All..." : "Check All"}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStreams}</div>
              <p className="text-xs text-muted-foreground">Active monitoring</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Online Streams</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{upStreams}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offline Streams</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalStreams - upStreams}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Badge variant={Number.parseFloat(uptime) > 80 ? "default" : "destructive"}>{uptime}%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uptime}%</div>
              <p className="text-xs text-muted-foreground">Overall health</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StatusChart streams={streams} />
          <HistoryChart streams={streams} />
        </div>

        {/* Stream Cards */}
        <div className="grid gap-4">
          <h2 className="text-xl font-semibold mb-4">Stream Status</h2>
          {streams.map((stream) => (
            <StreamCard key={stream.name} {...stream} onCheck={() => checkStream(stream.name)} />
          ))}
        </div>
      </div>
    </div>
  )
}
