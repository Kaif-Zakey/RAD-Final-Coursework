// File: src/components/dashboard/DashboardStats.tsx

import React from "react"
import { MdPeople, MdLibraryBooks, MdBook, MdWarning } from "react-icons/md"

interface DashboardStatsProps {
  totalCustomers: number
  totalItems: number
  totalOrders: number
  totalRevenue: number
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalCustomers,
  totalItems,
  totalOrders,
  totalRevenue,
}) => {
  const stats = [
    {
      label: "Total Readers",
      value: totalCustomers,
      icon: <MdPeople className="text-blue-600 w-6 h-6" />,
    },
    {
      label: "Total Books",
      value: totalItems,
      icon: <MdLibraryBooks className="text-purple-600 w-6 h-6" />,
    },
    {
      label: "Books Lent",
      value: totalOrders,
      icon: <MdBook className="text-green-600 w-6 h-6" />,
    },
    {
      label: "Overdue Books",
      value: totalRevenue,
      icon: <MdWarning className="text-red-600 w-6 h-6" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          {stat.icon}
          <div>
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats
