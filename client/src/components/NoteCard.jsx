import { Copy, Download, Eye, GripVertical, Heart, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function NoteCard({ note, onFavorite, onDelete, onDuplicate, onCopy, onDownload, onRead, onEdit, onDragStart, onDrop }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef()

  useEffect(() => {
    const onDocClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const handleCopy = () => {
    if (onCopy) onCopy(note)
    setOpen(false)
  }

  const surface = note.color === 'mint'
    ? 'bg-[#E8F4E8] text-[#1B4332] dark:bg-[#10251B] dark:text-[#ECFDF5]'
    : note.color === 'sky'
      ? 'bg-[#DCE8F7] text-[#1F2937] dark:bg-[#0F1B3D] dark:text-[#E5E7EB]'
      : note.color === 'rose'
        ? 'bg-[#F5E1EA] text-[#4A154B] dark:bg-[#331526] dark:text-[#FCE7F3]'
        : note.color === 'lavender'
          ? 'bg-[#EEE7FF] text-[#43315D] dark:bg-[#23163D] dark:text-[#F3E8FF]'
          : 'bg-[#F3EAB5] text-[#3B2300] dark:bg-[#2A1710] dark:text-[#F3F4F6]'

  return (
    <article
      onClick={() => onEdit(note)}
      draggable
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={(event) => event.preventDefault()}
      className={`group cursor-pointer rounded-[16px] border border-slate-200/70 p-6 shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.1)] ${surface}`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <GripVertical size={16} className="mt-1 shrink-0 text-slate-500" />
          <div className="min-w-0">
            <h2 className="truncate text-[16px] font-semibold">{note.title}</h2>
            <p className="mt-1 text-[12px] opacity-70">{new Date(note.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="relative shrink-0" ref={menuRef}>
          <button onClick={(event) => { event.stopPropagation(); onFavorite(note) }} className={`rounded-full p-2 transition ${note.favorite ? 'text-rose-500' : 'opacity-80 hover:bg-black/5 dark:hover:bg-white/10'}`}>
            <Heart size={16} className={note.favorite ? 'fill-current' : ''} />
          </button>
          <button onClick={(event) => { event.stopPropagation(); setOpen((value) => !value) }} className="ml-1 rounded-full p-2 opacity-80 transition hover:bg-black/5 dark:hover:bg-white/10">
            <MoreVertical size={16} />
          </button>

          {open && (
            <div className="absolute right-0 z-20 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl" onClick={(event) => event.stopPropagation()}>
              <button onClick={() => { onRead(note); setOpen(false) }} className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"> <Eye size={14} /> Read</button>
              <button onClick={() => { onEdit(note); setOpen(false) }} className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"> <Pencil size={14} /> Edit</button>
              <button onClick={() => { onDuplicate(note); setOpen(false) }} className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"> <Copy size={14} /> Duplicate</button>
              <button onClick={handleCopy} className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"> <Copy size={14} /> Copy Content</button>
              <button onClick={() => { onDownload(note); setOpen(false) }} className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"> <Download size={14} /> Download</button>
              <button onClick={() => { onDelete(note); setOpen(false) }} className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-rose-600 transition hover:bg-slate-100"> <Trash2 size={14} /> Delete</button>
            </div>
          )}
        </div>
      </div>

      <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 opacity-90">{note.body}</p>
    </article>
  )
}
