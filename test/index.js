'use strict';

var equal = require('assert').strictEqual,
  keywordFilter = require('..');

var content1 = 'what is the best lang, go or js?你呀个妹，咿呀我哈噶',
  content2 = '快乐的一天, hello my name is haoxin',
  keyArrays = ['go', 'js', 'lang', '我哈', '你呀'];

keywordFilter.init(keyArrays);

describe('## keyword filter', function() {
  describe('# hasKeyword', function() {
    it('should be true', function() {
      equal(keywordFilter.hasKeyword(content1), true);
    });

    it('should be false', function() {
      equal(keywordFilter.hasKeyword(content2), false);
    });
  });

  describe('# replaceKeyords', function() {
    it('should replace keywords with char', function() {
      equal(keywordFilter.replaceKeywords(content1, '*'), 'what is the best ****, ** or **?**个妹,咿呀**噶');
    });

    it('should not replace keywords with char', function() {
      equal(keywordFilter.replaceKeywords(content2, '*'), content2);
    });

    it('should replace keywords with string', function() {
      equal(keywordFilter.replaceKeywords(content1, 'happy'), 'what is the best happy, happy or happy?happy个妹,咿呀happy噶');
    });

    it('should not replace keywords with string', function() {
      equal(keywordFilter.replaceKeywords(content2, 'happy'), content2);
    });
  });
});
