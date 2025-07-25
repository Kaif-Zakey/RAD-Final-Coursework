// File: src/components/dashboard/RecentActivity.tsx

import React from "react"
import {
  MdBook,
  MdPerson,
  MdAssignmentReturn,
  MdWarning,
  MdLibraryBooks,
} from "react-icons/md"

type ActivityType = "lend" | "return" | "reader" | "overdue" | "book"

interface Activity {
  id: number
  type: ActivityType
  message: string
  time: string
}

interface RecentActivityProps {
  activities: Activity[]
}

const getIcon = (type: ActivityType) => {
  switch (type) {
    case "lend":
      return <MdBook className="text-indigo-600 w-6 h-6" />
    case "return":
      return <MdAssignmentReturn className="text-green-600 w-6 h-6" />
    case "reader":
      return <MdPerson className="text-blue-600 w-6 h-6" />
    case "overdue":
      return <MdWarning className="text-red-600 w-6 h-6" />
    case "book":
      return <MdLibraryBooks className="text-purple-600 w-6 h-6" />
    default:
      return null
  }
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
      <ul className="space-y-4">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-start space-x-3">
            <div>{getIcon(activity.type)}</div>
            <div>
              <p className="text-sm text-gray-800">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentActivity
