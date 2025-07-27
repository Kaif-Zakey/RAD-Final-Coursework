import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAuditLogs } from "../services/auditService";
import type { AuditLog } from "../types/AuditLog";
import Loading from "../components/PageLoading";

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAuditLogs()
      .then((res) => {
        if (Array.isArray(res)) {
          setLogs(res);
        } else {
          console.error("Unexpected response format:", res);
          setError("Invalid audit log format received.");
        }
      })
      .catch((err) => {
        console.error("Audit fetch error:", err);
        toast.error("Failed to fetch audit logs");
        setError("Failed to fetch audit logs.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white rounded-2xl shadow-lg mt-8">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
        Audit Logs
      </h1>

      {error && <p className="text-red-400 text-center mb-6">{error}</p>}

      {logs.length === 0 ? (
        <p className="text-gray-300 text-center">No audit logs found.</p>
      ) : (
        <div className="overflow-x-auto rounded shadow-lg">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="border border-white/10 px-4 py-2 text-left">Timestamp</th>
                <th className="border border-white/10 px-4 py-2 text-left">User</th>
                <th className="border border-white/10 px-4 py-2 text-left">Action</th>
                <th className="border border-white/10 px-4 py-2 text-left">Entity</th>
                {/* Removed Entity ID column header */}
                <th className="border border-white/10 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-white/5 transition">
                  <td className="border border-white/10 px-4 py-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="border border-white/10 px-4 py-2">
                    {log.user?.name || "Unknown"}
                    <br />
                    <span className="text-sm text-gray-300">{log.user?.email}</span>
                  </td>
                  <td className="border border-white/10 px-4 py-2 capitalize">{log.action.toLowerCase()}</td>
                  <td className="border border-white/10 px-4 py-2">{log.entity}</td>
                  <td className="border border-white/10 px-4 py-2">{log.description || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLogsPage;
