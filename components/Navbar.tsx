'use client'

import { useState } from 'react'
import { Menu, X, LayoutDashboard, Globe, Settings, BarChart3, LogOut } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Araçlarım', href: '/dashboard/widgets', icon: <BarChart3 size={20} /> },
    { name: 'Mağaza', href: '/dashboard/marketplace', icon: <Globe size={20} /> },
    { name: 'Ayarlar', href: '/dashboard/settings', icon: <Settings size={20} /> },
  ]

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">SnapLogic</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors">
                {link.name}
              </Link>
            ))}
            <button className="text-slate-400 hover:text-red-600 transition-colors ml-4">
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-all"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[280px] bg-white shadow-2xl z-50 md:hidden p-6"
            >
              <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-4">
                <span className="font-bold text-slate-900">Menü</span>
                <button onClick={() => setIsOpen(false)}><X size={20} className="text-slate-400" /></button>
              </div>
              
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 font-bold transition-all"
                  >
                    {link.icon} {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto absolute bottom-8 left-6 right-6">
                <button className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-slate-50 text-red-600 font-bold hover:bg-red-50 transition-all border border-slate-100">
                  <LogOut size={20} /> Çıkış Yap
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
