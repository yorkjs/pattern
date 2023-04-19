import { parseText, testPattern, patternMap } from '../src/index'

test('parseText', () => {

  let result = parseText(
    '今天温度是10.3，我的电话是13612345678，邮箱是 1234234@qq.com ，网址是https://baidu.com，今天是<strong>星期天</strong>，头像是<img src="https://baidu.com/avatar.png"/>，全身照是<img id="id" alt="123"/>,谢谢'
  )

  expect(result[0].type).toBe('text')
  expect(result[1].type).toBe('tel')
  expect(result[1].data).not.toBe(undefined)
  if (result[1].data) {
    expect(result[1].data.tel).toBe('13612345678')
  }
  expect(result[2].type).toBe('text')
  expect(result[3].type).toBe('email')
  expect(result[3].data).not.toBe(undefined)
  if (result[3].data) {
    expect(result[3].data.email).toBe('1234234@qq.com')
  }
  expect(result[4].type).toBe('text')
  expect(result[5].type).toBe('url')
  expect(result[5].data).not.toBe(undefined)
  if (result[5].data) {
    expect(result[5].data.url).toBe('https://baidu.com')
  }
  expect(result[6].type).toBe('text')
  expect(result[7].type).toBe('highlight')
  expect(result[7].data).not.toBe(undefined)
  if (result[7].data) {
    expect(result[7].data.tag).toBe('strong')
    expect(result[7].data.text).toBe('星期天')
  }
  expect(result[8].type).toBe('text')
  expect(result[9].type).toBe('image')
  expect(result[9].data).not.toBe(undefined)
  if (result[9].data) {
    expect(result[9].data.url).toBe('https://baidu.com/avatar.png')
  }
  expect(result[10].type).toBe('text')
  expect(result[11].type).toBe('image')
  expect(result[11].data).not.toBe(undefined)
  if (result[11].data) {
    expect(result[11].data.url).toBe('')
  }
  expect(result[12].type).toBe('text')

  result = parseText('请点击https://www.baidu.com，请联系13512345678，请发送邮箱adsadasd@qq.com，高亮<i>关键字</i>，图片<img src="https://www.baidu.com/logo.png">')
  expect(result[0].type).toBe('text')
  expect(result[1].type).toBe('url')
  expect(result[1].data).not.toBe(undefined)
  if (result[1].data) {
    expect(result[1].data.url).toBe('https://www.baidu.com')
  }
  expect(result[2].type).toBe('text')
  expect(result[3].type).toBe('tel')
  expect(result[3].data).not.toBe(undefined)
  if (result[3].data) {
    expect(result[3].data.tel).toBe('13512345678')
  }
  expect(result[4].type).toBe('text')
  expect(result[5].type).toBe('email')
  expect(result[5].data).not.toBe(undefined)
  if (result[5].data) {
    expect(result[5].data.email).toBe('adsadasd@qq.com')
  }
  expect(result[6].type).toBe('text')
  expect(result[7].type).toBe('highlight')
  expect(result[7].data).not.toBe(undefined)
  if (result[7].data) {
    expect(result[7].data.tag).toBe('i')
    expect(result[7].data.text).toBe('关键字')
  }

  expect(result[8].type).toBe('text')
  expect(result[9].type).toBe('image')
  expect(result[9].data).not.toBe(undefined)
  if (result[9].data) {
    expect(result[9].data.url).toBe('https://www.baidu.com/logo.png')
  }
})

test('testPattern', () => {

  expect(testPattern('62.2', patternMap.url)).toBe(false)
  expect(testPattern('.2', patternMap.url)).toBe(false)
  expect(testPattern('62.2', patternMap.tel)).toBe(false)
  expect(testPattern('.2', patternMap.tel)).toBe(false)
  expect(testPattern('alibaba-lnc@asddj.com', patternMap.email)).toBe(true)
  expect(testPattern('alibaba-lnc@asddj-abc.com.cn', patternMap.email)).toBe(true)
  expect(testPattern('asdas-@hotmail.com', patternMap.email)).toBe(true)
  expect(testPattern('asdas-@hotmail.com', patternMap.url)).toBe(false)
  expect(testPattern('http://192.168.0.1', patternMap.url)).toBe(true)
  expect(testPattern('www.baidu.com', patternMap.url)).toBe(true)
  expect(testPattern('baidu.com', patternMap.url)).toBe(true)
  expect(testPattern('ftp://www.qq-news.com', patternMap.url)).toBe(true)
  expect(testPattern('http://www.qq-news.com', patternMap.url)).toBe(true)
  expect(testPattern('https://www.qq-news.com/abc/edf', patternMap.url)).toBe(true)
  expect(testPattern('http://www.qq-news.com/abc/a.png', patternMap.url)).toBe(true)
  expect(testPattern('http://www.qq-news.com/abc/a.mp4', patternMap.url)).toBe(true)
  expect(testPattern('http://www.qq-news.com/abc/a.pdf', patternMap.url)).toBe(true)
  expect(testPattern('http://www.qq-news.com/abc/edf?a=1&b=2', patternMap.url)).toBe(true)
  expect(testPattern('http://www.qq-news.com/abc/edf?a=1&b=2#a=1&b=2', patternMap.url)).toBe(true)
  expect(testPattern('010-123123123', patternMap.tel)).toBe(true)
  expect(testPattern('13612345678', patternMap.tel)).toBe(true)
  expect(testPattern('+8613612345678', patternMap.tel)).toBe(true)

})

test('normalizeUrl', () => {

  const result = parseText('请点击www.baidu.com')
  expect(result[0].type).toBe('text')
  expect(result[1].type).toBe('url')
  expect(result[1].data).not.toBe(undefined)
  if (result[1].data) {
    expect(result[1].data.url).toBe('http://www.baidu.com')
  }

})