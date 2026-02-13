'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function SnapDesigner() {
  const [title, setTitle] = useState('Yeni Snap Projesi');
  const [script, setScript] = useState('// SnapScript v0 kodunu buraya yazın\nchart.render();');
  const [userRole, setUserRole] = useState('none');

  useEffect(() => {
    async function getRole() {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
      if (data) setUserRole(data.role);
    }
    getRole();
  }, []);

  const handleSave = async () => {
    const { data: chart } = await supabase.from('charts').insert([{ title, user_id: (await supabase.auth.getUser()).data.user?.id }]).select().single();
    if (chart) {
      await supabase.from('chart_scripts').insert([{ chart_id: chart.id, script: script }]);
      alert("Terminal Projesi Kaydedildi!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <div className="flex justify-between border-b border-green-900 pb-4 mb-8">
        <h1 className="text-green-500 uppercase tracking-widest">Snap-Architect Terminal</h1>
        <button onClick={handleSave} className="bg-green-600 px-6 py-2 rounded font-bold hover:bg-green-500 transition-colors">PROJEYİ MÜHÜRLE</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent border border-gray-800 p-3 text-xl text-green-400 focus:border-green-600 outline-none" />
          
          {userRole !== 'none' ? (
            <textarea value={script} onChange={(e) => setScript(e.target.value)} className="w-full h-96 bg-gray-900 border border-gray-800 p-4 text-xs text-green-500 font-mono focus:border-green-600 outline-none rounded-xl" />
          ) : (
            <div className="h-96 bg-gray-900/50 border border-red-900/30 flex items-center justify-center p-8 text-center rounded-xl">
              <p className="text-red-400">SnapScript Motoru Pasif. Lütfen Geliştirici S1 veya üzeri bir paket alın.</p>
            </div>
          )}
        </div>
        
        <div className="bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center relative">
          <span className="absolute top-4 left-4 text-[10px] text-gray-700">PREVIEW_MODE</span>
          <div className="text-center animate-pulse">
            <p className="text-4xl">📊</p>
            <p className="text-gray-500 mt-2">Dinamik Önizleme Aktif</p>
          </div>
        </div>
      </div>
    </div>
  );
}
