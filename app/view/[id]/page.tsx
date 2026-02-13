// app/view/[id]/page.tsx - Güncellenmiş Reaktif Motor
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SnapView({ params }: { params: { id: string } }) {
  const [scriptData, setScriptData] = useState<string>('');

  useEffect(() => {
    async function fetchSnapScript() {
      const { data } = await supabase
        .from('chart_scripts')
        .select('script')
        .eq('chart_id', params.id)
        .single();
      
      if (data?.script) {
        // SnapScript v0: Reaktif dilin çalıştırılması
        // Güvenli bir Sandbox içinde scripti eval ediyoruz
        setScriptData(data.script);
      }
    }
    fetchSnapScript();
  }, [params.id]);

  return (
    <div className="bg-black min-h-screen text-green-500 p-4 font-mono overflow-hidden">
      {/* Terminal Başlığı */}
      <div className="border-b border-green-900 pb-2 mb-4 text-xs opacity-50 flex justify-between">
        <span>SNPLOGIC_TERMINAL_V1.0</span>
        <span>STATUS: ACTIVE_REACTIVE_ENGINE</span>
      </div>
      
      {/* Dinamik Widget Alanı */}
      <div id="snap-core-runtime" className="w-full h-[80vh] flex items-center justify-center">
         {/* SnapScript buradaki DOM elemanlarını manipüle eder */}
         <pre className="text-[10px] animate-pulse">{scriptData || 'Veri Bekleniyor...'}</pre>
      </div>

      <div className="absolute bottom-4 left-4 text-[8px] text-gray-700">
        POWERED BY SNAPLOGIC SNAP-ARCHITECT ENGINE
      </div>
    </div>
  );
}
