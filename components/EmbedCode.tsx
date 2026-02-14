'use client'

import { useState } from 'react'
import { Copy, Check, Code } from 'lucide-react'

export default function EmbedCode({ chartId }: { chartId: string }) {
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState('light')
  
  const embedUrl = `${window.location.origin}/embed/${chartId}?theme=${theme}`
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="400" frameborder="0"></iframe>`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(iframeCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
        <Code size={20} className="text-blue-600" />
        Web Siteme Ekle
      </div>

      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setTheme('light')}
          className={`px-3 py-1 rounded-md text-sm ${theme === 'light' ? 'bg-white shadow-sm border font-bold' : 'text-slate-500'}`}
        >Light</button>
        <button 
          onClick={() => setTheme('dark')}
          className={`px-3 py-1 rounded-md text-sm ${theme === 'dark' ? 'bg-slate-800 text-white font-bold' : 'text-slate-500'}`}
        >Dark</button>
      </div>

      <div className="relative group">
        <pre className="p-4 bg-slate-900 text-blue-300 text-xs rounded-lg overflow-x-auto border border-slate-800">
          {iframeCode}
        </pre>
        <button 
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  )
}
