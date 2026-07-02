import { Heart, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const colorOptions = [
  { name: 'Blue', value: 'butter', swatchClass: 'bg-[#DCE8F7] dark:bg-[#0F1B3D]' },
  { name: 'Gold', value: 'mint', swatchClass: 'bg-[#F3EAB5] dark:bg-[#2A1710]' },
  { name: 'Green', value: 'sky', swatchClass: 'bg-[#E8F4E8] dark:bg-[#10251B]' },
  { name: 'Rose', value: 'rose', swatchClass: 'bg-[#F5E1EA] dark:bg-[#331526]' },
  { name: 'Lavender', value: 'lavender', swatchClass: 'bg-[#EEE7FF] dark:bg-[#23163D]' },
  { name: 'Apricot', value: 'apricot', swatchClass: 'bg-[#FFE6D5] dark:bg-[#3B2212]' }
]

export default function NoteEditorModal({ open, onClose, activeNote, draft, setDraft, onSave }) {
  const textareaRef = useRef(null)
  const [textareaHeight, setTextareaHeight] = useState('120px')

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    const nextHeight = textarea.scrollHeight
    textarea.style.height = `${nextHeight}px`
    setTextareaHeight(`${nextHeight}px`)
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [draft.body, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-[min(560px,95vw)] overflow-y-auto rounded-[18px] border border-slate-200/70 bg-white p-8 shadow-[0_30px_120px_rgba(15,23,42,0.25)] transition-all duration-300 dark:border-white/10 dark:bg-[#111827] sm:w-[90%]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-[Mulish] text-[24px] font-bold leading-none text-slate-900 dark:text-white">{activeNote ? 'Edit Note' : 'New Note'}</h3>
            <button
              type="button"
              onClick={() => setDraft((prev) => ({ ...prev, favorite: !prev.favorite }))}
              className={`rounded-full p-2 transition ${draft.favorite ? 'bg-rose-100 text-rose-500' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'}`}
            >
              <Heart size={16} className={draft.favorite ? 'fill-current' : ''} />
            </button>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-6">
          <div>
            <label className="mb-2 block font-[Mulish] text-[15px] font-bold text-slate-700 dark:text-slate-200">Title</label>
            <input
              value={draft.title}
              onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Title"
              className="h-[52px] w-full rounded-[12px] border border-[#D1D5DB] bg-white px-4 font-[Mulish] text-[15px] font-normal text-slate-900 outline-none transition focus:border-black focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-white dark:focus:shadow-[0_0_0_4px_rgba(255,255,255,0.08)]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-[Mulish] text-[15px] font-bold text-slate-700 dark:text-slate-200">Content</label>
            <textarea
              ref={textareaRef}
              value={draft.body}
              onChange={(event) => setDraft((prev) => ({ ...prev, body: event.target.value }))}
              onInput={adjustTextareaHeight}
              placeholder="Take a note..."
              rows={1}
              style={{ height: textareaHeight }}
              className="w-full resize-none overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-4 font-[Inter] text-[20px] font-normal leading-[1.6] tracking-[0] text-[#111827] outline-none transition focus:border-black focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)] dark:border-[#374151] dark:bg-[#111827] dark:text-[#F3F4F6] dark:focus:border-white dark:focus:shadow-[0_0_0_4px_rgba(255,255,255,0.08)] [overflow-wrap:anywhere] [white-space:pre-wrap] [word-break:break-word]"
            />
            <div className="mt-2 text-right text-xs text-slate-500">{draft.body.length} characters</div>
          </div>

          <div>
            <p className="mb-3 font-[Mulish] text-[15px] font-bold text-slate-700 dark:text-slate-200">Color</p>
            <div className="flex gap-3">
              {colorOptions.map((option) => {
                const isSelected = draft.color === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, color: option.value }))}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${isSelected ? 'scale-110 shadow-sm' : 'hover:scale-105'} ${isSelected ? 'border-black dark:border-white' : 'border-transparent'}`}
                  >
                    <span className={`h-8 w-8 rounded-full ${option.swatchClass}`} />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <button type="button" onClick={onClose} className="h-[46px] w-[96px] rounded-[12px] border border-slate-300 bg-white text-[16px] font-medium text-slate-900 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800">
              Cancel
            </button>
            <button type="submit" className="h-[46px] w-[150px] rounded-[12px] bg-slate-950 text-[16px] font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
