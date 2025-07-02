export type Parser<OPTS extends Record<string, unknown>> = {
  parse: (line: string) => string | null
  write: (options: OPTS) => string
}
