/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var CONSTANTS = require('../../../../../constants'),
	Generator = require('../../../../../generic/generator');

function Stack(){
	var me = this;

	me.trace = [];
}

Stack.generator = new Generator(CONSTANTS.GENERATOR.STACK);

Stack.prototype = {
	self : Stack,
	add : function(node){
		var me = this,
			idx = me.trace.push(node) - 1;

		node.id = me.self.generator.get();

		if (idx !== 0) {
			node.$prev = me.trace[idx - 1];
		}

		return idx;
	},
	remove : function(idx){
		var me = this;

		if (idx in me.trace) {
			me.trace.splice(idx,1);
		}
	}
};

module.exports = Stack;