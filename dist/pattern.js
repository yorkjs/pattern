/**
 * pattern.js v0.0.1
 * (c) 2021-2023 musicode
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Pattern = {}));
}(this, (function (exports) { 'use strict';

  function normalizeUrl(url) {
      // https://www.baidu.com
      if (/^(?:https?|ftp):\/\//i.test(url)) {
          return url;
      }
      // //www.baidu.com
      if (/^\/\//i.test(url)) {
          return 'http:' + url;
      }
      // www.baidu.com
      if (url) {
          return 'http://' + url;
      }
      return '';
  }
  function createToken(match, pattern, data) {
      return {
          type: pattern.type,
          text: match[0],
          data: data,
      };
  }

  // html 高亮标签，如 <i>text</i>
  var highlight = {
      type: 'highlight',
      pattern: /<(\w+)>([^<]+)<\/\1>/,
      parse: function(match) {
          return createToken(match, highlight, {
              tag: match[1].toLowerCase(),
              text: match[2],
          });
      }
  };
  // html 图片标签
  var image = {
      type: 'image',
      pattern: /<img[^>]*>/i,
      parse: function(match) {
          var result = match[0].match(/src=(['"])([^'"]+)\1/i);
          return createToken(match, image, {
              url: result ? normalizeUrl(result[2]) : '',
          });
      }
  };
  // http://www.regular-expressions.info/email.html
  var email = {
      type: 'email',
      pattern: /(?:[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
      parse: function(match) {
          return createToken(match, email, {
              email: match[0],
          });
      }
  };
  // https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
  var url = {
      type: 'url',
      pattern: /(?:(?:https?|ftp):\/\/)?(www\.)?[-\w@:%.\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\+.~#?&//=]*)/i,
      parse: function(match) {
          var urlStr = match[0];
          var emailMatch = urlStr.match(email.pattern);
          if (emailMatch) {
              if (emailMatch[0] === urlStr) {
                  return email.parse(emailMatch);
              }
          }
          return createToken(match, url, {
              url: normalizeUrl(urlStr),
          });
      }
  };
  // +86-10-87654321
  // 010-87654321
  // 13612345678
  // 有时长途还有加拨 17951 之类的，所以手机号码会达到 16 位
  var tel = {
      type: 'tel',
      pattern: /(\+\d{2,5}\-)?(\d{2,4}\-)?\d{6,16}/,
      parse: function(match) {
          return createToken(match, tel, {
              tel: match[0],
          });
      }
  };
  function testPattern(str, pattern) {
      var match = str.match(pattern.pattern);
      if (match) {
          return pattern.parse(match).type === pattern.type;
      }
      return false;
  }
  var patternList = [];
  var patternMap = {};
  function addPattern(pattern) {
      if (patternMap[pattern.type]) {
          return;
      }
      patternMap[pattern.type] = pattern;
      patternList.push(pattern);
  }
  addPattern(highlight);
  addPattern(image);
  addPattern(email);
  addPattern(url);
  addPattern(tel);

  function parseText(text, patterns) {
      if ( patterns === void 0 ) patterns = patternList;

      var result = [];
      var loop = function () {
          var bestResult = (void 0);
          var bestPattern = (void 0);
          patterns.forEach(function (item) {
              var result = item.pattern.exec(text);
              if (result) {
                  if (bestResult) {
                      if (result.index < bestResult.index) {
                          bestResult = result;
                          bestPattern = item;
                      }
                  }
                  else {
                      bestResult = result;
                      bestPattern = item;
                  }
              }
          });
          if (bestResult && bestPattern) {
              if (bestResult.index > 0) {
                  result.push({
                      type: 'text',
                      text: text.substring(0, bestResult.index),
                  });
              }
              result.push(bestPattern.parse(bestResult));
              text = text.substring(bestResult.index + bestResult[0].length);
          }
          else {
              if (text.length) {
                  result.push({
                      type: 'text',
                      text: text,
                  });
              }
              return 'break';
          }
      };

      while (true) {
          var returned = loop();

          if ( returned === 'break' ) break;
      }
      return result;
  }

  exports.addPattern = addPattern;
  exports.parseText = parseText;
  exports.patternList = patternList;
  exports.patternMap = patternMap;
  exports.testPattern = testPattern;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pattern.js.map
