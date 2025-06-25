"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"
import type { StreamStatus } from "./StreamDashboard"

interface StreamCardProps extends StreamStatus {
  onCheck: () => void
}

export default function StreamCard({
  name,
  description,
  isUp,
  loading,
  history,
  lastChecked,
  onCheck,
}: StreamCardProps) {
  const getUptimePercentage = () => {
    if (history.length === 0) return 0
    const upCount = history.filter((h) => h.isUp).length
    return Math.round((upCount / history.length) * 100)
  }

  const formatLastChecked = () => {
    if (!lastChecked) return "Never"
    const diff = Date.now() - lastChecked
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                ) : isUp ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <h3 className="text-lg font-semibold">{name}</h3>
              </div>
              <Badge variant={isUp ? "default" : "destructive"} className="ml-auto">
                {loading ? "Checking..." : isUp ? "Online" : "Offline"}
              </Badge>
            </div>

            <p className="text-gray-600 mb-3">{description}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last checked: {formatLastChecked()}
              </div>
              {history.length > 0 && (
                <div>
                  Uptime: {getUptimePercentage()}% (last {history.length} checks)
                </div>
              )}
            </div>

            {/* Mini history visualization */}
            {history.length > 0 && (
              <div className="flex gap-1 mt-3">
                {history.slice(-10).map((check, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${check.isUp ? "bg-green-400" : "bg-red-400"}`}
                    title={`${new Date(check.timestamp).toLocaleTimeString()}: ${check.isUp ? "Online" : "Offline"}`}
                  />
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={onCheck}
            disabled={loading}
            className="ml-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              "Check Now"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
