[![NPM version][npm-img]][npm-url]
[![Build status][travis-img]][travis-url]
[![Test coverage][coveralls-img]][coveralls-url]
[![License][license-img]][license-url]
[![Dependency status][david-img]][david-url]

### an extreme lightweight keyword filter for node.js

### install

```bash
npm install keyword-filter
```

### api

* hasKeyword
* replaceKeywords
* getOccurances

### example

```js
const KeywordFilter = require('keyword-filter')
const filter = new KeywordFilter()

const keyArrays = ['go', 'js', 'lang', '我哈', '你呀']

filter.init(keyArrays)

const content = 'what is the best lang, go or js?\n' +
  '你呀个妹，咿呀我哈噶'

filter.hasKeyword(content)
filter.replaceKeywords(content, '*')
filter.replaceKeywords(content, 'happy')
filter.getOccurances(content) // -> Returns [{1,'go'},{1,'js'},{1,'lang'}, {2, '我哈'}, {2, '你呀'}]
```

[npm-img]: https://img.shields.io/npm/v/keyword-filter.svg?style=flat-square
[npm-url]: https://npmjs.org/package/keyword-filter
[travis-img]: https://img.shields.io/travis/coderhaoxin/keyword-filter.svg?style=flat-square
[travis-url]: https://travis-ci.org/coderhaoxin/keyword-filter
[coveralls-img]: https://img.shields.io/coveralls/coderhaoxin/keyword-filter.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/coderhaoxin/keyword-filter?branch=master
[license-img]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[david-img]: https://img.shields.io/david/coderhaoxin/keyword-filter.svg?style=flat-square
[david-url]: https://david-dm.org/coderhaoxin/keyword-filter
