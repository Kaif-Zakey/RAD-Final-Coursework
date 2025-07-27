import React, { useState, type JSX } from "react"
import {
  MdDashboard,
  MdPeople,
  MdLibraryBooks,
  MdShoppingCart,
  MdWarning,
  MdCategory,
  MdPerson,
  MdHistory, // You can use this icon for audit
} from "react-icons/md"
import { useNavigate } from "react-router-dom"

interface SidebarItem {
  id: string
  label: string
  icon: JSX.Element
}

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("dashboard")
  const navigate = useNavigate()

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId)
    if (itemId === "dashboard") navigate(`/dashboard`)
    else navigate(`/dashboard/${itemId.toLowerCase()}`)
  }

  const sidebarItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <MdDashboard className="w-5 h-5" /> },
    { id: "readers", label: "Readers", icon: <MdPeople className="w-5 h-5" /> },
    { id: "books", label: "Books", icon: <MdLibraryBooks className="w-5 h-5" /> },
    { id: "lendings", label: "Lendings", icon: <MdShoppingCart className="w-5 h-5" /> },
    { id: "overdues", label: "Overdues", icon: <MdWarning className="w-5 h-5 text-red-400" /> },
    { id: "categories", label: "Categories", icon: <MdCategory className="w-5 h-5" /> },
    { id: "audit", label: "Audit Logs", icon: <MdHistory className="w-5 h-5 text-yellow-400" /> }, // New item
  ]

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white w-64 min-h-screen p-6 flex flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse"></div>

      <div className="relative z-10">
        <nav>
          <ul className="space-y-3">
            {sidebarItems.map((item, index) => (
              <li key={item.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`group relative w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-left overflow-hidden transform hover:scale-102 ${
                    activeItem === item.id
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {activeItem === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-sm"></div>
                  )}
                  <span
                    className={`relative flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                      activeItem === item.id ? "bg-white/20 shadow-lg" : "group-hover:bg-white/10"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="relative font-medium capitalize group-hover:translate-x-1 transition-transform duration-300">
                    {item.label}
                  </span>
                  <div
                    className={`absolute right-3 w-2 h-2 rounded-full transition-all duration-300 ${
                      activeItem === item.id
                        ? "bg-white animate-pulse"
                        : "bg-transparent group-hover:bg-white/50"
                    }`}
                  ></div>
                  {activeItem === item.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r-full"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="relative z-10 mt-6 border-t border-white/20 pt-4">
        <button
          onClick={() => {
            setActiveItem("profile")
            navigate("/dashboard/profile")
          }}
          className={`group relative w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-left overflow-hidden transform hover:scale-102 ${
            activeItem === "profile"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
              : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          {activeItem === "profile" && (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-sm"></div>
          )}
          <span
            className={`relative flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
              activeItem === "profile" ? "bg-white/20 shadow-lg" : "group-hover:bg-white/10"
            }`}
          >
            <MdPerson className="w-5 h-5" />
          </span>
          <span className="relative font-medium group-hover:translate-x-1 transition-transform duration-300">
            Profile
          </span>
          <div
            className={`absolute right-3 w-2 h-2 rounded-full transition-all duration-300 ${
              activeItem === "profile"
                ? "bg-white animate-pulse"
                : "bg-transparent group-hover:bg-white/50"
            }`}
          ></div>
          {activeItem === "profile" && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r-full"></div>
          )}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
