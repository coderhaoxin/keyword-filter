'use strict';

var keyHash = {},
  keyArray = [];

var arrayToHash = function(ary) {
  var data, dataBuf;

  for (var i = 0, length = ary.length; i < length; i++) {
    data = ary[i];
    dataBuf = new Buffer(data);
    keyHash[data] = data.length;
  }

  keyHash = bySortedValue(keyHash);

  return keyHash;
};

var bySortedValue = function(keyHash) {
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
};

exports.initData = function(defaultData) {
  var key, value, results = [];

  arrayToHash(defaultData);

  for (key in keyHash) {
    value = keyHash[key];
    results.push(keyArray.push(key));
  }

  return results;
};

exports.getKeyArray = function() {
  return keyArray;
};
