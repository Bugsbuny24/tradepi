import { createClient } from '@/lib/supabase'
import { Plus, Key, Copy } from 'lucide-react'

export default async function ApiPage() {
  // Burası sadece API Key yönetimine odaklanır.
  // Kodlar bir önceki mesajdaki gibi ama repo hiyerarşisine uygun.
  return (
    <div className="p-8">
      <h1 className="text-3xl font-black">API Keys</h1>
      {/* ... API Key Tablosu ve Formu ... */}
    </div>
  )
}
