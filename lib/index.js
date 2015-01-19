'use strict';

var NodeTree = require('./node-tree'),
  Keyword = require('./keyword');

/**
 * exports
 */

module.exports = Filter;

function Filter() {
  this.tempNode = null;
  this.subNode = null;
  this.rollback = 0;
  this.position = 0;
  this.rootNode = new NodeTree();
  this.keyword = new Keyword();
}

Filter.prototype.init = function(keyArray) {
  this.keyword.initData(keyArray);
  return this.createNodeTree();
};

Filter.prototype.createNodeTree = function() {
  var keyArray = this.keyword.getKeyArray(),
    results = [],
    key;

  for (var i = 0; i < keyArray.length; ++i) {
    key = keyArray[i];
    key = toCBDString(key);
    this.tempNode = this.rootNode;

    results.push(this.setNode(key));
  }

  return results;
};

Filter.prototype.setNode = function(key) {
  var results = [],
    filter = this,
    char;

  for (var j = 0; j < key.length; ++j) {
    char = key[j];
    filter.subNode = filter.tempNode.getNode(char);

    if (!filter.subNode) {
      filter.subNode = new NodeTree();
      filter.tempNode.setNode(char, filter.subNode);
    }

    filter.tempNode = filter.subNode;
    if (j === (key.length - 1)) {
      results.push(filter.subNode.setEnd(true));
    } else {
      results.push(undefined);
    }
  }

  return results;
}

Filter.prototype.hasKeyword = function(str) {
  var tempNode = this.rootNode,
    rollback = 0,
    position = 0,
    char;

  str = toCBDString(str);

  while (position < str.length) {
    char = str.charAt(position);
    tempNode = tempNode.getNode(char);

    if (!tempNode) {
      position = position - rollback;
      rollback = 0;
      tempNode = this.rootNode;
    } else if (tempNode.isEnd()) {
      return true;
    } else {
      rollback++;
    }
    position++;
  }

  return false;
};

Filter.prototype.replaceKeywordsWithChar = function(str, reChar) {
  this.tempNode = this.rootNode;
  this.rollback = 0;
  this.position = 0;

  str = toCBDString(str);

  while (this.position < str.length) {
    this.tempNode = this.tempNode.getNode(str.charAt(this.position));

    if (!this.tempNode) {
      this.position = this.position - this.rollback;
      this.rollback = 0;
      this.tempNode = this.rootNode;
    } else if (this.tempNode.isEnd()) {
      for (var i = this.position - this.rollback, length = this.position + 1; i < length; i++) {
        str = replaceIndexChar(str, i, reChar);
      }
      this.rollback = 1;
    } else {
      this.rollback++;
    }

    this.position++;
  }

  return str;
};

Filter.prototype.replaceKeywordsWithString = function(str, reStr) {
  this.tempNode = this.rootNode;
  this.rollback = 0;
  this.position = 0;
  str = toCBDString(str);

  while (this.position < str.length) {
    this.tempNode = this.tempNode.getNode(str.charAt(this.position));

    if (!this.tempNode) {
      this.position = this.position - this.rollback;
      this.rollback = 0;
      this.tempNode = this.rootNode;
    } else if (this.tempNode.isEnd()) {
      str = str.replace(str.substring(this.position - this.rollback, this.position + 1), reStr);
      this.rollback = 1;
    } else {
      this.rollback++;
    }

    this.position++;
  }

  return str;
};

Filter.prototype.replaceKeywords = function(str, restr) {
  restr = String(restr) || '*';

  if (restr.length === 1) {
    return this.replaceKeywordsWithChar(str, restr);
  } else {
    return this.replaceKeywordsWithString(str, restr);
  }
};

/**
 * util
 */
function toCBDChar(char) {
  if (char === 12288) {
    char = 32;
  }
  if (char > 65248 && char < 65375) {
    char = char - 65248;
  }

  return char;
}

function toCBDString(str) {
  str = str.toLowerCase();
  var tmp = '';

  for (var i = 0; i < str.length; i++) {
    tmp += String.fromCharCode(toCBDChar(str.charCodeAt(i)));
  }

  return tmp;
}

function replaceIndexChar(str, index, char) {
  if (index < 0 || (index + 1 >= str.length)) {
    return str;
  }

  return str.substring(0, index) + char + str.substring(index + 1, str.length);
}
