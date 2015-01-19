'use strict';

module.exports = Keyword;

function Keyword() {
  this.keyHash = {};
  this.keyArray = [];
}

Keyword.prototype.arrayToHash = function(ary) {
  var data, dataBuf;

  for (var i = 0; i < ary.length; i++) {
    data = ary[i];
    dataBuf = new Buffer(data);
    this.keyHash[data] = data.length;
  }

  this.keyHash = sortValue(this.keyHash);

  return this.keyHash;
};

Keyword.prototype.initData = function(defaultData) {
  var results = [],
    value;

  this.arrayToHash(defaultData);

  for (var key in this.keyHash) {
    value = this.keyHash[key];
    results.push(this.keyArray.push(key));
  }

  return results;
};

Keyword.prototype.getKeyArray = function() {
  return this.keyArray;
};

function sortValue(keyHash) {
  var key, value, tempArray = [];

  for (key in keyHash) {
    value = keyHash[key];
    tempArray.push([key, value]);
  }

  tempArray.sort(function(a, b) {
    if (a[1] < b[1]) {
      return 1;
    } else if (a[1] > b[1]) {
      return -1;
    } else {
      return 0;
    }
  });

  keyHash = {};
  for (var i = 0, length = tempArray.length, val; i < length; i++) {
    val = tempArray[i];
    keyHash[val[0]] = val[1];
  }

  return keyHash;
}
