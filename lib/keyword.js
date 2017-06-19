'use strict'

function Keyword() {
  this.keyHash = {}
  this.keyArray = []
}

Keyword.prototype.arrayToHash = function(ary) {
  let data

  for (let i = 0; i < ary.length; i++) {
    data = ary[i]
    this.keyHash[data] = data.length
  }

  this.keyHash = sortValue(this.keyHash)

  return this.keyHash
}

Keyword.prototype.initData = function(defaultData) {
  let results = []

  this.arrayToHash(defaultData)

  for (let key in this.keyHash) {
    results.push(this.keyArray.push(key))
  }

  return results
}

Keyword.prototype.getKeyArray = function() {
  return this.keyArray
}

function sortValue(keyHash) {
  let key
  let value
  let tempArray = []

  for (key in keyHash) {
    value = keyHash[key]
    tempArray.push([key, value])
  }

  tempArray.sort(function(a, b) {
    if (a[1] < b[1]) {
      return 1
    } else if (a[1] > b[1]) {
      return -1
    } else {
      return 0
    }
  })

  keyHash = {}
  for (let i = 0, length = tempArray.length, val; i < length; i++) {
    val = tempArray[i]
    keyHash[val[0]] = val[1]
  }

  return keyHash
}

module.exports = Keyword
