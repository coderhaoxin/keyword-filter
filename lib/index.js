'use strict'

const NodeTree = require('./node-tree')
const Keyword = require('./keyword')

function Filter() {
  this.tempNode = null
  this.subNode = null
  this.rollback = 0
  this.position = 0
  this.rootNode = new NodeTree()
  this.keyword = new Keyword()
}

Filter.prototype.init = function(keyArray) {
  this.keyword.initData(keyArray)
  return this.createNodeTree()
}

Filter.prototype.createNodeTree = function() {
  let keyArray = this.keyword.getKeyArray()
  let results = []
  let key

  for (let i = 0; i < keyArray.length; ++i) {
    key = keyArray[i]
    key = toCBDString(key)
    this.tempNode = this.rootNode

    results.push(this.setNode(key))
  }

  return results
}

Filter.prototype.setNode = function(key) {
  let results = []
  let filter = this
  let char

  for (let j = 0; j < key.length; ++j) {
    char = key[j]
    filter.subNode = filter.tempNode.getNode(char)

    if (!filter.subNode) {
      filter.subNode = new NodeTree()
      filter.tempNode.setNode(char, filter.subNode)
    }

    filter.tempNode = filter.subNode
    if (j === (key.length - 1)) {
      results.push(filter.subNode.setEnd(true))
    } else {
      results.push(undefined)
    }
  }

  return results
}

/**
 * Return a list of occurances in a given string (Line number and word)
 */
Filter.prototype.getOccurances = function(str) {
  let occurances = []
  let tempNode = this.rootNode
  let rollback = 0
  let position = 0
  let char

  str = toCBDString(str)
  let mark = 0
  let newlineCount = 1
  while (position < str.length) {
    char = str.charAt(position)
    if (char === '\n') {
      newlineCount++
    }
    tempNode = tempNode.getNode(char)

    if (!tempNode) {
      position = position - rollback
      rollback = 0
      tempNode = this.rootNode
      mark = position
    } else if (tempNode.isEnd()) {
      let occurance = {
        line: newlineCount,
        value: str.substr(mark + 1, position - mark)
      }
      occurances.push(occurance)
      tempNode = this.rootNode
    } else {
      rollback++
    }
    position++
  }

  return occurances
}

Filter.prototype.hasKeyword = function(str) {
  let tempNode = this.rootNode
  let rollback = 0
  let position = 0
  let char

  str = toCBDString(str)

  while (position < str.length) {
    char = str.charAt(position)
    tempNode = tempNode.getNode(char)

    if (!tempNode) {
      position = position - rollback
      rollback = 0
      tempNode = this.rootNode
    } else if (tempNode.isEnd()) {
      return true
    } else {
      rollback++
    }
    position++
  }

  return false
}

Filter.prototype.replaceKeywordsWithChar = function(str, reChar) {
  this.tempNode = this.rootNode
  this.rollback = 0
  this.position = 0

  str = toCBDString(str)

  while (this.position < str.length) {
    this.tempNode = this.tempNode.getNode(str.charAt(this.position))

    if (!this.tempNode) {
      this.position = this.position - this.rollback
      this.rollback = 0
      this.tempNode = this.rootNode
    } else if (this.tempNode.isEnd()) {
      for (let i = this.position - this.rollback, length = this.position + 1; i < length; i++) {
        str = replaceIndexChar(str, i, reChar)
      }
      this.rollback = 1
    } else {
      this.rollback++
    }

    this.position++
  }

  return str
}

Filter.prototype.replaceKeywordsWithString = function(str, reStr) {
  this.tempNode = this.rootNode
  this.rollback = 0
  this.position = 0
  str = toCBDString(str)

  while (this.position < str.length) {
    this.tempNode = this.tempNode.getNode(str.charAt(this.position))

    if (!this.tempNode) {
      this.position = this.position - this.rollback
      this.rollback = 0
      this.tempNode = this.rootNode
    } else if (this.tempNode.isEnd()) {
      str = str.replace(str.substring(this.position - this.rollback, this.position + 1), reStr)
      this.rollback = 1
    } else {
      this.rollback++
    }

    this.position++
  }

  return str
}

Filter.prototype.replaceKeywords = function(str, restr) {
  restr = String(restr) || '*'

  if (restr.length === 1) {
    return this.replaceKeywordsWithChar(str, restr)
  } else {
    return this.replaceKeywordsWithString(str, restr)
  }
}

/**
 * exports
 */

module.exports = Filter

/**
 * util
 */
function toCBDChar(char) {
  if (char === 12288) {
    char = 32
  }
  if (char > 65248 && char < 65375) {
    char = char - 65248
  }

  return char
}

function toCBDString(str) {
  str = str.toLowerCase()
  let tmp = ''

  for (let i = 0; i < str.length; i++) {
    tmp += String.fromCharCode(toCBDChar(str.charCodeAt(i)))
  }

  return tmp
}

function replaceIndexChar(str, index, char) {
  if (index < 0 || (index + 1 >= str.length)) {
    return str
  }

  return str.substring(0, index) + char + str.substring(index + 1, str.length)
}
