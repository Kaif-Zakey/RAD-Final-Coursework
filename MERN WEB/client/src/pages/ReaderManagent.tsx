import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import type { Reader, ReaderFormData } from "../types/Reader"
import {
  createReader,
  deleteReader,
  getReaders,
  updateReader,
} from "../services/readerService"
import Loading from "../components/PageLoading"


const ReaderManagement: React.FC = () => {
  const [readers, setReaders] = useState<Reader[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ReaderFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDomain, setFilterDomain] = useState("All")
  const[loading, setLoading] = useState<boolean>(true)

  // Load readers
  const loadReaders = async () => {
    try {
      setLoading(true)
      const data = await getReaders()
      setReaders(data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load readers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReaders()
  }, [])

  // Controlled inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Email domains (guard invalid emails)
  const emailDomains = Array.from(
    new Set(
      readers
        .map(r => {
          const parts = (r.email || "").split("@")
          return parts.length === 2 ? parts[1] : null
        })
        .filter((d): d is string => Boolean(d))
    )
  )

  // Filtered list
  const filteredReaders = readers.filter(reader => {
    const name = reader.name?.toLowerCase() ?? ""
    const email = reader.email?.toLowerCase() ?? ""
    const phone = reader.phone?.toString() ?? ""
    const term = searchTerm.toLowerCase()

    const matchesSearch =
      name.includes(term) || email.includes(term) || phone.includes(searchTerm)
    const matchesDomain =
      filterDomain === "All" ||
      (reader.email && reader.email.endsWith("@" + filterDomain))

    return matchesSearch && matchesDomain
  })

  // Add
  const handleAddReader = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Name, Email, and Phone are required")
      return
    }
    try {
      const newReader = await createReader({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address?.trim() || undefined,
      })
      setReaders(prev => [...prev, newReader])
      toast.success("Reader added")
      resetForm()
      setIsAdding(false)
    } catch (err) {
      console.error(err)
      toast.error("Failed to add reader")
    }
  }

  // Start edit
  const startEditing = (reader: Reader) => {
    setEditingId(reader._id)
    setFormData({
      name: reader.name ?? "",
      email: reader.email ?? "",
      phone: reader.phone ?? "",
      address: reader.address ?? "",
    })
  }

  // Cancel
  const cancelEditing = () => {
    setEditingId(null)
    resetForm()
  }

  // Save edit
  const saveEditing = async (id: string) => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Name, Email, and Phone are required")
      return
    }
    try {
      const updated = await updateReader(id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address?.trim() || undefined,
      })
      setReaders(prev => prev.map(r => (r._id === id ? updated : r)))
      toast.success("Reader updated")
      setEditingId(null)
      resetForm()
    } catch (err) {
      console.error(err)
      toast.error("Failed to update reader")
    }
  }

  // Delete
  const handleDeleteReader = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this reader?")) return
    try {
      await deleteReader(id)
      setReaders(prev => prev.filter(r => r._id !== id))
      toast.success("Reader deleted")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete reader")
    }
  }

  const resetForm = () =>
    setFormData({ name: "", email: "", phone: "", address: "" })

 
  const inputBase =
    "w-full rounded-md px-3 py-2 text-sm bg-slate-800/60 text-slate-100 placeholder-slate-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"

  const btnBase =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900"

  const btnIndigo = `${btnBase} bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 focus:ring-indigo-400`
  const btnGreen = `${btnBase} bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-500 hover:to-green-500 focus:ring-emerald-400`
  const btnGray = `${btnBase} bg-slate-600 text-white hover:bg-slate-500 focus:ring-slate-400`
  const btnRed = `${btnBase} bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 focus:ring-rose-400`


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    )
  }

  return (
    <div className="relative max-w-7xl mx-auto p-6 sm:p-8 md:p-10 rounded-xl overflow-hidden text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl shadow-indigo-900/20">
      {/* Subtle animated gradient blobs to echo Sidebar visuals */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-purple-500/20 blur-3xl animate-pulse [animation-delay:1.5s]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="mb-8 pb-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 group">
            <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-transform group-hover:scale-105">
              {/* Decorative book icon style block - using pseudo box since no new imports allowed */}
              <span className="block w-4 h-4 bg-white rounded-sm rotate-[-10deg]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Reader Management
              </h1>
              <p className="text-xs text-white/60">Manage library readers</p>
            </div>
          </div>
        </header>

        {/* Search + filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={inputBase}
          />
          <select
            value={filterDomain}
            onChange={e => setFilterDomain(e.target.value)}
            className="w-full md:w-56 rounded-md px-3 py-2 text-sm bg-slate-800/60 text-slate-100 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
          >
            <option value="All">All Email Domains</option>
            {emailDomains.map(domain => (
              <option key={domain} value={domain} className="bg-slate-900 text-slate-100">
                {domain}
              </option>
            ))}
          </select>
        </div>

        {/* Add form trigger */}
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className={btnIndigo}>
            + Add New Reader
          </button>
        )}

        {/* Add form */}
        {isAdding && (
          <div className="mb-8 mt-4 p-6 rounded-xl border border-white/10 bg-slate-800/60 backdrop-blur-sm shadow-inner">
            <h2 className="text-lg font-semibold mb-4">Add New Reader</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className={inputBase}
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={inputBase}
              />
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputBase}
              />
              <input
                name="address"
                placeholder="Address"
                value={formData.address || ""}
                onChange={handleChange}
                className={inputBase}
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={handleAddReader} className={btnGreen}>
                Save
              </button>
              <button
                onClick={() => {
                  setIsAdding(false)
                  resetForm()
                }}
                className={btnGray}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Table / List */}
        <div className="mt-6">{/* wrapper spacing */}
          {filteredReaders.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-white/10 bg-slate-800/40 backdrop-blur-sm">
              <p className="text-sm text-white/70">No readers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-800/40 backdrop-blur-sm shadow-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-300 bg-slate-800/60">
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-4 py-3 font-semibold">Address</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReaders.map(reader =>
                    editingId === reader._id ? (
                      <tr key={reader._id} className="bg-yellow-300/10 hover:bg-yellow-300/20 transition">
                        <td className="px-4 py-3 align-top">
                          <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={inputBase}
                          />
                        </td>
                        <td className="px-4 py-3 align-top">
                          <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputBase}
                          />
                        </td>
                        <td className="px-4 py-3 align-top">
                          <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={inputBase}
                          />
                        </td>
                        <td className="px-4 py-3 align-top">
                          <input
                            name="address"
                            value={formData.address || ""}
                            onChange={handleChange}
                            className={inputBase}
                          />
                        </td>
                        <td className="px-4 py-3 align-top whitespace-nowrap">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => saveEditing(reader._id)}
                              className={btnGreen}
                            >
                              Save
                            </button>
                            <button onClick={cancelEditing} className={btnGray}>
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr
                        key={reader._id}
                        className="odd:bg-slate-800/30 even:bg-slate-800/10 hover:bg-slate-700/40 transition"
                      >
                        <td className="px-4 py-3 align-top text-slate-100">{reader.name}</td>
                        <td className="px-4 py-3 align-top text-slate-100 break-all">{reader.email}</td>
                        <td className="px-4 py-3 align-top text-slate-100">{reader.phone}</td>
                        <td className="px-4 py-3 align-top text-slate-100">{reader.address || "—"}</td>
                        <td className="px-4 py-3 align-top whitespace-nowrap">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => startEditing(reader)}
                              className={btnIndigo}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReader(reader._id)}
                              className={btnRed}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReaderManagement
