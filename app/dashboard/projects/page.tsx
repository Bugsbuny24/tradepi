'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('charts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setProjects(data);
      setLoading(false);
    }
    loadProjects();
  }, []);

  const deleteProject = async (id: string) => {
    if(!confirm('Bu projeyi silmek istediğine emin misin?')) return;
    
    await supabase.from('charts').delete().eq('id', id);
    setProjects(projects.filter(p => p.id !== id));
  };

  if (loading) return <div className="p-8 text-white">Projeler yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projelerim</h1>
        <Link href="/dashboard/designer" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-bold">
          + Yeni Oluştur
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-800">
          <p className="text-gray-400 mb-4">Henüz hiç projen yok.</p>
          <Link href="/dashboard/designer" className="text-indigo-400 hover:text-indigo-300">Hemen başla →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-500 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-xl">
                  {p.chart_type === 'bar' ? '📊' : p.chart_type === 'pie' ? '🥧' : '📈'}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => deleteProject(p.id)} className="text-red-400 hover:text-red-300 text-sm">Sil</button>
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-1">{p.title}</h3>
              <p className="text-xs text-gray-500 mb-4">{new Date(p.created_at).toLocaleDateString()}</p>
              
              <div className="flex gap-2 mt-4">
                <Link 
                  href={`/view/${p.id}`} 
                  target="_blank"
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-center py-2 rounded text-sm transition-colors"
                >
                  👁️ Önizle
                </Link>
                <button className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 text-center py-2 rounded text-sm transition-colors">
                  ✏️ Düzenle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
