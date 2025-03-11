"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "@/components/ui/chart"

// Sample data for the charts
const weeklyData = [
  { name: "Mon", total: 15 },
  { name: "Tue", total: 10 },
  { name: "Wed", total: 20 },
  { name: "Thu", total: 15 },
  { name: "Fri", total: 0 },
  { name: "Sat", total: 25 },
  { name: "Sun", total: 15 },
]

const monthlyData = [
  { name: "Week 1", total: 75 },
  { name: "Week 2", total: 90 },
  { name: "Week 3", total: 60 },
  { name: "Week 4", total: 100 },
]

interface ProgressChartProps {
  period: "weekly" | "monthly"
}

export function ProgressChart({ period }: ProgressChartProps) {
  const [mounted, setMounted] = useState(false)
  const [chartData, setChartData] = useState(period === "weekly" ? weeklyData : monthlyData)

  // Calculate trending percentage
  const lastValue = chartData[chartData.length - 1].total
  const previousValue = chartData[chartData.length - 2].total
  const trendingPercentage = ((lastValue - previousValue) / previousValue) * 100

  // After mounting, we can render the chart
  useEffect(() => {
    setMounted(true)
    setChartData(period === "weekly" ? weeklyData : monthlyData)
  }, [period])

  if (!mounted) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <Skeleton className="h-[250px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="h-[300px] w-full max-w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}min`}
            />
            <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm text-muted-foreground">
        {trendingPercentage > 0 ? "Trending up" : "Trending down"} by {Math.abs(trendingPercentage).toFixed(1)}% this{" "}
        {period === "weekly" ? "week" : "month"}
      </div>
    </div>
  )
}

