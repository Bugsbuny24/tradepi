import { parseSnapScript } from './parser'

type SnapContext = {
  data: any
  style: {
    glow?: string
  }
}

export async function runSnapScript(script: string, fetcher: (src: string) => Promise<any>) {
  const ast = parseSnapScript(script)

  const ctx: SnapContext = {
    data: null,
    style: {}
  }

  for (const cmd of ast) {
    if (cmd.type === 'render') {
      ctx.data = await fetcher(cmd.source)
    }

    if (cmd.type === 'glow') {
      ctx.style.glow = cmd.color
    }

    if (cmd.type === 'sync') {
      return ctx
    }
  }

  return ctx
}
