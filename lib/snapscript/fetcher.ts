export async function fetchSource(source: string) {
  if (source === 'api.users') {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    return res.json()
  }

  throw new Error('Unknown data source')
}
