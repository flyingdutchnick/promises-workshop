'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:


var $Promise = function(){
	this.state = 'pending'
	this.changed = false;
	this.handlerGroups = [];
	this.callHandlers = function(num) {
		if (this.state !== 'pending') {
			this.handlerGroups.forEach(function(func) { 
		 		if(typeof func.successCb === 'function' && func.counter === 0 && func.rejected !== 'true') {
		 			func.counter++;
		 			return func.successCb(num);
				}
			}) 
		};
		if (this.state !== 'pending') {
			this.handlerGroups.forEach(function(func) { 
		 		if(typeof func.errorCb === 'function' && func.counter === 0) {
		 			func.counter++;
		 			func.rejected = true
		 			return func.errorCb(num);
				}
			}) 
		};
	}

	this.then = function(suc, reject){
		if ((typeof suc !== "function" || typeof suc === 'null') && (typeof reject === 'undefined' || typeof reject !== 'function')) {
			this.handlerGroups.push({successCb : false, errorCb: false});
		}
		else { 
			this.handlerGroups.push({successCb : suc, errorCb: reject, counter: 0, rejected: false}); 
		}
		this.callHandlers(this.value);	
	}
}

var Deferral = function(){
	this.$promise = new $Promise();
	this.resolve = function(value){
		if(this.$promise.state !== 'resolved' && this.$promise.changed !== true) {
			this.$promise.value = value;
			this.$promise.state = 'resolved';
			this.$promise.changed = true;
			this.$promise.callHandlers(this.$promise.value);
		} 
	}
	this.reject = function(value){
		if(this.$promise.state !== 'rejected' && this.$promise.changed !== true) {
			this.$promise.value = value;
			this.$promise.state = 'rejected';
			this.$promise.changed = true;
		} 
	}
}

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