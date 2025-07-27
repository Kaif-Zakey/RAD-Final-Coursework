import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

// Services
import { getLendings, lendBook, returnBook } from "../services/lendingService";
import { getBooks } from "../services/bookService";
import { getReaders } from "../services/readerService";

// Types
import type { Lending, LendingStatus } from "../types/Lending";
import type { Book } from "../types/Book";
import type { Reader } from "../types/Reader";
import Loading from "../components/PageLoading";


function toDateInputValue(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function fromDateInputValue(str: string): Date | null {
  if (!str) return null;
  const d = new Date(str);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDisplay(date: string | Date | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function deriveStatus(l: Lending): LendingStatus {
  if (l.status) return l.status; // trust server if provided
  if (l.returnedAt) return "RETURNED";
  const due = new Date(l.dueDate).getTime();
  return Date.now() > due ? "OVERDUE" : "BORROWED";
}

function isReturned(l: Lending): boolean {
  return l.returnedAt != null || deriveStatus(l) === "RETURNED";
}

function isOverdue(l: Lending): boolean {
  return !isReturned(l) && new Date(l.dueDate).getTime() < Date.now();
}

/* ------------------------------------------------------------------
   Form State (unchanged logic)
------------------------------------------------------------------- */
interface FormState {
  readerId: string;
  bookId: string;
  borrowDate: string; // yyyy-mm-dd
  loanDays: number;
  dueDate: string; // derived but editable
}

function getInitialForm(): FormState {
  const today = new Date();
  const borrowDate = toDateInputValue(today);
  const loanDays = 14;
  const dueDate = toDateInputValue(addDays(today, loanDays));
  return { readerId: "", bookId: "", borrowDate, loanDays, dueDate };
}

/* ------------------------------------------------------------------
   LendingPage Component (STYLING ONLY UPDATED TO MATCH BookManagement UI)
------------------------------------------------------------------- */
const LendingPage: React.FC = () => {
  // Data from server
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [readers, setReaders] = useState<Reader[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(getInitialForm());

  // Filters
  const [search, setSearch] = useState("");
  const [filterReader, setFilterReader] = useState<string>("All");
  const [filterBook, setFilterBook] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<LendingStatus | "All">("All");

  /* --------------------------------------------------------------
     Load Data (unchanged)
  --------------------------------------------------------------- */
  const loadAll = async () => {
    try {
      setLoading(true);
      const [lendingsData, booksData, readersData] = await Promise.all([
        getLendings(),
        getBooks(),
        getReaders(),
      ]);
      setLendings(lendingsData);
      setBooks(booksData);
      setReaders(readersData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load lending data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* --------------------------------------------------------------
     Form Change Handlers (unchanged)
  --------------------------------------------------------------- */
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next: FormState = {
        ...prev,
        [name]: name === "loanDays" ? Number(value) : value,
      };
      if (name === "loanDays") {
        const start = fromDateInputValue(prev.borrowDate) ?? new Date();
        next.dueDate = toDateInputValue(addDays(start, Number(value)));
      }
      if (name === "borrowDate") {
        const start = fromDateInputValue(value) ?? new Date();
        next.dueDate = toDateInputValue(addDays(start, prev.loanDays));
      }
      return next;
    });
  };

  const resetForm = () => setForm(getInitialForm());

  /* --------------------------------------------------------------
     Submit: Lend Book (unchanged)
  --------------------------------------------------------------- */
  const handleSubmitLend = async () => {
    if (!form.readerId || !form.bookId) {
      toast.error("Select reader and book");
      return;
    }
    try {
      setActionLoading(true);
      await lendBook({
        bookId: form.bookId,
        readerId: form.readerId,
        loanDays: form.loanDays,
      });
      toast.success("Lending created");
      resetForm();
      setFormOpen(false);
      await loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create lending");
    } finally {
      setActionLoading(false);
    }
  };

  /* --------------------------------------------------------------
     Action: Mark Returned (unchanged)
  --------------------------------------------------------------- */
  const handleReturn = async (lendingId: string) => {
    if (!window.confirm("Mark as returned?")) return;
    try {
      setActionLoading(true);
      await returnBook(lendingId);
      toast.success("Book returned");
      await loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark returned");
    } finally {
      setActionLoading(false);
    }
  };

  /* --------------------------------------------------------------
     Filtered View (unchanged logic)
  --------------------------------------------------------------- */
  const filteredLendings = useMemo(() => {
    const term = search.trim().toLowerCase();
    return lendings.filter((l) => {
      const rName = l.reader?.name?.toLowerCase?.() ?? "";
      const bTitle = l.book?.title?.toLowerCase?.() ?? "";
      const borrowStr = l.borrowedAt ? toDateInputValue(l.borrowedAt) : "";
      const dueStr = l.dueDate ? toDateInputValue(l.dueDate) : "";
      const status = deriveStatus(l);

      const matchesTerm =
        !term ||
        rName.includes(term) ||
        bTitle.includes(term) ||
        borrowStr.includes(term) ||
        dueStr.includes(term) ||
        status.toLowerCase().includes(term);

      const matchesReader = filterReader === "All" || l.reader?._id === filterReader;
      const matchesBook = filterBook === "All" || l.book?._id === filterBook;
      const matchesStatus = filterStatus === "All" || status === filterStatus;

      return matchesTerm && matchesReader && matchesBook && matchesStatus;
    });
  }, [lendings, search, filterReader, filterBook, filterStatus]);

  /* --------------------------------------------------------------
     Status Badge (restyled only)
  --------------------------------------------------------------- */
  const StatusBadge = ({ l }: { l: Lending }) => {
    const s = deriveStatus(l);
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    if (s === "RETURNED") {
      return <span className={`${base} bg-emerald-500/80 text-white`}>Returned</span>;
    }
    if (s === "OVERDUE") {
      return <span className={`${base} bg-rose-600/80 text-white`}>Overdue</span>;
    }
    return <span className={`${base} bg-amber-400/80 text-slate-900`}>Borrowed</span>;
  };

  /* --------------------------------------------------------------
     Loading State (restyled)
  --------------------------------------------------------------- */
  if (loading) {
    return (
  <Loading/>
    );
  }

  /* ------------------------------------------------------------------
     Shared Style Tokens (UI-only helpers)
  ------------------------------------------------------------------ */
  const inputBase =
    "w-full rounded-md px-3 py-2 text-sm bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition";

  const selectBase =
    "w-full rounded-md px-3 py-2 text-sm bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition";

  const btnBase =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";

  const btnIndigo = `${btnBase} bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-400`;
  const btnGreen = `${btnBase} bg-green-600 hover:bg-green-700 text-white focus:ring-green-400`;
  const btnGray = `${btnBase} bg-slate-600 hover:bg-slate-500 text-white focus:ring-slate-400`;

  /* --------------------------------------------------------------
     Render (BookManagement UI Match)
  --------------------------------------------------------------- */
  return (
    <main className="relative max-w-6xl mx-auto p-6 sm:p-8 md:p-10 rounded-2xl overflow-hidden text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl shadow-indigo-900/20 mt-8">
      {/* Decorative gradient blobs to echo global theme */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-purple-500/20 blur-3xl animate-pulse [animation-delay:1.5s]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="mb-8 pb-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 group">
            <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-transform group-hover:scale-105">
              {/* Decorative glyph */}
              <span className="block w-4 h-4 bg-white rounded-sm rotate-12" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Lending Management
              </h1>
              <p className="text-xs text-white/60">Manage active and past lendings</p>
            </div>
          </div>
        </header>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search (reader, book, date, status)"
            className={`${inputBase} col-span-1 md:col-span-2`}
            aria-label="Search lendings"
          />
          <select
            value={filterReader}
            onChange={(e) => setFilterReader(e.target.value)}
            className={selectBase}
            aria-label="Filter by reader"
          >
            <option value="All" className="text-black">All Readers</option>
            {readers.map((r) => (
              <option key={r._id} value={r._id} className="text-black">
                {r.name}
              </option>
            ))}
          </select>
          <select
            value={filterBook}
            onChange={(e) => setFilterBook(e.target.value)}
            className={selectBase}
            aria-label="Filter by book"
          >
            <option value="All" className="text-black">All Books</option>
            {books.map((b) => (
              <option key={b._id} value={b._id} className="text-black">
                {b.title}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as LendingStatus | "All")}
            className={selectBase}
            aria-label="Filter by status"
          >
            <option value="All" className="text-black">All Statuses</option>
            <option value="BORROWED" className="text-black">Borrowed</option>
            <option value="OVERDUE" className="text-black">Overdue</option>
            <option value="RETURNED" className="text-black">Returned</option>
          </select>
        </div>

        {/* Add New Lending Toggle */}
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className={`${btnIndigo} mb-6`}
            disabled={actionLoading}
          >
            + Add New Lending
          </button>
        )}

        {formOpen && (
          <div className="mb-8 p-6 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm shadow-inner space-y-4">
            <h2 className="text-lg font-semibold">Add New Lending</h2>

            {/* Reader */}
            <div>
              <label htmlFor="readerId" className="block mb-1 text-sm font-medium text-white/80">
                Reader
              </label>
              <select
                id="readerId"
                name="readerId"
                value={form.readerId}
                onChange={handleFormChange}
                className={selectBase}
              >
                <option value="" className="text-black">Select Reader</option>
                {readers.map((r) => (
                  <option key={r._id} value={r._id} className="text-black">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Book */}
            <div>
              <label htmlFor="bookId" className="block mb-1 text-sm font-medium text-white/80">
                Book
              </label>
              <select
                id="bookId"
                name="bookId"
                value={form.bookId}
                onChange={handleFormChange}
                className={selectBase}
              >
                <option value="" className="text-black">Select Book</option>
                {books.map((b) => (
                  <option key={b._id} value={b._id} className="text-black">
                    {b.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Borrow Date */}
            <div>
              <label htmlFor="borrowDate" className="block mb-1 text-sm font-medium text-white/80">
                Borrow Date
              </label>
              <input
                id="borrowDate"
                name="borrowDate"
                type="date"
                value={form.borrowDate}
                onChange={handleFormChange}
                className={inputBase}
              />
            </div>

            {/* Loan Days */}
            <div>
              <label htmlFor="loanDays" className="block mb-1 text-sm font-medium text-white/80">
                Loan Days
              </label>
              <input
                id="loanDays"
                name="loanDays"
                type="number"
                min={1}
                max={365}
                value={form.loanDays}
                onChange={handleFormChange}
                className={inputBase}
              />
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block mb-1 text-sm font-medium text-white/80">
                Due Date
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleFormChange}
                className={inputBase}
              />
            </div>

            {/* Form Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSubmitLend}
                disabled={actionLoading}
                className={btnGreen}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
                disabled={actionLoading}
                className={btnGray}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Lending Table */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Current Lendings</h2>
          {filteredLendings.length === 0 ? (
            <p className="text-white/70">No lending records found.</p>
          ) : (
            <div className="overflow-x-auto rounded shadow-lg mt-4">
              <table className="w-full table-auto border-collapse text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
                    <th className="border border-white/10 px-4 py-2 text-left">Reader</th>
                    <th className="border border-white/10 px-4 py-2 text-left">Book</th>
                    <th className="border border-white/10 px-4 py-2 text-left">Borrowed</th>
                    <th className="border border-white/10 px-4 py-2 text-left">Due</th>
                    <th className="border border-white/10 px-4 py-2 text-left">Status</th>
                    <th className="border border-white/10 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLendings.map((l) => {
                    const readerObj = l.reader as unknown as Reader;
                    const bookObj = l.book as unknown as Book;
                    return (
                      <tr
                        key={l._id}
                        className="hover:bg-white/5 transition odd:bg-white/10 even:bg-white/5"
                      >
                        <td className="border border-white/10 px-4 py-2 align-top">{readerObj?.name ?? "-"}</td>
                        <td className="border border-white/10 px-4 py-2 align-top">{bookObj?.title ?? "-"}</td>
                        <td className="border border-white/10 px-4 py-2 align-top">{formatDisplay(l.borrowedAt)}</td>
                        <td
                          className={`border border-white/10 px-4 py-2 align-top ${
                            isOverdue(l) ? "text-rose-400 font-semibold" : ""
                          }`}
                        >
                          {formatDisplay(l.dueDate)}
                        </td>
                        <td className="border border-white/10 px-4 py-2 align-top">
                          <StatusBadge l={l} />
                        </td>
                        <td className="border border-white/10 px-4 py-2 align-top whitespace-nowrap">
                          {!isReturned(l) ? (
                            <button
                              onClick={() => handleReturn(l._id)}
                              disabled={actionLoading}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50"
                            >
                              Mark Returned
                            </button>
                          ) : (
                            <span className="text-white/40 text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default LendingPage;
