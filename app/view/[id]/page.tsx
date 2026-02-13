'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

export default function TerminalView() {
  const { id } = useParams();
  const [chart, setChart] = useState<any>(null);
  const [script, setScript] = useState('');

  useEffect(() => {
    async function load() {
      const { data: c } = await supabase.from('charts').select('*').eq('id', id).single();
      const { data: s } = await supabase.from('chart_scripts').select('script').eq('chart_id', id).single();
      if (c) setChart(c);
      if (s) setScript(s.script);
    }
    load();
  }, [id]);

  if (!chart) return <div className="bg-black min-h-screen text-red-900 p-10">ERROR: NO_DATA_STREAM</div>;

  return (
    <div className="bg-black min-h-screen text-green-500 font-mono p-6">
      <div className="flex justify-between border-b border-green-900/30 pb-2 text-[10px] opacity-40">
        <span>ID: {chart.id}</span>
        <span>SNAPCORE_ENGINE_V1.0</span>
      </div>
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-2xl mb-10 tracking-widest">{chart.title}</h1>
        <div className="p-10 border border-green-500/20 rounded-full shadow-[0_0_50px_rgba(34,197,94,0.1)]">
           <pre className="text-xs">{script || '// Processing...'}</pre>
        </div>
      </div>
    </div>
  );
}
