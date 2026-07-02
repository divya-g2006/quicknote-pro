import { BookOpen, Moon, Plus, Sun } from 'lucide-react'

export default function Header({ title, onCreate, onToggleTheme, isDark }) {
  return (
    <header className={`sticky top-0 z-40 h-[70px] border-b backdrop-blur ${isDark ? 'border-white/10 bg-[#0b0b0b]' : 'border-slate-200/80 bg-white'}`}>
      <div className="flex h-full w-full items-center justify-between px-6 sm:px-7 lg:px-8">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${isDark ? 'bg-white/10 text-white' : 'bg-slate-900 text-white'}`}>
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold leading-none">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={onCreate} className={`flex items-center gap-2 rounded-[10px] px-4 py-2 text-sm font-medium transition ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
            <Plus className="h-4 w-4" />
            Add Note
          </button>
          <button onClick={onToggleTheme} className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${isDark ? 'border-white/10 bg-white/10 text-white' : 'border-slate-200 bg-white text-slate-700'}`}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
