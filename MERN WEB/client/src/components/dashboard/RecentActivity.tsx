// File: src/components/dashboard/RecentActivity.tsx

import React from "react";
import {
  MdBook,
  MdPerson,
  MdAssignmentReturn,
  MdWarning,
  MdLibraryBooks,
} from "react-icons/md";

type ActivityType = "lend" | "return" | "reader" | "overdue" | "book";



interface RecentActivityProps {
  activities: {
    type: "LEND" | "RETURN" | "READER" | "BOOK" | "OVERDUE"; // raw from backend
    message: string;
    timestamp: string; // ISO string from backend
  }[];
}

// Map backend activity types (uppercase) to lowercase for this UI component
const mapActivityType = (type: string): ActivityType => {
  switch (type.toUpperCase()) {
    case "LEND":
      return "lend";
    case "RETURN":
      return "return";
    case "READER":
      return "reader";
    case "OVERDUE":
      return "overdue";
    case "BOOK":
      return "book";
    default:
      return "lend"; // default fallback
  }
};

const getIcon = (type: ActivityType) => {
  switch (type) {
    case "lend":
      return <MdBook className="text-indigo-600 w-6 h-6" />;
    case "return":
      return <MdAssignmentReturn className="text-green-600 w-6 h-6" />;
    case "reader":
      return <MdPerson className="text-blue-600 w-6 h-6" />;
    case "overdue":
      return <MdWarning className="text-red-600 w-6 h-6" />;
    case "book":
      return <MdLibraryBooks className="text-purple-600 w-6 h-6" />;
    default:
      return null;
  }
};

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
      <ul className="space-y-4">
        {activities.map((activity, index) => {
          const type = mapActivityType(activity.type);
          // Format timestamp nicely
          const timeStr = new Date(activity.timestamp).toLocaleString();

          return (
            <li key={index} className="flex items-start space-x-3">
              <div>{getIcon(type)}</div>
              <div>
                <p className="text-sm text-gray-800">{activity.message}</p>
                <p className="text-xs text-gray-500">{timeStr}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentActivity;
