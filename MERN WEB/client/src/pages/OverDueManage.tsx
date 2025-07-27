import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

// Services
import { getOverdueLendings, returnBook } from "../services/lendingService";
import { sendOverdueEmail } from "../services/emailService";

// Types
import type { Lending } from "../types/Lending";
import Loading from "../components/PageLoading";

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

interface OverdueGroup {
  readerId: string;
  readerName: string;
  readerEmail?: string;
  items: Lending[];
}

const OverdueManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [overdues, setOverdues] = useState<Lending[]>([]);

  const loadOverdues = async () => {
    try {
      setLoading(true);
      const data = await getOverdueLendings();
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

  const handleSendEmail = async (group: OverdueGroup) => {
    if (!group.readerEmail) {
      toast.error(`Missing email for ${group.readerName}`);
      return;
    }


      const toastId = toast.loading("Sending email...")


    try {
      setActionLoading(true);
      await sendOverdueEmail({
        email: group.readerEmail,
        readerName: group.readerName,
        books: group.items.map((l) => ({
          title: l.book.title,
          dueDate: l.dueDate,
        })),
      });
      toast.success(`Email sent to ${group.readerName}`,
          {id: toastId}

      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to send email", { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const groups = useMemo<OverdueGroup[]>(() => {
    const map: Record<string, OverdueGroup> = {};
    for (const l of overdues) {
      const readerId = l.reader?._id ?? "unknown";
      const readerName = l.reader?.name ?? "Unknown Reader";
      const readerEmail = l.reader?.email ?? undefined;

      if (!map[readerId]) {
        map[readerId] = {
          readerId,
          readerName,
          readerEmail,
          items: [],
        };
      }

      map[readerId].items.push(l);
    }

    return Object.values(map).sort((a, b) => a.readerName.localeCompare(b.readerName));
  }, [overdues]);

  if (loading) {
    return (
      <Loading/>
    );
  }

  const btnIndigo =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-400 disabled:opacity-50";
  const btnGreen =
    "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-400 disabled:opacity-50";
  const groupCard =
    "bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg";

  return (
    <div className="relative max-w-5xl mx-auto p-6 mt-8 rounded-2xl overflow-hidden text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl shadow-indigo-900/20">
      <div className="relative z-10">
        <header className="mb-8 pb-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 group">
            <div className="relative p-3 rounded-xl bg-gradient-to-br from-rose-600 to-red-600 shadow-lg">
              <span className="block w-4 h-4 bg-white rounded-sm rotate-[-10deg]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-ping" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-rose-200 bg-clip-text text-transparent">
                Overdue Lendings
              </h1>
              <p className="text-xs text-white/60">Books past due by reader</p>
            </div>
          </div>
        </header>

        {groups.length === 0 ? (
          <p className="text-white/70">No overdue lendings found.</p>
        ) : (
          <div className="space-y-10">
            {groups.map((g) => (
              <section key={g.readerId} className={groupCard}>
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
                    disabled={actionLoading || !g.readerEmail}
                  >
                    {actionLoading ? "Sending..." : "Send Email Notification"}
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10 shadow-inner">
                  <table className="w-full table-auto border-collapse text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-rose-600 to-red-600 text-left">
                        <th className="border border-white/10 px-4 py-2">Book Title</th>
                        <th className="border border-white/10 px-4 py-2">Due Date</th>
                        <th className="border border-white/10 px-4 py-2">Days Overdue</th>
                        <th className="border border-white/10 px-4 py-2">Days Borrowed</th>
                        <th className="border border-white/10 px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.items.map((l) => (
                        <tr
                          key={l._id}
                          className="hover:bg-white/5 transition odd:bg-white/10 even:bg-white/5"
                        >
                          <td className="border border-white/10 px-4 py-2">{l.book.title}</td>
                          <td className="border border-white/10 px-4 py-2">{formatDisplay(l.dueDate)}</td>
                          <td className="border border-white/10 px-4 py-2 text-rose-300 font-semibold">
                            {daysOverdue(l.dueDate)}
                          </td>
                          <td className="border border-white/10 px-4 py-2">
                            {daysSinceBorrowed(l.borrowedAt)}
                          </td>
                          <td className="border border-white/10 px-4 py-2 whitespace-nowrap">
                            <button
                              onClick={() => handleReturn(l._id)}
                              disabled={actionLoading}
                              className={btnGreen}
                            >
                              Mark Returned
                            </button>
                          </td>
                        </tr>
                      ))}
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
