export type SnapCommand =
  | { type: 'render'; source: string }
  | { type: 'glow'; color: string }
  | { type: 'sync' }

export function parseSnapScript(code: string): SnapCommand[] {
  return code
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      const [cmd, ...args] = line.split(' ')
      const value = args.join(' ')

      if (cmd === 'render') return { type: 'render', source: value }
      if (cmd === 'glow') return { type: 'glow', color: value }
      if (cmd === 'sync') return { type: 'sync' }

      throw new Error(`Unknown command: ${cmd}`)
    })
}
