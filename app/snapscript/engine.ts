import { parse } from './core/parser'
import { run } from './core/runtime'
import { verifySeal } from './core/seal'

export async function runSnapEngine(sealed: any, domain: string) {
  if (!verifySeal(sealed, domain)) {
    throw new Error('Domain violation')
  }

  const ast = parse(sealed.code)
  return await run(ast)
}
