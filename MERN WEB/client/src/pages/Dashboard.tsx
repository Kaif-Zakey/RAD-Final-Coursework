import React from "react";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import { MdLibraryBooks, MdPersonAdd, MdBook } from "react-icons/md";
import RecentActivity from "../components/dashboard/RecentActivity";

const Dashboard: React.FC = () => {
  const dashboardData = {
    Readers: 1250,
    Books: 325,
    BookLends: 142,
    overDue: 8,
    monthlyLending: [
      { month: "Jan", count: 40 },
      { month: "Feb", count: 38 },
      { month: "Mar", count: 52 },
      { month: "Apr", count: 46 },
      { month: "May", count: 58 },
      { month: "Jun", count: 62 },
    ],
    recentActivities: [
      { id: 1, type: "lend" as const, message: "Book 'Rich Dad Poor Dad' lent to Amal Perera", time: "5 minutes ago" },
      { id: 2, type: "return" as const, message: "Book 'Atomic Habits' returned by Nuwan Silva", time: "30 minutes ago" },
      { id: 3, type: "reader" as const, message: "New reader Ishara Kumari registered", time: "1 hour ago" },
      { id: 4, type: "overdue" as const, message: "Overdue notice sent to Saman Jayasinghe", time: "2 hours ago" },
      { id: 5, type: "book" as const, message: "New book 'The Psychology of Money' added", time: "3 hours ago" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-white tracking-wide">Library Dashboard</h1>
          <p className="mt-2 text-purple-300 max-w-xl">
            Welcome back! Here’s what’s happening in the Book Club Library.
          </p>
        </header>

        {/* Stats */}
        <section>
          <DashboardStats
            totalCustomers={dashboardData.Readers}
            totalItems={dashboardData.Books}
            totalOrders={dashboardData.BookLends}
            totalRevenue={dashboardData.overDue}
          />
        </section>

        {/* Chart */}
        <section className="mt-12 bg-purple-900 rounded-xl shadow-lg p-8">
          <DashboardCharts monthlyLending={dashboardData.monthlyLending} />
        </section>

        {/* Actions + Recent */}
        <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-purple-900 rounded-xl shadow-lg p-8">
            <h2 className="text-xl text-purple-200 font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{
                icon: MdBook,
                label: "Lend Book",
                color: "text-indigo-400",
                hoverBg: "hover:bg-indigo-700",
                border: "border-indigo-600"
              }, {
                icon: MdPersonAdd,
                label: "Add Reader",
                color: "text-green-400",
                hoverBg: "hover:bg-green-700",
                border: "border-green-600"
              }, {
                icon: MdLibraryBooks,
                label: "Add Book",
                color: "text-purple-400",
                hoverBg: "hover:bg-purple-700",
                border: "border-purple-600"
              }].map(({ icon: Icon, label, color, hoverBg, border }) => (
                <button
                  key={label}
                  className={`flex flex-col items-center justify-center p-5 rounded-xl border ${border} bg-purple-800 text-purple-100 transition duration-200 ${hoverBg} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500`}
                  type="button"
                >
                  <Icon className={`w-10 h-10 mb-2 ${color}`} />
                  <span className="text-base font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-purple-900 rounded-xl shadow-lg p-8">
            <RecentActivity activities={dashboardData.recentActivities} />
          </div>
        </section>
      </div>
    </div>
  );
};
    
export default Dashboard;
