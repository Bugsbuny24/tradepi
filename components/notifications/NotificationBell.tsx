'use client'

import { Bell } from 'lucide-react'
import { useState } from 'react'

export default function NotificationBell({ unreadCount = 0 }: { unreadCount: number }) {
  return (
    <div className="relative cursor-pointer group p-2 hover:bg-slate-100 rounded-full transition-all">
      <Bell className="text-slate-600 group-hover:text-blue-700" size={20} />
      
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  )
}
