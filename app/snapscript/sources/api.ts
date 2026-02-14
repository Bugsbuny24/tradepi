export async function fetchSource(name: string) {
  const res = await fetch(`/api/${name}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Source error')
  return await res.json()
}
