import crypto from 'crypto'

export function sealScript(code: string, domain: string) {
  const hash = crypto.createHash('sha256').update(code + domain).digest('hex')
  return { code, domain, hash }
}

export function verifySeal(sealed: any, domain: string) {
  const h = crypto.createHash('sha256').update(sealed.code + domain).digest('hex')
  return h === sealed.hash
}
