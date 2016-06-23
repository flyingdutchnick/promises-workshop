'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:


var $Promise = function() {
	this.state = 'pending';
	this.handlerGroups = [];
}

function isFn (variable) {
	return typeof variable === 'function';
}

$Promise.prototype.then = function(successCb, errorCb) {
	var group = {
		successCb : isFn(successCb) ? successCb : null,
		errorCb : isFn(errorCb) ? errorCb : null
	};
	this.handlerGroups.push(group);
	this.callHandlers();
}

$Promise.prototype.catch = function(errorFn) {
	this.then(null, errorFn);
}

$Promise.prototype.callHandlers = function() {
	if (this.state === 'pending') return;
	var self = this;
	var handler;
	this.handlerGroups.forEach(function(group) {
		handler = (self.state === 'resolved') ? group.successCb : group.errorCb;
		if (handler) handler(self.value);
	})
	this.handlerGroups = [];
}

var Deferral = function(){
	this.$promise = new $Promise();
}

function settler (state, value) {
	if(this.$promise.state !== 'pending') { return };
	this.$promise.state = state;
	this.$promise.value = value;
	this.$promise.callHandlers();
}

Deferral.prototype.resolve = function(value) {
	settler.call(this, 'resolved', value);
};
Deferral.prototype.reject = function(value) {
	settler.call(this, 'rejected', value);
};


var defer = function(){
	return new Deferral();
}




/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/