/**
 * pattern.js v0.0.3
 * (c) 2021-2023 musicode
 * Released under the MIT License.
 */

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
        data,
    };
}

// html 高亮标签，如 <i>text</i>
const highlight = {
    type: 'highlight',
    pattern: /<(\w+)>([^<]+)<\/\1>/,
    parse(match) {
        return createToken(match, highlight, {
            tag: match[1].toLowerCase(),
            text: match[2],
        });
    }
};
// html 图片标签
const image = {
    type: 'image',
    pattern: /<img[^>]*>/i,
    parse(match) {
        const result = match[0].match(/src=(['"])([^'"]+)\1/i);
        return createToken(match, image, {
            url: result ? normalizeUrl(result[2]) : '',
        });
    }
};
// http://www.regular-expressions.info/email.html
const email = {
    type: 'email',
    pattern: /(?:[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
    parse(match) {
        return createToken(match, email, {
            email: match[0],
        });
    }
};
// https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
const url = {
    type: 'url',
    pattern: /(?:(?:https?|ftp):\/\/)?(www\.)?[-\w@:%.\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\+.~#?&//=]*)/i,
    parse(match) {
        const urlStr = match[0];
        const emailMatch = urlStr.match(email.pattern);
        if (emailMatch) {
            if (emailMatch[0] === urlStr) {
                return email.parse(emailMatch);
            }
        }
        // 类似这种数字 62.2、3.5%，不应该识别为 url
        if (/^(\d+)?\.\d+/.test(urlStr)) {
            return;
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
const tel = {
    type: 'tel',
    pattern: /(\+\d{2,5}\-)?(\d{2,4}\-)?\d{6,16}/,
    parse(match) {
        return createToken(match, tel, {
            tel: match[0],
        });
    }
};
function testPattern(str, pattern) {
    const match = str.match(pattern.pattern);
    if (match) {
        const result = pattern.parse(match);
        if (result) {
            return result.type === pattern.type;
        }
    }
    return false;
}
const patternList = [];
const patternMap = {};
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

function parseText(text, patterns = patternList) {
    const result = [];
    while (true) {
        let bestResult;
        let bestPattern;
        patterns.forEach(function (item) {
            const result = item.pattern.exec(text);
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
        const appendText = function (text) {
            const prevItem = result[result.length - 1];
            if (prevItem && prevItem.type === 'text') {
                prevItem.text += text;
            }
            else {
                result.push({
                    type: 'text',
                    text: text,
                });
            }
        };
        if (bestResult && bestPattern) {
            if (bestResult.index > 0) {
                appendText(text.substring(0, bestResult.index));
            }
            const item = bestPattern.parse(bestResult);
            if (item) {
                result.push(item);
            }
            else {
                appendText(bestResult[0]);
            }
            text = text.substring(bestResult.index + bestResult[0].length);
        }
        else {
            if (text.length) {
                appendText(text);
            }
            break;
        }
    }
    return result;
}

export { addPattern, parseText, patternList, patternMap, testPattern };
//# sourceMappingURL=pattern.esm.js.map
