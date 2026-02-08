"use client";

import { useMemo, useState } from "react";
import { compile, execute } from "@/lib/snapscript";
import type { SnapContext } from "@/lib/snapscript";
import { buildStats } from "@/lib/snapscript/builtins";

const DEFAULT_SCRIPT = `// SnapScript v0
rule "spike-detect" when deltaPct() > 20 {
  theme("danger")
  alert("SPIKE +" + round(deltaPct(), 1) + "%")
  highlight(last())
}

rule "low-avg" when avg() < 10 {
  badge("LOW AVG")
  opacity(0.6)
}
`;

export default function SnapScriptEditor(props: {
  chart: { id: string; title?: string | null; chartType: string };
  data: Array<{ label: string; value: number; sortOrder: number }>;
  onApply?: (res: any) => void;
}) {
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [error, setError] = useState<string | null>(null);

  const ctx: SnapContext = useMemo(() => {
    const stats = buildStats(props.data);
    return {
      chart: props.chart,
      data: props.data,
      stats,
      now: { ts: Date.now() },
    };
  }, [props.chart, props.data]);

  const { res, compiledOk } = useMemo(() => {
    try {
      compile(script);
      const out = execute(script, ctx);
      return { res: out, compiledOk: true };
    } catch (e: any) {
      return { res: null, compiledOk: false };
    }
  }, [script, ctx]);

  // show error only on render tick (simple)
  useMemo(() => {
    try {
      compile(script);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "SnapScript parse error");
    }
  }, [script]);

  useMemo(() => {
    if (res && props.onApply) props.onApply(res);
  }, [res, props]);

  return (
    <div className="w-full rounded-xl border p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">SnapScript v0</div>
        <div className="text-xs opacity-70">
          {compiledOk ? "compiled ✅" : "compile ❌"}
        </div>
      </div>

      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        className="w-full min-h-[220px] rounded-lg border p-2 font-mono text-sm"
        spellCheck={false}
      />

      {error ? (
        <div className="rounded-lg border border-red-300 bg-red-50 p-2 text-sm">
          <div className="font-semibold">Parse error</div>
          <div className="opacity-80">{error}</div>
        </div>
      ) : null}

      {res ? (
        <div className="rounded-lg border p-2 text-sm space-y-2">
          <div className="font-semibold">Live Output</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border p-2">
              <div className="text-xs opacity-70">Style</div>
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(res.style, null, 2)}</pre>
            </div>
            <div className="rounded-md border p-2">
              <div className="text-xs opacity-70">Events</div>
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(res.events, null, 2)}</pre>
            </div>
          </div>

          <div className="rounded-md border p-2">
            <div className="text-xs opacity-70">Stats</div>
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(ctx.stats, null, 2)}</pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}
