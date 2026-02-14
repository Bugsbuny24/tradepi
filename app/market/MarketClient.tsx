"use client";
import { Search, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function MarketClient({ initialCharts }: any) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = initialCharts.filter((c: any) => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">SnapLogic Market</h1>
        <input 
          type="text"
          placeholder="Analiz ara..."
          className="bg-[#111] border border-white/10 rounded-xl px-6 py-3 outline-none focus:border-purple-500 transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filtered.map((chart: any) => (
          <div key={chart.id} className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-8 hover:border-purple-500/50 transition-all">
            <h3 className="text-xl font-bold mb-4">{chart.title}</h3>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
              <span className="text-2xl font-black text-green-400">₺{chart.price}</span>
              <button className="bg-white text-black px-6 py-2 rounded-xl font-black text-sm hover:bg-purple-600 hover:text-white transition-all">SATIN AL</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

