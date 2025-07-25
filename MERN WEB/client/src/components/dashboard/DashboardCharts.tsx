// File: src/components/dashboard/DashboardCharts.tsx

import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface MonthlyLendingData {
  month: string
  count: number
}

interface DashboardChartsProps {
  monthlyLending: MonthlyLendingData[]
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ monthlyLending }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Lending Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyLending}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DashboardCharts
