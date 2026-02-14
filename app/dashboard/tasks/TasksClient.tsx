"use client";
import { CheckCircle2, Clock, AlertCircle, Plus } from 'lucide-react';

export default function TasksClient({ initialTasks }: any) {
  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Görev Merkezi</h1>
          <p className="text-gray-500 text-sm mt-1">Sistemdeki aktif işlerini ve ödülleri takip et.</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-transform active:scale-95">
          <Plus size={20} /> Yeni Görev Oluştur
        </button>
      </div>

      <div className="grid gap-4">
        {initialTasks.length === 0 ? (
          <div className="bg-[#111] border border-white/5 p-20 rounded-[2.5rem] text-center">
            <p className="text-gray-600 font-medium">Henüz bir görev bulunmuyor.</p>
          </div>
        ) : (
          initialTasks.map((task: any) => (
            <div key={task.id} className="bg-[#111] border border-white/5 p-6 rounded-3xl flex items-center justify-between hover:border-purple-500/50 transition-colors">
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl ${task.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  {task.status === 'completed' ? <CheckCircle2 /> : <Clock />}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{task.payload?.title || 'Detaysız Görev'}</h4>
                  <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mt-1">ID: #{task.id.slice(0,8)}</p>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-2xl font-black text-green-400">₺{task.reward_try || 0}</span>
                <p className="text-[10px] text-gray-600 font-bold uppercase mt-1">{task.status}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
