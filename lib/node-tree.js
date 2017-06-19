'use strict'

function NodeTree() {
  this.nodeArray = {}
  this._isEnd = false
}

NodeTree.prototype.setNode = function(value, subNode) {
  this.nodeArray[value] = subNode
}

NodeTree.prototype.getNode = function(value) {
  return this.nodeArray[value]
}

NodeTree.prototype.setEnd = function(val) {
  this._isEnd = val
}

NodeTree.prototype.isEnd = function() {
  return this._isEnd
}

NodeTree.prototype.getNodeArray = function() {
  return this.nodeArray
}

module.exports = NodeTree
