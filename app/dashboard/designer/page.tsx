"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// basit CSV parser: 2 kolon bekler (x,y)
function parseCSV2Col(text: string) {
  const raw = text.trim();
  if (!raw) return { rows: [], error: null as string | null };

  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return { rows: [], error: "En az 1 header + 1 satır veri lazım." };

  // delimiter tahmini
  const headerLine = lines[0];
  const delimiter =
    headerLine.includes(",") ? "," :
    headerLine.includes(";") ? ";" :
    headerLine.includes("\t") ? "\t" : ",";

  const headers = headerLine.split(delimiter).map(s => s.trim());
  if (headers.length < 2) return { rows: [], error: "CSV en az 2 kolon içermeli (ör: date,sales)." };

  const xKey = headers[0] || "x";
  const yKey = headers[1] || "y";

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(delimiter).map(s => s.trim());
    if (parts.length < 2) continue;

    const x = parts[0];
    const yNum = Number(String(parts[1]).replace(",", "."));
    if (!x || Number.isNaN(yNum)) continue;

    rows.push({ [xKey]: x, [yKey]: yNum });
  }

  if (rows.length === 0) return { rows: [], error: "Veri parse edilemedi. (2. kolon sayısal olmalı)" };
  return { rows, error: null };
}

export default function DesignerPage() {
  const [dataInput, setDataInput] = useState("");

  const parsed = useMemo(() => parseCSV2Col(dataInput), [dataInput]);
  const rows = parsed.rows;
  const error = parsed.error;

  const xKey = useMemo(() => {
    const first = rows?.[0];
    return first ? Object.keys(first)[0] : "x";
  }, [rows]);

  const yKey = useMemo(() => {
    const first = rows?.[0];
    return first ? Object.keys(first)[1] : "y";
  }, [rows]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* SOL: Veri Enjeksiyonu */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
        <h2 className="text-lg font-semibold text-yellow-400">VERİ ENJEKSİYONU</h2>
        <p className="text-sm text-white/50 mt-1">Verilerini CSV formatında yapıştır veya manuel gir.</p>

        <textarea
          className="mt-4 w-full min-h-[220px] rounded-2xl bg-black/40 border border-white/10 p-4 text-sm text-white outline-none"
          placeholder={"Örn:\ndate,sales\n2026-01-01,1500"}
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
        />
      </div>

      {/* SAĞ: Canlı Görünüm */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white/80">CANLI GÖRÜNÜM</h2>
          <span className="text-xs text-white/40">Runtime Active</span>
        </div>

        <div className="mt-4 h-[320px] rounded-2xl border border-white/10 bg-black/30 p-3">
          {error ? (
            <div className="h-full flex items-center justify-center text-sm text-red-400">
              {error}
            </div>
          ) : rows.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey={yKey} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-white/40">
              Veri bekleniyor…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
