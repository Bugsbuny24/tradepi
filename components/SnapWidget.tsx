'use client'
import { useEffect, useState } from 'react'
import { runSnapScript } from '@/lib/snapscript/runtime'
import { fetchSource } from '@/lib/snapscript/fetcher'

export default function SnapWidget({ script }: { script: string }) {
  const [ctx, setCtx] = useState<any>(null)

  useEffect(() => {
    runSnapScript(script, fetchSource).then(setCtx)
  }, [script])

  if (!ctx) return <div>Loading...</div>

  return (
    <div
      className="p-4 rounded-xl"
      style={{ boxShadow: ctx.style.glow ? `0 0 20px ${ctx.style.glow}` : undefined }}
    >
      <pre className="text-xs">{JSON.stringify(ctx.data, null, 2)}</pre>
    </div>
  )
}
