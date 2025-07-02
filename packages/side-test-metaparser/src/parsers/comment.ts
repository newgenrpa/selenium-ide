export default (commentLine: string) => {
  const match = commentLine.match(
    // Regex pattern to capture prefix and postfix
    /(?<prefix>^[^a-zA-Z0-9]*)(?<comment>COMMENT_STRING)(?<postfix>[^a-zA-Z0-9]*$)/
  )
  if (!match?.groups?.prefix) {
    throw new Error('Unable to parse comment training line: ' + commentLine)
  }
  return (line: string) => {
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
  }
}
