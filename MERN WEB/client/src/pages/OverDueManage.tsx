import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

// Services (backend-powered)
import { getOverdueLendings, returnBook } from "../services/lendingService";

// Types
import type { Lending } from "../types/Lending";

/* ------------------------------------------------------------------
   Helpers (logic unchanged)
------------------------------------------------------------------- */
function formatDisplay(date: string | Date | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
}

function daysOverdue(dueDate: string | Date): number {
  const due = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const now = new Date();
  const dueDayStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const nowDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = nowDayStart.getTime() - dueDayStart.getTime();
  return diff <= 0 ? 0 : Math.floor(diff / (1000 * 60 * 60 * 24));
}

function daysSinceBorrowed(borrowedAt: string | Date): number {
  const borrowed = typeof borrowedAt === "string" ? new Date(borrowedAt) : borrowedAt;
  const now = new Date();
  const borrowedDayStart = new Date(borrowed.getFullYear(), borrowed.getMonth(), borrowed.getDate());
  const nowDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = nowDayStart.getTime() - borrowedDayStart.getTime();
  return diff < 0 ? 0 : Math.floor(diff / (1000 * 60 * 60 * 24));
}

function isReturned(l: Lending): boolean {
  return !!l.returnedAt || l.status === "RETURNED";
}

function isOverdue(l: Lending): boolean {
  if (isReturned(l)) return false;
  return new Date(l.dueDate).getTime() < Date.now();
}

/* ------------------------------------------------------------------
   Grouped view model
------------------------------------------------------------------- */
interface OverdueGroup {
  readerId: string;
  readerName: string;
  items: Lending[];
}

/* ------------------------------------------------------------------
   Component (STYLING UPDATED ONLY to match BookManagement UI theme)
------------------------------------------------------------------- */
const OverdueManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [overdues, setOverdues] = useState<Lending[]>([]);

  /* --------------------------------------------------------------
     Load (fetch from backend)
  --------------------------------------------------------------- */
  const loadOverdues = async () => {
    try {
      setLoading(true);
      const data = await getOverdueLendings();
      // Backend returns all overdue lendings (and marks status OVERDUE)
      // Defensive client-side filter
      const filtered = data.filter((l) => isOverdue(l));
      setOverdues(filtered);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load overdue lendings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOverdues();
  }, []);

  /* --------------------------------------------------------------
     Mark Returned (optional action)
  --------------------------------------------------------------- */
  const handleReturn = async (lendingId: string) => {
    if (!window.confirm("Mark this book as returned?")) return;
    try {
      setActionLoading(true);
      await returnBook(lendingId);
      toast.success("Book marked returned");
      await loadOverdues();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark returned");
    } finally {
      setActionLoading(false);
    }
  };

  /* --------------------------------------------------------------
     Email (demo only — replace w/ real API if needed)
  --------------------------------------------------------------- */
  const handleSendEmail = (group: OverdueGroup) => {
    const lines = group.items
      .map((l) => `- ${l.book.title} (Due: ${formatDisplay(l.dueDate)})`)
      .join("\n");
    const msg = `To: ${group.readerName}\n\nYou have overdue books:\n${lines}`;
    console.log("Email content:\n" + msg);
    toast.success(`Email queued to ${group.readerName}`);
  };

  /* --------------------------------------------------------------
     Derive grouped-by-reader structure
  --------------------------------------------------------------- */
  const groups = useMemo<OverdueGroup[]>(() => {
    const map: Record<string, OverdueGroup> = {};
    for (const l of overdues) {
      const readerId = l.reader?._id ?? "unknown";
      const readerName = l.reader?.name ?? "Unknown Reader";
      if (!map[readerId]) {
        map[readerId] = { readerId, readerName, items: [] };
      }
      map[readerId].items.push(l);
    }
    return Object.values(map).sort((a, b) => a.readerName.localeCompare(b.readerName));
  }, [overdues]);

  /* --------------------------------------------------------------
     Loading state (restyled)
  --------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 mt-8 rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-center text-white shadow-2xl shadow-indigo-900/20">
        <p className="animate-pulse text-white/70">Loading overdue lendings...</p>
      </div>
    );
  }

  /* ------------------------------------------------------------------
     Style Tokens (UI only)
  ------------------------------------------------------------------ */
  const btnIndigo =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-400";
  const btnGreen =
    "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-400 disabled:opacity-50";
  const groupCard =
    "bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg";

  /* --------------------------------------------------------------
     Render (BookManagement UI Match)
  --------------------------------------------------------------- */
  return (
    <div className="relative max-w-5xl mx-auto p-6 sm:p-8 md:p-10 mt-8 rounded-2xl overflow-hidden text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl shadow-indigo-900/20">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-purple-500/20 blur-3xl animate-pulse [animation-delay:1.5s]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="mb-8 pb-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 group">
            <div className="relative p-3 rounded-xl bg-gradient-to-br from-rose-600 to-red-600 shadow-lg group-hover:shadow-xl transition-transform group-hover:scale-105">
              {/* glyph */}
              <span className="block w-4 h-4 bg-white rounded-sm rotate-[-10deg]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-rose-200 bg-clip-text text-transparent">
                Overdue Lendings
              </h1>
              <p className="text-xs text-white/60">Books past due by reader</p>
            </div>
          </div>
        </header>

        {/* Zero state */}
        {groups.length === 0 ? (
          <p className="text-white/70">No overdue lendings found.</p>
        ) : (
          <div className="space-y-10">
            {groups.map((g) => (
              <section key={g.readerId} className={groupCard}>
                {/* Reader Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <h2 className="text-lg font-bold text-rose-300">
                    {g.readerName}{" "}
                    <span className="text-sm text-white/70 font-normal">
                      ({g.items.length} overdue book{g.items.length > 1 ? "s" : ""})
                    </span>
                  </h2>
                  <button
                    onClick={() => handleSendEmail(g)}
                    className={btnIndigo}
                    disabled={actionLoading}
                  >
                    Send Email Notification
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-white/10 shadow-inner">
                  <table className="w-full table-auto border-collapse text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-rose-600 to-red-600">
                        <th className="border border-white/10 px-4 py-2 text-left">Book Title</th>
                        <th className="border border-white/10 px-4 py-2 text-left">Due Date</th>
                        <th className="border border-white/10 px-4 py-2 text-left">Days Overdue</th>
                        <th className="border border-white/10 px-4 py-2 text-left">Days Borrowed</th>
                        <th className="border border-white/10 px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.items.map((l) => {
                        const overdueDays = daysOverdue(l.dueDate);
                        const borrowedDays = daysSinceBorrowed(l.borrowedAt);
                        return (
                          <tr
                            key={l._id}
                            className="hover:bg-white/5 transition odd:bg-white/10 even:bg-white/5"
                          >
                            <td className="border border-white/10 px-4 py-2 align-top break-words">{l.book.title}</td>
                            <td className="border border-white/10 px-4 py-2 align-top">{formatDisplay(l.dueDate)}</td>
                            <td className="border border-white/10 px-4 py-2 align-top text-rose-300 font-semibold">{overdueDays}</td>
                            <td className="border border-white/10 px-4 py-2 align-top">{borrowedDays}</td>
                            <td className="border border-white/10 px-4 py-2 align-top whitespace-nowrap">
                              <button
                                onClick={() => handleReturn(l._id)}
                                disabled={actionLoading}
                                className={btnGreen}
                              >
                                Mark Returned
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverdueManagement;
