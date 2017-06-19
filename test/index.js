'use strict';

var equal = require('assert').strictEqual ,
  KeywordFilter = require('..');

var content1 = 'what is the best lang, go or js?你呀个妹，咿呀我哈噶',
  content2 = '快乐的一天, hello my name is haoxin',
  content3 = 'what is the best lang, go or js?\n' + 
					'你呀个妹，咿呀我哈噶',
  keyArrays = ['go', 'js', 'lang', '我哈', '你呀'];

var filter = new KeywordFilter();

filter.init(keyArrays);

describe('## keyword filter', function() {
  describe('# getOccurances', function() {
	 it('should map line numers and discovered values', function() {
		 var results = filter.getOccurances(content3);
		 equal(results[0].line, 1);
		 equal(results[0].value, 'lang');
		 equal(results[3].line, 2);
		 equal(results[3].value, '你呀');
		 
	 })
  });
  describe('# hasKeyword', function() {
    it('should be true', function() {
      equal(filter.hasKeyword(content1), true);
    });

    it('should be false', function() {
      equal(filter.hasKeyword(content2), false);
    });
  });

  describe('# replaceKeyords', function() {
    it('should replace keywords with char', function() {
      equal(filter.replaceKeywords(content1, '*'), 'what is the best ****, ** or **?**个妹,咿呀**噶');
    });

    it('should not replace keywords with char', function() {
      equal(filter.replaceKeywords(content2, '*'), content2);
    });

    it('should replace keywords with string', function() {
      equal(filter.replaceKeywords(content1, 'happy'), 'what is the best happy, happy or happy?happy个妹,咿呀happy噶');
    });

    it('should not replace keywords with string', function() {
      equal(filter.replaceKeywords(content2, 'happy'), content2);
    });
  });
});
