// Regex pattern to capture prefix, quote type, and postfix of log commands
const createLogParser = (logLine: string) => {
  const pattern =
    /^(?<prefix>.*?)\(\s*(?<dynamic_opening_quote>['"`])\$\{(?<variable_name>[a-zA-Z_][a-zA-Z0-9_]*)\}(?<dynamic_closing_quote>['"`])\s*\)$/

  const match = logLine.match(pattern)
  if (!match?.groups?.prefix) {
    throw new Error('Unable to parse comment training line: ' + logLine)
  }
  return {
    parse: (line: string) => {
      const cleanedLine = line.trim()
      if (!cleanedLine.startsWith(match!.groups!.prefix)) {
        return null
      }
      const postfix = match?.groups?.postfix
      if (postfix && !cleanedLine.endsWith(postfix)) {
        return null
      }
      return cleanedLine.slice(
        match!.groups!.prefix.length,
        postfix ? -postfix.length : cleanedLine.length
      )
    },
  }
}

export default createLogParser
