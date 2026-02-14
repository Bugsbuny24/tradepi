export type Command =
  | { type: 'source'; value: string }
  | { type: 'filter'; field: string; op: string; value: string }
  | { type: 'map'; fields: string[] }
  | { type: 'chart'; kind: 'bar' | 'line' | 'pie' }
  | { type: 'glow'; color: string }
  | { type: 'sync' }
