'use client'
import { runSnapEngine } from '@/app/snapscript/engine'
import { useEffect, useState } from 'react'

export default function SnapWidget({ sealed }: { sealed: any }) {
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    runSnapEngine(sealed, location.hostname).then(setResult)
  }, [sealed])

  if (!result) return <div>Loading Snap…</div>

  return (
    <div style={{ boxShadow: `0 0 20px ${result.style.glow}` }}>
      <pre>{JSON.stringify(result.widget.data, null, 2)}</pre>
    </div>
  )
}
