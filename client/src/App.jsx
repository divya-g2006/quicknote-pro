import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Grip, Heart, Search } from 'lucide-react'
import { createNote, deleteNote, fetchNotes, reorderNotes, toggleFavorite, updateNote } from './api'
import Header from './components/Header'
import NoteCard from './components/NoteCard'
import NoteEditorModal from './components/NoteEditorModal'
import NoteReadModal from './components/NoteReadModal'

function App() {
  const [notes, setNotes] = useState([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [isDark, setIsDark] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [showReader, setShowReader] = useState(false)
  const [activeNote, setActiveNote] = useState(null)
  const [draft, setDraft] = useState({ title: '', body: '', color: 'butter', favorite: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('quicknotes-theme')
    if (savedTheme === 'dark') setIsDark(true)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await fetchNotes()
        setNotes(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadNotes()
  }, [])

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesQuery = `${note.title} ${note.body}`.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'all' || (filter === 'favorites' && note.favorite)
      return matchesQuery && matchesFilter
    })
  }, [notes, query, filter])

  const openCreate = () => {
    setDraft({ title: '', body: '', color: 'butter', favorite: false })
    setActiveNote(null)
    setShowEditor(true)
  }

  const openEdit = (note) => {
    setActiveNote(note)
    setDraft({ title: note.title, body: note.body, color: note.color, favorite: note.favorite })
    setShowEditor(true)
  }

  const openRead = (note) => {
    setActiveNote(note)
    setShowReader(true)
  }

  const closeEditor = () => {
    setShowEditor(false)
    setActiveNote(null)
  }

  const closeReader = () => {
    setShowReader(false)
    setActiveNote(null)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!draft.title.trim()) return

    try {
      if (activeNote) {
        const updated = await updateNote(activeNote.id, {
          title: draft.title.trim(),
          body: draft.body.trim(),
          color: draft.color,
          favorite: draft.favorite
        })
        setNotes((prev) => prev.map((note) => (note.id === updated.id ? updated : note)))
      } else {
        const created = await createNote({
          title: draft.title.trim(),
          body: draft.body.trim(),
          color: draft.color,
          favorite: draft.favorite,
          order: 0
        })
        setNotes((prev) => [created, ...prev])
      }
      closeEditor()
    } catch (error) {
      console.error(error)
    }
  }

  const handleFavorite = async (note) => {
    const updated = await toggleFavorite(note.id)
    setNotes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
  }

  const handleDelete = async (note) => {
    if (!window.confirm('Delete this note?')) return
    await deleteNote(note.id)
    setNotes((prev) => prev.filter((item) => item.id !== note.id))
  }

  const handleDuplicate = async (note) => {
    const created = await createNote({
      title: `${note.title} (Copy)`,
      body: note.body,
      color: note.color,
      favorite: false,
      order: 0
    })
    setNotes((prev) => [created, ...prev])
  }

  const handleDownload = (note) => {
    const blob = new Blob([`${note.title}\n\n${note.body}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${note.title || 'note'}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleReorder = async (sourceId, targetId) => {
    const updatedIds = notes.map((note) => note.id)
    const sourceIndex = updatedIds.indexOf(sourceId)
    const targetIndex = updatedIds.indexOf(targetId)
    updatedIds.splice(sourceIndex, 1)
    updatedIds.splice(targetIndex, 0, sourceId)
    await reorderNotes(updatedIds)
    const refreshed = await fetchNotes()
    setNotes(refreshed)
  }

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    localStorage.setItem('quicknotes-theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <div className={`app-shell min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#050505] text-slate-50' : 'bg-[#fafafb] text-slate-900'}`}>
      <Header title="QuickNotes Dashboard" onCreate={openCreate} onToggleTheme={toggleTheme} isDark={isDark} />

      <main className="flex w-full flex-col gap-6 px-6 py-6 sm:px-7 lg:px-8 lg:py-8">
        <section className={`rounded-[24px] border p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-6 ${isDark ? 'border-white/10 bg-[#0b0b0b]/90' : 'border-slate-200/80 bg-white/80'}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-[28px] font-semibold sm:text-[32px]">Your Notes</h2>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {filteredNotes.length} of {notes.length} notes visible
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className={`relative w-full sm:w-[300px] ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notes..."
                  className={`h-11 w-full rounded-[10px] border px-9 text-sm outline-none ${isDark ? 'border-white/10 bg-[#111111] text-slate-100 placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400'}`}
                />
              </div>

              <button onClick={() => setFilter('all')} className={`flex h-11 items-center gap-2 rounded-[10px] px-4 text-sm font-medium transition ${filter === 'all' ? (isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white') : (isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-700')}`}>
                All
                <span className={`rounded-full px-2 py-0.5 text-xs ${filter === 'all' ? (isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900') : (isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-600')}`}>{notes.length}</span>
              </button>
              <button onClick={() => setFilter('favorites')} className={`flex h-11 items-center gap-2 rounded-[10px] px-4 text-sm font-medium transition ${filter === 'favorites' ? (isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white') : (isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-700')}`}>
                <Heart className="h-4 w-4" />
                Favorites
                <span className={`rounded-full px-2 py-0.5 text-xs ${filter === 'favorites' ? (isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900') : (isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-600')}`}>{notes.filter((note) => note.favorite).length}</span>
              </button>
            </div>
          </div>

          <div className={`mt-4 flex h-10 items-center gap-2 rounded-[12px] px-3 text-sm ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            <Grip className="h-4 w-4" />
            <span>Drag and drop notes to reorder them.</span>
          </div>
        </section>

        {loading ? (
          <div className={`rounded-[24px] border p-6 text-sm ${isDark ? 'border-white/10 bg-[#0b0b0b]/70 text-slate-400' : 'border-slate-200 bg-white/70 text-slate-600'}`}>Loading notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div className={`rounded-[24px] border p-10 text-center ${isDark ? 'border-white/10 bg-[#0b0b0b]/70 text-slate-400' : 'border-slate-200 bg-white/70 text-slate-600'}`}>
            <BookOpen className="mx-auto mb-3 h-8 w-8" />
            <p className="text-lg font-medium text-slate-900 dark:text-slate-50">No notes yet</p>
            <p className="mt-2 text-sm">Create your first note to start organizing your ideas.</p>
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onFavorite={handleFavorite}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onCopy={(n) => navigator.clipboard.writeText(`${n.title}\n\n${n.body}`)}
                onDownload={handleDownload}
                onRead={openRead}
                onEdit={openEdit}
                onDragStart={(event) => event.dataTransfer.setData('text/plain', note.id)}
                onDrop={(event) => {
                  event.preventDefault()
                  const draggedId = event.dataTransfer.getData('text/plain')
                  if (draggedId && draggedId !== note.id) handleReorder(draggedId, note.id)
                }}
              />
            ))}
          </section>
        )}
      </main>

      <footer className={`flex flex-col gap-3 border-t px-6 py-6 text-sm sm:flex-row sm:items-center sm:justify-between ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
        <span>Made with ❤️ by Divya for QuickNotes Dashboard</span>
        <div className="flex gap-4">
          <span>About</span>
          <span>Contact</span>
          <span>Privacy</span>
        </div>
      </footer>

      <NoteEditorModal open={showEditor} onClose={closeEditor} activeNote={activeNote} draft={draft} setDraft={setDraft} onSave={handleSave} />
      <NoteReadModal open={showReader} note={activeNote} onClose={closeReader} />
    </div>
  )
}

export default App
