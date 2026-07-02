import { X } from 'lucide-react'

export default function NoteReadModal({ open, note, onClose }) {
  if (!open || !note) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-[620px] overflow-y-auto rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_30px_120px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-slate-900 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Read note</p>
            <h3 className="mt-1 text-2xl font-semibold">{note.title}</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto">
          <p className="whitespace-pre-wrap text-[20px] leading-[1.7] text-slate-900 dark:text-[#F3F4F6]">{note.body}</p>
        </div>
      </div>
    </div>
  )
}
