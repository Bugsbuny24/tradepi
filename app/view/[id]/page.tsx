'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

export default function TerminalView() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { data: c } = await supabase.from('charts').select('*, chart_scripts(script)').eq('id', id).single();
      if (c) setData(c);
    }
    load();
  }, [id]);

  if (!data) return <div className="bg-black min-h-screen text-red-500 p-10 font-mono">ERR: STREAM_OFFLINE</div>;

  return (
    <div className="bg-black min-h-screen text-green-500 font-mono p-4 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-4 left-4 text-[10px] opacity-30 tracking-widest uppercase">
        SnapLogic Engine v1.0 // Protocol_Active
      </div>
      
      <div className="p-12 border border-green-500/10 rounded-full shadow-[0_0_100px_rgba(34,197,94,0.05)] relative z-10">
        <h1 className="text-3xl mb-8 text-center text-white font-black tracking-widest">{data.title}</h1>
        <div className="bg-black/50 p-6 rounded-lg border border-green-500/20">
          <pre className="text-xs text-green-400">
            {data.chart_scripts?.[0]?.script || '// Ready for data input...'}
          </pre>
        </div>
      </div>

      <div className="mt-12 text-[10px] text-gray-700 animate-pulse">
        REACTIVE COMPUTATION ACTIVE [SnapScript v0]
      </div>
    </div>
  );
}
