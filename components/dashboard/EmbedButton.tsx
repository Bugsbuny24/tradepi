'use client'
import { useState } from 'react'
import { Code, Check, Copy } from 'lucide-react'

export default function EmbedButton({ chartId }: { chartId: string }) {
  const [copied, setCopied] = useState(false)

  const embedCode = `<iframe src="https://snaplogic.io/embed/${chartId}" width="100%" height="400" frameborder="0"></iframe>`

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button 
      onClick={handleCopy}
      className={`w-full py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
    >
      {copied ? (
        <>KOPYALANDI! <Check size={14} /></>
      ) : (
        <>EMBED KODUNU AL <Code size={14} /></>
      )}
    </button>
  )
}
