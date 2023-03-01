import { Pattern, Token } from './type'
import { patternList } from './pattern'

export function parseText(text: string, patterns: Pattern[] = patternList): Token[] {
  const result: Token[] = []

  while (true) {
    let bestResult: RegExpExecArray | void
    let bestPattern: Pattern | void
    patterns.forEach(function (item) {
      const result = item.pattern.exec(text)
      if (result) {
        if (bestResult) {
          if (result.index < bestResult.index) {
            bestResult = result
            bestPattern = item
          }
        }
        else {
          bestResult = result
          bestPattern = item
        }
      }
    })
    if (bestResult && bestPattern) {

      if (bestResult.index > 0) {
        result.push(
          {
            type: 'text',
            text: text.substring(0, bestResult.index),
          }
        )
      }

      result.push(
        bestPattern.parse(bestResult)
      )

      text = text.substring(bestResult.index + bestResult[0].length)
    }
    else {
      if (text.length) {
        result.push(
          {
            type: 'text',
            text,
          }
        )
      }
      break
    }
  }
  return result
}