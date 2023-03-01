import { Pattern, Token } from './type'

export function normalizeUrl(url: string) {
  // https://www.baidu.com
  if (/^(?:https?|ftp):\/\//i.test(url)) {
    return url
  }
  // //www.baidu.com
  if (/^\/\//i.test(url)) {
    return 'http:' + url
  }
  // www.baidu.com
  if (url) {
    return 'http://' + url
  }
  return ''
}

export function createToken(match: RegExpExecArray | RegExpMatchArray, pattern: Pattern, data?: Record<string, string>): Token {
  return {
    type: pattern.type,
    text: match[0],
    data,
  }
}