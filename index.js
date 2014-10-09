'use strict';

var rootNode = new NodeTree(),
  keyword = require('./keyword'),
  tempNode = null,
  subNode = null,
  rollback = 0,
  position = 0;

var replaceIndexChar = function(str, index, char) {
  if (index < 0 || (index + 1 >= str.length)) {
    return str;
  }

  return str.substring(0, index) + char + str.substring(index + 1, str.length);
};

exports.init = function(keyArray) {
  keyword.initData(keyArray);
  return this.createNodeTree();
};

exports.createNodeTree = function() {
  var char, key,
    keyArray = keyword.getKeyArray(),
    results = [];

  for (var i = 0; i < keyArray.length; ++i) {
    key = keyArray[i];
    key = toCBDString(key);
    tempNode = rootNode;

    results.push((function() {
      var results1 = [];

      for (var j = 0; j < key.length; ++j) {
        char = key[j];
        subNode = tempNode.getNode(char);

        if (!subNode) {
          subNode = NodeTree();
          tempNode.setNode(char, subNode);
        }

        tempNode = subNode;
        if (j === (key.length - 1)) {
          results1.push(subNode.setEnd(true));
        } else {
          results1.push(undefined);
        }
      }

      return results1;
    })());
  }

  return results;
};

exports.hasKeyword = function(str) {
  var tempNode = rootNode,
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
      tempNode = rootNode;
    } else if (tempNode.isEnd()) {
      return true;
    } else {
      rollback++;
    }
    position++;
  }

  return false;
};

var replaceKeywordsWithChar = function(str, reChar) {
  tempNode = rootNode;
  rollback = 0;
  position = 0;

  str = toCBDString(str);

  while (position < str.length) {
    tempNode = tempNode.getNode(str.charAt(position));

    if (!tempNode) {
      position = position - rollback;
      rollback = 0;
      tempNode = rootNode;
    } else if (tempNode.isEnd()) {
      for (var i = position - rollback, length = position + 1; i < length; i++) {
        str = replaceIndexChar(str, i, reChar);
      }
      rollback = 1;
    } else {
      rollback++;
    }

    position++;
  }

  return str;
};

var replaceKeywordsWithString = function(str, reStr) {
  tempNode = rootNode;
  rollback = 0;
  position = 0;
  str = toCBDString(str);

  while (position < str.length) {
    tempNode = tempNode.getNode(str.charAt(position));

    if (!tempNode) {
      position = position - rollback;
      rollback = 0;
      tempNode = rootNode;
    } else if (tempNode.isEnd()) {
      str = str.replace(str.substring(position - rollback, position + 1), reStr);
      rollback = 1;
    } else {
      rollback++;
    }

    position++;
  }

  return str;
};

exports.replaceKeywords = function(str, restr) {
  restr = String(restr) || '*';

  if (restr.length === 1) {
    return replaceKeywordsWithChar(str, restr);
  } else {
    return replaceKeywordsWithString(str, restr);
  }
};

/**
 * NodeTree
 */
function NodeTree() {
  if (!(this instanceof NodeTree)) {
    return new NodeTree();
  }

  this.nodeArray = {};
  this._isEnd = false;
}

NodeTree.prototype.setNode = function(value, subNode) {
  this.nodeArray[value] = subNode;
};

NodeTree.prototype.getNode = function(value) {
  return this.nodeArray[value];
};

NodeTree.prototype.setEnd = function(val) {
  this._isEnd = val;
};

NodeTree.prototype.isEnd = function() {
  return this._isEnd;
};

NodeTree.prototype.getNodeArray = function() {
  return this.nodeArray;
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

  for (var i = 0, length = str.length; i < length; i++) {
    tmp += String.fromCharCode(toCBDChar(str.charCodeAt(i)));
  }

  return tmp;
}
