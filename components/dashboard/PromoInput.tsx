// components/dashboard/PromoInput.tsx
export default function PromoInput() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
      <div className="relative z-10 space-y-4">
        <h4 className="text-xl font-black italic">Kampanya Kodun mu Var?</h4>
        <p className="text-blue-200 text-xs font-medium">Kodunu buraya mühürle, anında kredi kazan.</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Örn: CHART1000" 
            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:bg-white/20 font-black uppercase placeholder:text-white/30"
          />
          <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs hover:bg-blue-400 hover:text-white transition-all">
            BOZDUR
          </button>
        </div>
      </div>
      <Zap className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10" size={200} />
    </div>
  )
}
