import commentParser from './parsers/comment'
import logParser from './parsers/log-string-static'

type Language = {
  parsers: {
    comment: (block: string) => string | null
    log: (block: string) => string | null
    findElement: (locatorType: string, locator: string) => string | null
    click: (locatorType: string, locator: string) => string | null
    select: (
      locatorType: string,
      locator: string,
      selectorType: string,
      selector: string
    ) => string | null
    sendKeys: (locatorType: string, locator: string) => string | null
  }
}

export const buildLanguageFromFile = (file: string): Language => {
  const lines = file.split('\n')
  console.log('Parsing comments')
  const commentLine = lines.find((line) => line.includes('COMMENT_STRING'))
  if (!commentLine) {
    throw new Error(`
      Unable to find comment line in file.
      Please ensure that the file contains a single line comment with the string 'COMMENT_STRING'
    `)
  }
  const parseComment = commentParser(commentLine)
  console.log('Parsing log statement')
  const printLog = lines.find((line) => line.includes('LOG_STRING'))
  if (!printLog) {
    throw new Error(`
      Unable to find print line in file.
      Please ensure that the file contains a log command with the string 'LOG_STRING'
    `)
  }
  const parseLog = logParser(printLog)

  return {
    parsers: {
      comment: parseComment,
      log: parseLog.parse,
    } as any,
  }
}
