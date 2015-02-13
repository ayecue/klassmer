/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var extend = require('../common/extend'),
	stack = require('./stack'),
	Listener = require('./listener');

/**
 *	Create method for class
 */
module.exports = function(klass,keyword,fn){
	var listener = new Listener(),
		method = function(context,args){
			var self = this,
				result;

			stack.p(method);
			listener.fire('before',context,[self]);
			result = fn.apply(context,args);
			listener.fire('after',context,[self,result]);
			stack.r();

			return result;
		};

	return extend(method,{
		$next : null,
		$last : null,
		$klass : klass,
		$name : keyword,
		$function : fn,
		$listener : listener
	});
};