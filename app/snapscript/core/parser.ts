import { Command } from './ast'

export function parse(code: string): Command[] {
  return code
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split(' ')
      const cmd = parts[0]

      if (cmd === 'source') return { type: 'source', value: parts[1] }
      if (cmd === 'filter') return { type: 'filter', field: parts[1], op: parts[2], value: parts[3] }
      if (cmd === 'map') return { type: 'map', fields: parts.slice(1) }
      if (cmd === 'chart') return { type: 'chart', kind: parts[1] as any }
      if (cmd === 'glow') return { type: 'glow', color: parts[1] }
      if (cmd === 'sync') return { type: 'sync' }

      throw new Error('Unknown command: ' + cmd)
    })
}
