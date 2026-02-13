"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { 
  Lock, ArrowLeft, Share2, Code, Eye, Download, 
  BarChart3, LineChart, PieChart, TrendingUp,
  Calendar, User, Globe, DollarSign, Copy, Check
} from "lucide-react";
import Link from "next/link";

const CHART_TYPE_ICONS: any = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  donut: TrendingUp
};

export default function ChartDetailPage({ params }: { params: { id: string } }) {
  const [chart, setChart] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [owner, setOwner] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchChart() {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      // Get chart with owner info
      const { data: chartData } = await supabase
        .from("charts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!chartData) {
        setLoading(false);
        return;
      }

      // Get owner profile
      const { data: ownerData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", chartData.user_id)
        .single();

      // Get chart data
      const { data: dataEntries } = await supabase
        .from("data_entries")
        .select("*")
        .eq("chart_id", params.id)
        .order("sort_order", { ascending: true });

      setChart(chartData);
      setOwner(ownerData);
      setData(dataEntries || []);

      // Check if user is owner or has paid
      if (user && user.id === chartData.user_id) {
        setHasPaid(true);
      }

      setLoading(false);
    }
    fetchChart();
  }, [params.id]);

  const handlePayment = async () => {
    alert("💳 Ödeme sistemi yakında aktif olacak!");
    // TODO: İyzico/Stripe entegrasyonu buraya gelecek
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const embedCode = `<iframe src="${shareUrl.replace('/dashboard/chart/', '/embed/')}" width="600" height="400" frameborder="0"></iframe>`;

  const isOwner = currentUser && chart && currentUser.id === chart.user_id;
  const canView = !chart?.is_locked || hasPaid || isOwner;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-yellow-500 font-black animate-pulse uppercase italic text-xl">
          Loading Chart...
        </div>
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white p-6">
        <div className="text-center">
          <h1 className="text-2xl font-black mb-4">Chart Not Found</h1>
          <Link href="/dashboard" className="text-yellow-500 underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const ChartIcon = CHART_TYPE_ICONS[chart.chart_type] || BarChart3;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-6 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-gray-500 hover:text-yellow-500 transition-colors text-xs font-black uppercase"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>

          {isOwner && (
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/designer?edit=${chart.id}`}
                className="px-4 py-2 bg-white/5 text-white rounded-xl text-xs font-black uppercase hover:bg-white/10 transition-all"
              >
                Edit Chart
              </Link>
            </div>
          )}
        </div>

        {/* Chart Info Header */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-yellow-500/10 rounded-2xl">
                <ChartIcon className="text-yellow-500" size={32} />
              </div>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-black italic uppercase mb-2">
                  {chart.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(chart.created_at).toLocaleDateString()}
                  </div>
                  
                  <div className="h-3 w-px bg-white/10"></div>
                  
                  <div className="flex items-center gap-1">
                    <ChartIcon size={12} />
                    {chart.chart_type.toUpperCase()}
                  </div>
                  
                  <div className="h-3 w-px bg-white/10"></div>
                  
                  <div className="flex items-center gap-1">
                    {chart.is_public ? (
                      <>
                        <Globe size={12} className="text-green-500" />
                        <span className="text-green-500">Public</span>
                      </>
                    ) : (
                      <>
                        <Lock size={12} className="text-gray-500" />
                        <span>Private</span>
                      </>
                    )}
                  </div>

                  {chart.is_locked && (
                    <>
                      <div className="h-3 w-px bg-white/10"></div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} className="text-yellow-500" />
                        <span className="text-yellow-500">{chart.price} TRY</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  copyToClipboard(shareUrl);
                }}
                className="p-3 bg-white/5 text-gray-400 rounded-xl hover:text-yellow-500 hover:bg-white/10 transition-all"
                title="Copy Link"
              >
                {copied ? <Check size={18} /> : <Share2 size={18} />}
              </button>

              <button
                onClick={() => setShowEmbedCode(!showEmbedCode)}
                className="p-3 bg-white/5 text-gray-400 rounded-xl hover:text-yellow-500 hover:bg-white/10 transition-all"
                title="Embed Code"
              >
                <Code size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Embed Code (if shown) */}
        {showEmbedCode && (
          <div className="bg-[#0A0A0A] border border-yellow-500/30 p-6 rounded-3xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black uppercase text-yellow-500">Embed Code</h3>
              <button
                onClick={() => copyToClipboard(embedCode)}
                className="px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-xl text-xs font-black uppercase hover:bg-yellow-500 hover:text-black transition-all"
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto text-xs text-gray-400">
              <code>{embedCode}</code>
            </pre>
          </div>
        )}

        {/* Main Content */}
        {chart.is_locked && !canView ? (
          // Locked View
          <div className="bg-[#0A0A0A] border border-white/5 p-12 rounded-3xl text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-black mb-6 mx-auto">
                <Lock size={40} />
              </div>
              
              <h2 className="text-2xl font-black uppercase mb-4">
                This Chart is Locked
              </h2>
              
              <p className="text-gray-500 text-sm mb-8">
                Pay {chart.price} TRY to unlock and view this chart
              </p>

              <button
                onClick={handlePayment}
                className="bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black text-sm uppercase hover:bg-yellow-400 transition-all inline-flex items-center gap-2"
              >
                <DollarSign size={18} />
                Unlock Chart
              </button>
            </div>
          </div>
        ) : (
          // Chart View
          <>
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl">
              <ChartVisualization 
                data={data} 
                type={chart.chart_type}
                title={chart.title}
              />
            </div>

            {/* Data Table */}
            <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl">
              <h3 className="text-sm font-black uppercase text-gray-500 mb-4">
                Data Points
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-xs font-black uppercase text-gray-500">
                        #
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-black uppercase text-gray-500">
                        Label
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-black uppercase text-gray-500">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {i + 1}
                        </td>
                        <td className="py-3 px-4 text-sm text-white">
                          {item.label}
                        </td>
                        <td className="py-3 px-4 text-sm text-yellow-500 font-bold text-right">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl">
            <div className="text-xs text-gray-500 uppercase font-black mb-2">
              Data Points
            </div>
            <div className="text-2xl font-black text-white">
              {data.length}
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl">
            <div className="text-xs text-gray-500 uppercase font-black mb-2">
              Total Value
            </div>
            <div className="text-2xl font-black text-yellow-500">
              {data.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl">
            <div className="text-xs text-gray-500 uppercase font-black mb-2">
              Average
            </div>
            <div className="text-2xl font-black text-white">
              {data.length > 0 
                ? (data.reduce((sum, item) => sum + item.value, 0) / data.length).toFixed(2)
                : '0'
              }
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl">
            <div className="text-xs text-gray-500 uppercase font-black mb-2">
              Max Value
            </div>
            <div className="text-2xl font-black text-green-500">
              {data.length > 0 
                ? Math.max(...data.map(d => d.value)).toFixed(2)
                : '0'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Chart Visualization Component
function ChartVisualization({ data, type, title }: { data: any[], type: string, title: string }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (type === 'bar') {
    return (
      <div className="space-y-4">
        <div className="h-64 flex items-end justify-center gap-2 md:gap-4 px-4">
          {data.map((item, i) => (
            <div key={i} className="flex-1 max-w-[80px] flex flex-col items-center gap-3 group">
              <div className="text-xs text-yellow-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {item.value}
              </div>
              <div
                className="w-full bg-gradient-to-t from-yellow-500 to-yellow-600 rounded-t-xl hover:from-yellow-400 hover:to-yellow-500 transition-all cursor-pointer"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              />
              <span className="text-xs text-gray-400 text-center font-bold">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'line') {
    return (
      <div className="h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 800 300">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1="0"
              y1={300 - (percent * 3)}
              x2="800"
              y2={300 - (percent * 3)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}

          {/* Line */}
          <polyline
            points={data.map((item, i) => {
              const x = (i / (data.length - 1)) * 800;
              const y = 300 - ((item.value / maxValue) * 280);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="rgb(234, 179, 8)"
            strokeWidth="3"
          />

          {/* Points */}
          {data.map((item, i) => {
            const x = (i / (data.length - 1)) * 800;
            const y = 300 - ((item.value / maxValue) * 280);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="6" fill="rgb(234, 179, 8)" />
                <text x={x} y={y - 15} textAnchor="middle" fontSize="12" fill="rgb(234, 179, 8)" fontWeight="bold">
                  {item.value}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Labels */}
        <div className="flex justify-between mt-4">
          {data.map((item, i) => (
            <div key={i} className="text-xs text-gray-400 text-center">
              {item.label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'pie' || type === 'donut') {
    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Pie Chart SVG */}
        <div className="w-64 h-64 relative">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {data.map((item, i) => {
              const startAngle = data.slice(0, i).reduce((sum, d) => sum + (d.value / total) * 360, 0);
              const angle = (item.value / total) * 360;
              const endAngle = startAngle + angle;
              
              const x1 = 100 + 90 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 100 + 90 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 100 + 90 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 100 + 90 * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArc = angle > 180 ? 1 : 0;
              
              const colors = [
                'rgb(234, 179, 8)',
                'rgb(251, 191, 36)',
                'rgb(252, 211, 77)',
                'rgb(253, 224, 71)',
                'rgb(254, 240, 138)'
              ];
              
              return (
                <path
                  key={i}
                  d={`M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={colors[i % colors.length]}
                  stroke="#050505"
                  strokeWidth="2"
                />
              );
            })}
            
            {/* Donut hole */}
            {type === 'donut' && (
              <circle cx="100" cy="100" r="50" fill="#050505" />
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {data.map((item, i) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            const colors = [
              'rgb(234, 179, 8)',
              'rgb(251, 191, 36)',
              'rgb(252, 211, 77)',
              'rgb(253, 224, 71)',
              'rgb(254, 240, 138)'
            ];
            
            return (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                <div className="flex-1">
                  <div className="text-sm text-white font-bold">{item.label}</div>
                  <div className="text-xs text-gray-500">
                    {item.value} ({percentage}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return <div className="text-center text-gray-500">Unsupported chart type</div>;
}
