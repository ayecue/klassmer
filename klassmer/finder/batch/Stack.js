/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
	CONSTANTS = require('../../constants');

module.exports = Klass.define('Klassmer.Finder.Batch.Stack',{
	requires: [
		'Klassmer.Finder.Batch.Stack.Generator'
	],
	constructor: function(){
		this.extend({
			trace: []
		});
	},
	add : function(node){
		var me = this,
			idx = me.trace.push(node) - 1;
			
		node.id = Klassmer.Finder.Batch.Stack.Generator.get();

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
});