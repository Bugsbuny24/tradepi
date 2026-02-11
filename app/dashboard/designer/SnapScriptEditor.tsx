"use client";

import React, { useMemo, useState } from "react";

export default function SnapScriptEditor({
  initialCode = "",
  onRun,
}: {
  initialCode?: string;
  onRun?: (code: string) => void;
}) {
  const [code, setCode] = useState(initialCode);

  const lines = useMemo(() => code.split("\n").length, [code]);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold">SnapScript Editor</div>
        <div className="text-xs text-gray-500">{lines} lines</div>
      </div>

      <textarea
        className="w-full min-h-[260px] border rounded p-3 font-mono text-sm"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          onClick={() => onRun?.(code)}
          className="px-4 py-2 rounded bg-black text-white font-bold"
        >
          Run
        </button>
        <button
          onClick={() => setCode("")}
          className="px-4 py-2 rounded border font-bold"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
