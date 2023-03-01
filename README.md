# Pattern

通过正则表达式简单地解析文本。

## 安装

CDN

```html
<script src="https://unpkg.com/@yorkjs/pattern"></script>
<script>

</script>
```

NPM

```shell
npm install @yorkjs/pattern
```

```js
import { parseText } from '@yorkjs/pattern'
```

YARN

```shell
yarn add @yorkjs/pattern
```

```js
import { parseText } from '@yorkjs/pattern'
```

## 示例

```js
import {
  parseText,
} from '@yorkjs/pattern'

const result = parseText('请点击https://www.baidu.com，请联系13512345678，请发送邮箱adsadasd@qq.com，高亮<i>关键字</i>，图片<img src="https://www.baidu.com/logo.png">')
// [
//   { type: 'text', text: '请点击' },
//   {
//     type: 'url',
//     text: 'https://www.baidu.com',
//     data: { url: 'https://www.baidu.com' }
//   },
//   { type: 'text', text: '，请联系' },
//   { type: 'tel', text: '13512345678', data: { tel: '13512345678' } },
//   { type: 'text', text: '，请发送邮箱' },
//   {
//     type: 'email',
//     text: 'adsadasd@qq.com',
//     data: { email: 'adsadasd@qq.com' }
//   },
//   { type: 'text', text: '，高亮' },
//   {
//     type: 'highlight',
//     text: '<i>关键字</i>',
//     data: { tag: 'i', text: '关键字' }
//   },
//   { type: 'text', text: '，图片' },
//   {
//     type: 'image',
//     text: '<img src="https://www.baidu.com/logo.png">',
//     data: { url: 'https://www.baidu.com/logo.png' }
//   }
// ]
```