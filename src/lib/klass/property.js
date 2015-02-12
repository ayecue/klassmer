/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var extend = require('../common/extend'),
	typeOf = require('../common/typeOf'),
	method = require('./method'),
	logger = require('./logger');

/**
 *	Operations for extending properties
 */
var opts = {'function' : func,'default' : all};

function func(source,target,keyword,value){
	var mtd = method(source,keyword,value);

	source.isDebug() && mtd.$listener
		.on('before',function(base){
			logger(this,'start');
		})
		.on('after',function(base,result){
			logger(this,['returns:',result]);
		});

	target[keyword] = function(){return mtd(this,arguments);};
}

function all(source,target,keyword,value){
	(target.isPrototypeObject ? target.getDefaultValues() : target)[keyword] = value;
}

/**
 *	Execute property operation
 */
module.exports = function(source,target,keyword,value) {
	(opts[typeOf(value)] || opts['default']).apply(null,arguments);
};