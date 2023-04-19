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
    const appendText = function (text: string) {
      const prevItem = result[result.length - 1]
      if (prevItem && prevItem.type === 'text') {
        prevItem.text += text
      }
      else {
        result.push(
          {
            type: 'text',
            text: text,
          }
        )
      }
    }
    if (bestResult && bestPattern) {

      if (bestResult.index > 0) {
        appendText(
          text.substring(0, bestResult.index)
        )
      }

      const item = bestPattern.parse(bestResult)
      if (item) {
        result.push(item)
      }
      else {
        appendText(
          bestResult[0]
        )
      }

      text = text.substring(bestResult.index + bestResult[0].length)
    }
    else {
      if (text.length) {
        appendText(
          text
        )
      }
      break
    }
  }
  return result
}