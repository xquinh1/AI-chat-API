import { ChevronDown } from 'lucide-react'

export function ModelSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="relative">
      <span className="sr-only">Select model</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="appearance-none rounded-lg bg-transparent py-2 pl-2 pr-7 text-sm font-medium text-stone-700 outline-none hover:bg-stone-100">
        <option>Gemini 3.5 Flash</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-stone-500" />
    </label>
  )
}
