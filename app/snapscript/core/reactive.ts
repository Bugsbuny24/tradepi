type Subscriber = () => void
const deps = new Map<string, Subscriber[]>()

export function track(key: string, fn: Subscriber) {
  if (!deps.has(key)) deps.set(key, [])
  deps.get(key)!.push(fn)
}

export function trigger(key: string) {
  deps.get(key)?.forEach(fn => fn())
}
