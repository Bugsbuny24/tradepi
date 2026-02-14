"use client";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';

export default function EmbedChartClient({ chart }: any) {
  const data = JSON.parse(chart.data_json || '[]');

  const renderChart = () => {
    const commonProps = { data, margin: { top: 5, right: 5, left: 5, bottom: 5 } };
    
    if (chart.chart_type === 'bar') {
      return (
        <BarChart {...commonProps}>
          <Bar dataKey="v" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          <Tooltip contentStyle={{background: '#000', border: '1px solid #333', borderRadius: '8px', fontSize: '12px'}} />
        </BarChart>
      );
    }
    
    if (chart.chart_type === 'line') {
      return (
        <LineChart {...commonProps}>
          <Line type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} />
          <Tooltip contentStyle={{background: '#000', border: '1px solid #333', borderRadius: '8px', fontSize: '12px'}} />
        </LineChart>
      );
    }

    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id="embedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke="#8b5cf6" fill="url(#embedGrad)" strokeWidth={2} />
        <Tooltip contentStyle={{background: '#000', border: '1px solid #333', borderRadius: '8px', fontSize: '12px'}} />
      </AreaChart>
    );
  };

  return (
    <div className="w-full h-screen bg-transparent flex flex-col p-2 overflow-hidden">
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      {/* Marka İmzası - Elite Sürümde opsiyonel olabilir */}
      <div className="flex justify-between items-center px-2 mt-1">
        <span className="text-[9px] font-bold text-gray-700 uppercase tracking-tighter italic">SnapLogic Engine</span>
        <span className="text-[9px] text-gray-800 font-medium tracking-widest uppercase">tradepigloball.co</span>
      </div>
    </div>
  );
}

