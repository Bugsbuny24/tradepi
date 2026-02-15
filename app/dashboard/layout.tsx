import Link from 'next/link'
import { Layout, Code, Terminal, Zap, Share2 } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-black text-blue-600 italic">SnapLogic.io</Link>
            <div className="hidden md:flex gap-6 text-sm font-bold text-slate-500">
              <Link href="/dashboard/embeds" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Share2 size={16} /> Embeds
              </Link>
              <Link href="/dashboard/api" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Zap size={16} /> API Keys
              </Link>
              <Link href="/dashboard/scripts" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Terminal size={16} /> Scripts
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
