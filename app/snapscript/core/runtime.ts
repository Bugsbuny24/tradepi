import { Command } from './ast'
import { fetchSource } from '../sources/api'

export async function run(commands: Command[]) {
  let data: any = null
  let widget: any = null
  let style: any = {}

  for (const c of commands) {
    if (c.type === 'source') {
      data = await fetchSource(c.value)
    }

    if (c.type === 'filter') {
      data = data.filter((x: any) =>
        eval(`x.${c.field} ${c.op} ${c.value}`)
      )
    }

    if (c.type === 'map') {
      data = data.map((x: any) => {
        const o: any = {}
        c.fields.forEach(f => (o[f] = x[f]))
        return o
      })
    }

    if (c.type === 'chart') {
      widget = { type: 'chart', kind: c.kind, data }
    }

    if (c.type === 'glow') {
      style.glow = c.color
    }

    if (c.type === 'sync') {
      return { widget, style }
    }
  }
}
