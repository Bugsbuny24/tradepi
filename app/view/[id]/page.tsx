'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

export default function ViewChart() {
  const { id } = useParams();
  const [chart, setChart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadChart() {
      // Grafik verisini çek
      const { data, error } = await supabase
        .from('charts')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Grafik bulunamadı veya erişim izni yok.');
      } else if (!data.is_public) {
        setError('Bu grafik gizli.');
      } else {
        setChart(data);
      }
      setLoading(false);
    }
    loadChart();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Yükleniyor...</div>;
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl p-8 border rounded-xl shadow-2xl bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">{chart.title}</h1>
        <p className="text-gray-500 text-center mb-8">Oluşturulma: {new Date(chart.created_at).toLocaleDateString()}</p>
        
        {/* GRAFİK ALANI */}
        <div className="aspect-video bg-white border border-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
                <span className="text-6xl block mb-4">
                    {chart.chart_type === 'bar' ? '📊' : chart.chart_type === 'pie' ? '🥧' : '📈'}
                </span>
                <p className="text-gray-400">Gerçek grafik motoru burada çalışacak.</p>
                <p className="text-xs text-gray-300 mt-2">Data ID: {chart.id}</p>
            </div>
        </div>

        <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">Powered by <span className="font-bold text-indigo-600">SnapLogic</span></p>
        </div>
      </div>
    </div>
  );
}
