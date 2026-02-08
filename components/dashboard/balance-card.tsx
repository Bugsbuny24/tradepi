import Link from "next/link";

export default function BalanceCard({ planTitle, planCode, quotas }: any) {
  const fmt = (n: number) => n?.toLocaleString("tr-TR") || "0";

  const stats = [
    { label: "Embed Views", val: quotas.embed_view_remaining, color: "text-yellow-500", glow: "shadow-yellow-500/10" },
    { label: "API Calls", val: quotas.api_call_remaining, color: "text-blue-400", glow: "shadow-blue-500/10" },
    { label: "Widget Loads", val: quotas.widget_load_remaining, color: "text-purple-400", glow: "shadow-purple-500/10" },
    { label: "No Watermark", val: quotas.watermark_off_views_remaining, color: "text-green-400", glow: "shadow-green-500/10" },
    { label: "Human Tasks", val: quotas.human_task_remaining, color: "text-orange-400", glow: "shadow-orange-500/10" },
    { label: "Human Mins", val: quotas.human_minute_remaining, color: "text-pink-400", glow: "shadow-pink-500/10" },
  ];

  return (
    <div className="rounded-[32px] border border-white/5 bg-[#050505] p-8 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">SnapLogic Network</span>
          <h2 className="text-4xl font-black italic tracking-tighter text-yellow-500 uppercase leading-none mt-1">
            {planTitle} <span className="text-xs font-normal text-gray-700 not-italic ml-2">v1.0</span>
          </h2>
        </div>
        <Link href="/topup" className="group relative flex items-center gap-2 rounded-2xl bg-yellow-500 px-8 py-4 text-xs font-black uppercase text-black transition-all hover:scale-105 active:scale-95">
          <span>Kredi Yükle</span>
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className={`group relative rounded-2xl border border-white/5 bg-black/40 p-5 transition-all hover:border-yellow-500/20 ${s.glow} hover:shadow-lg`}>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500">{s.label}</div>
            <div className={`mt-2 font-mono text-2xl font-bold tracking-tight ${s.color}`}>
              {fmt(s.val)}
            </div>
            <div className="absolute bottom-2 right-4 text-[8px] font-black text-white/5 uppercase opacity-0 transition-opacity group-hover:opacity-100">Active</div>
          </div>
        ))}
      </div>
    </div>
  );
}
