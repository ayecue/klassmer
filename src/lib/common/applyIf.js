/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('./forEach'),
	toArray = require('./toArray'),
	typeOf = require('./typeOf');

function applyIf() {
	var args = toArray(arguments),
		src = args.shift() || {};
	
	return forEach(args,function(index,item){
		if (typeof item === 'object') {
			this.result = forEach(item,function(prop,child){
				var scope = this.result;

				if (typeOf(child) === 'object' && typeOf(scope[prop]) === 'object') {
					scope[prop] = applyIf(scope[prop],child);
				} else if (!this.result[prop] || child) {
					this.result[prop] = child;
				}
			},this.result);
		}
	},src);
};


module.exports = applyIf;